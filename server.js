require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialisation de la base de données
const DB_PATH = './chat.db'; // Chemin de la base de données
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table users', err.message);
            } else {
                console.log('Table users créée ou déjà existante.');
                db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
                    if (err) {
                        console.error('Erreur lors de la vérification des utilisateurs', err.message);
                    } else if (row.count === 0) {
                        bcrypt.hash('password', 10, (err, hash) => {
                            if (err) {
                                console.error('Erreur lors du hachage du mot de passe', err.message);
                            } else {
                                db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['testuser', hash], (err) => {
                                    if (err) {
                                        console.error('Erreur lors de l\'insertion de l\'utilisateur par défaut', err.message);
                                    } else {
                                        console.log('Utilisateur par défaut "testuser" créé.');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS chat_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table chat_sessions', err.message);
            } else {
                console.log('Table chat_sessions créée ou déjà existante.');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            sender TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table messages', err.message);
            } else {
                console.log('Table messages créée ou déjà existante.');
            }
        });
    }
});

// Modèles
class User {
    static create(username, password, callback) {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return callback(err);
            }
            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
                if (err) {
                    return callback(err);
                }
                callback(null, { id: this.lastID, username: username });
            });
        });
    }

    static findByUsername(username, callback) {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                return callback(err);
            }
            callback(null, row);
        });
    }

    static comparePassword(password, hash, callback) {
        bcrypt.compare(password, hash, (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    }
}

class ChatSession {
    static create(userId, title, callback) {
        db.run('INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)', [userId, title], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null, { id: this.lastID, user_id: userId, title: title });
        });
    }

    static findByUserId(userId, callback) {
        db.all('SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
            if (err) {
                return callback(err);
            }
            callback(null, rows);
        });
    }

    static findById(sessionId, callback) {
        db.get('SELECT * FROM chat_sessions WHERE id = ?', [sessionId], (err, row) => {
            if (err) {
                return callback(err);
            }
            callback(null, row);
        });
    }

    static addMessage(sessionId, sender, content, callback) {
        db.run('INSERT INTO messages (session_id, sender, content) VALUES (?, ?, ?)', [sessionId, sender, content], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null, { id: this.lastID, session_id: sessionId, sender: sender, content: content });
        });
    }

    static getMessages(sessionId, callback) {
        db.all('SELECT * FROM messages WHERE session_id = ? ORDER BY timestamp ASC', [sessionId], (err, rows) => {
            if (err) {
                return callback(err);
            }
            callback(null, rows);
        });
    }
}

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes d'authentification
const authRouter = express.Router();
authRouter.post('/register', (req, res) => {
    console.log('Requête POST /api/auth/register reçue');
    const { username, password } = req.body;
    User.create(username, password, (err, user) => {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ message: 'Nom d\'utilisateur déjà pris.' });
            }
            return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur.' });
        }
        res.status(201).json({ message: 'Utilisateur enregistré avec succès.', user: { id: user.id, username: user.username } });
    });
});

authRouter.post('/login', (req, res) => {
    console.log('Requête POST /api/auth/login reçue');
    const { username, password } = req.body;
    User.findByUsername(username, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
            }
            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
            res.json({ message: 'Connexion réussie.', token: token, user: { id: user.id, username: user.username } });
        });
    });
});
app.use('/api/auth', authRouter);

// Routes de chat
const chatRouter = express.Router();
chatRouter.post('/sessions', authenticateToken, (req, res) => {
    console.log('Requête POST /api/chat/sessions reçue');
    const { title } = req.body;
    const userId = req.user.id;
    ChatSession.create(userId, title, (err, session) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la création de la session de chat.' });
        }
        res.status(201).json(session);
    });
});

chatRouter.get('/sessions', authenticateToken, (req, res) => {
    console.log('Requête GET /api/chat/sessions reçue');
    const userId = req.user.id;
    ChatSession.findByUserId(userId, (err, sessions) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des sessions de chat.' });
        }
        res.json(sessions);
    });
});

chatRouter.get('/sessions/:id/messages', authenticateToken, (req, res) => {
    console.log(`Requête GET /api/chat/sessions/${req.params.id}/messages reçue`);
    const sessionId = req.params.id;
    ChatSession.getMessages(sessionId, (err, messages) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des messages.' });
        }
        res.json(messages);
    });
});

chatRouter.post('/sessions/:id/messages', authenticateToken, (req, res) => {
    console.log(`Requête POST /api/chat/sessions/${req.params.id}/messages reçue`);
    const sessionId = req.params.id;
    const { sender, content } = req.body;
    ChatSession.addMessage(sessionId, sender, content, (err, message) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de l\'ajout du message.' });
        }
        res.status(201).json(message);
    });
});
app.use('/api/chat', chatRouter);

// Proxy pour l'API OpenAI
app.post('/api/openai', async (req, res) => {
    try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization // Transférer la clé API
            },
            body: JSON.stringify(req.body)
        });

        const data = await openaiResponse.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur lors de la communication avec OpenAI:', error);
        res.status(500).json({ error: 'Erreur lors de la communication avec OpenAI.' });
    }
});

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '.')));

app.listen(PORT, () => {
    console.log(`Serveur unifié démarré sur le port ${PORT}`);
});
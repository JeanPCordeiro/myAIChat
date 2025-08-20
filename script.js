const authContainer = document.getElementById('auth-container');
const mainContainer = document.getElementById('main-container');
const authUsernameInput = document.getElementById('auth-username');
const authPasswordInput = document.getElementById('auth-password');
const registerButton = document.getElementById('register-button');
const loginButton = document.getElementById('login-button');
const authMessage = document.getElementById('auth-message');
const currentUsernameSpan = document.getElementById('current-username');

const newSessionButton = document.getElementById('new-session-button');
const sessionList = document.getElementById('session-list');

const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');

let OPENAI_API_KEY = '';
const OPENAI_API_URL = '/api/openai';
const BACKEND_API_URL = '/api'; // Le backend est maintenant sur le même serveur

let currentUser = null;
let currentSessionId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Demander la clé API OpenAI au démarrage
    OPENAI_API_KEY = prompt('Veuillez entrer votre clé API OpenAI:');
    if (!OPENAI_API_KEY) {
        alert('Clé API non fournie. L\'application ne pourra pas communiquer avec OpenAI.');
    }

    // Vérifier si un token existe déjà (utilisateur déjà connecté)
    const token = localStorage.getItem('token');
    if (token) {
        // Valider le token côté backend si nécessaire, ou simplement afficher l'interface
        // Pour l'instant, on suppose que le token est valide et on affiche l'interface
        const username = localStorage.getItem('username');
        if (username) {
            currentUser = { username: username };
            showMainApp();
            fetchChatSessions();
        }
    }
});

registerButton.addEventListener('click', registerUser);
loginButton.addEventListener('click', loginUser);
newSessionButton.addEventListener('click', createNewChatSession);
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function showMainApp() {
    authContainer.style.display = 'none';
    mainContainer.style.display = 'flex';
    currentUsernameSpan.textContent = currentUser ? currentUser.username : 'Invité';
}

function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function registerUser() {
    const username = authUsernameInput.value;
    const password = authPasswordInput.value;

    try {
        const response = await fetch(`${BACKEND_API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        authMessage.textContent = data.message;
        if (response.ok) {
            authMessage.style.color = 'green';
        } else {
            authMessage.style.color = 'red';
        }
    } catch (error) {
        authMessage.textContent = 'Erreur lors de l\'enregistrement.';
        authMessage.style.color = 'red';
        console.error('Erreur d\'enregistrement:', error);
    }
}

async function loginUser() {
    const username = authUsernameInput.value;
    const password = authPasswordInput.value;

    try {
        const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            currentUser = data.user;
            showMainApp();
            fetchChatSessions();
        } else {
            authMessage.textContent = data.message;
            authMessage.style.color = 'red';
        }
    } catch (error) {
        authMessage.textContent = 'Erreur lors de la connexion.';
        authMessage.style.color = 'red';
        console.error('Erreur de connexion:', error);
    }
}

async function fetchChatSessions() {
    sessionList.innerHTML = ''; // Clear existing sessions
    try {
        const response = await fetch(`${BACKEND_API_URL}/chat/sessions`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const sessions = await response.json();
        sessions.forEach(session => {
            const li = document.createElement('li');
            li.textContent = session.title;
            li.dataset.sessionId = session.id;
            li.addEventListener('click', () => selectChatSession(session.id));
            sessionList.appendChild(li);
        });
        if (sessions.length > 0) {
            selectChatSession(sessions[0].id); // Select the first session by default
        } else {
            addMessage('bot', 'Bienvenue! Créez une nouvelle session de chat pour commencer.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions de chat:', error);
        addMessage('bot', 'Erreur: Impossible de charger les sessions de chat.');
    }
}

async function createNewChatSession() {
    const title = prompt('Nom de la nouvelle session de chat:');
    if (!title) return;

    try {
        const response = await fetch(`${BACKEND_API_URL}/chat/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title })
        });
        const session = await response.json();
        if (response.ok) {
            fetchChatSessions(); // Refresh session list
            selectChatSession(session.id);
        } else {
            console.error('Erreur lors de la création de la session:', session);
            alert('Erreur lors de la création de la session de chat.');
        }
    } catch (error) {
        console.error('Erreur de création de session:', error);
        alert('Erreur de connexion lors de la création de la session.');
    }
}

async function selectChatSession(sessionId) {
    currentSessionId = sessionId;
    chatMessages.innerHTML = ''; // Clear messages
    try {
        const response = await fetch(`${BACKEND_API_URL}/chat/sessions/${sessionId}/messages`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const messages = await response.json();
        messages.forEach(msg => addMessage(msg.sender, msg.content));
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        addMessage('bot', 'Erreur: Impossible de charger les messages de cette session.');
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage('user', message);
    userInput.value = '';

    if (currentSessionId) {
        // Save message to backend
        try {
            await fetch(`${BACKEND_API_URL}/chat/sessions/${currentSessionId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ sender: 'user', content: message })
            });
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du message utilisateur:', error);
        }
    }

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();
        let botMessageContent = 'Erreur: Impossible d\'obtenir une réponse de l\'IA.';
        if (data.choices && data.choices.length > 0) {
            botMessageContent = data.choices[0].message.content;
            addMessage('bot', botMessageContent);
        } else {
            console.error('Erreur API OpenAI:', data);
        }

        if (currentSessionId) {
            // Save bot message to backend
            try {
                await fetch(`${BACKEND_API_URL}/chat/sessions/${currentSessionId}/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ sender: 'bot', content: botMessageContent })
                });
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement du message bot:', error);
            }
        }

    } catch (error) {
        addMessage('bot', 'Erreur: La communication avec l\'API a échoué.');
        console.error('Erreur de connexion:', error);
    }
}

// Message de bienvenue initial (sera affiché après connexion/enregistrement)
// addMessage('bot', 'Bonjour! Comment puis-je vous aider aujourd\'hui?');
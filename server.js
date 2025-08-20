const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Utiliser le port 3000 pour le proxy

app.use(cors());
app.use(express.json());

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '.')));

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

app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});
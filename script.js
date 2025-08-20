const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');

// Remplacez par votre clé API OpenAI réelle
let OPENAI_API_KEY = ''; // Sera défini par l'utilisateur
const OPENAI_API_URL = '/api/openai'; // Le proxy gérera la communication avec l'API OpenAI

// Demander la clé API à l'utilisateur au démarrage
document.addEventListener('DOMContentLoaded', () => {
    OPENAI_API_KEY = prompt('Veuillez entrer votre clé API OpenAI:');
    if (!OPENAI_API_KEY) {
        alert('Clé API non fournie. L\'application ne pourra pas communiquer avec OpenAI.');
    }
});

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage('user', message);
    userInput.value = '';

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Ou un autre modèle de votre choix
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            addMessage('bot', data.choices[0].message.content);
        } else {
            addMessage('bot', 'Erreur: Impossible d\'obtenir une réponse de l\'IA.');
            console.error('Erreur API OpenAI:', data);
        }
    } catch (error) {
        addMessage('bot', 'Erreur: La communication avec l\'API a échoué.');
        console.error('Erreur de connexion:', error);
    }
}

// Message de bienvenue initial
addMessage('bot', 'Bonjour! Comment puis-je vous aider aujourd\'hui?');
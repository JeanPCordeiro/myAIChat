# 0003. Technologies Utilisées

Date: 2025-08-20

## Statut

Proposé

## Contexte

L'application est une interface frontend pour l'API OpenAI. Elle nécessite des technologies pour le développement web côté client.

## Décision

Les technologies principales utilisées pour le frontend seront :
*   **HTML5, CSS3, JavaScript (ES6+):** Pour la structure, le style et la logique de base de l'application.
*   **Un framework JavaScript (ex: React):** Pour la construction de l'interface utilisateur réactive et la gestion de l'état. Le choix précis sera affiné.
*   **Un gestionnaire de paquets (ex: npm ou yarn):** Pour gérer les dépendances du projet.
*   **Un bundler (ex: Webpack ou Vite):** Pour compiler et optimiser le code frontend.
*   **Node.js et Express.js:** Pour le backend (proxy API OpenAI, gestion des utilisateurs et des sessions).
*   **SQLite:** Pour la persistance des données (utilisateurs, sessions de chat, historique des messages).
*   **Bibliothèque SQLite pour Node.js (ex: `sqlite3` ou `better-sqlite3`):** Pour interagir avec la base de données SQLite depuis le backend.

## Conséquences

*   **Positif:**
    *   Utilisation de standards web modernes et largement supportés.
    *   Productivité accrue grâce aux frameworks et outils de développement.
    *   Facilité d'intégration avec des bibliothèques tierces.
*   **Négatif:**
    *   Complexité initiale de la configuration de l'environnement de développement, incluant le backend et la base de données.
    *   Nécessite une connaissance des technologies choisies pour le frontend et le backend.
*   **Neutre:**
    *   Le choix spécifique du framework et des outils de build sera documenté dans un ADR ultérieur si nécessaire.
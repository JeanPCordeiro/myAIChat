# 0005. Gestion des Utilisateurs, Sessions et Persistance avec SQLite

Date: 2025-08-20

## Statut

Proposé

## Contexte

Suite à l'implémentation d'un proxy côté serveur pour la gestion CORS et la sécurisation de la clé API OpenAI, il est nécessaire d'étendre les fonctionnalités du backend pour inclure la gestion des utilisateurs, la gestion des sessions de chat individuelles pour chaque utilisateur, et la persistance de l'historique des conversations.

## Décision

Nous allons intégrer la gestion des utilisateurs et des sessions de chat directement dans le serveur unifié. Ce serveur sera responsable de :
- L'authentification et l'autorisation des utilisateurs.
- L'association des clés API OpenAI à des utilisateurs spécifiques.
- La création, la lecture, la mise à jour et la suppression des sessions de chat.
- La persistance de l'historique des messages de chaque session de chat.

Pour la persistance des données (utilisateurs, sessions, messages), nous utiliserons une base de données SQLite. SQLite est un système de gestion de base de données relationnelle léger, sans serveur, auto-contenu et transactionnel, ce qui le rend idéal pour les applications embarquées ou les backends de petite à moyenne taille.

## Conséquences

*   **Positif:**
    *   **Gestion des utilisateurs:** Permet une personnalisation de l'expérience utilisateur et une meilleure gestion des accès aux ressources (clés API).
    *   **Historique des sessions:** Les utilisateurs pourront retrouver leurs conversations précédentes, améliorant l'utilisabilité de l'application.
    *   **Persistance des données:** Assure que les données ne sont pas perdues entre les sessions.
    *   **Simplicité de SQLite:** Facile à intégrer et à gérer, ne nécessitant pas de serveur de base de données séparé.
    *   **Sécurité accrue:** Les clés API OpenAI peuvent être stockées de manière sécurisée côté serveur et associées à des utilisateurs authentifiés.

*   **Négatif:**
    *   **Complexité du backend:** Introduction d'une logique métier supplémentaire et d'une couche de persistance, augmentant la complexité du serveur proxy existant.
    *   **Scalabilité de SQLite:** Bien que suffisant pour les besoins initiaux, SQLite pourrait devenir un goulot d'étranglement pour des applications à très grande échelle ou nécessitant une concurrence élevée. Une migration vers une base de données plus robuste (ex: PostgreSQL, MySQL) pourrait être nécessaire à l'avenir.
    *   **Gestion des migrations:** Nécessité de gérer les schémas de base de données et les migrations si l'application évolue.

*   **Neutre:**
    *   Le choix de SQLite est adapté pour le MVP et les premières phases de développement.
    *   L'implémentation nécessitera l'ajout de bibliothèques Node.js pour interagir avec SQLite (ex: `sqlite3` ou `better-sqlite3`).
# 0001. Architecture Système

Date: 2025-08-20

## Statut

Proposé

## Contexte

L'application est une interface frontend pour l'API OpenAI, similaire à ChatGPT. Elle doit être intuitive, réactive et capable d'afficher les réponses de l'IA en temps réel.

## Décision

L'architecture système sera basée sur une application web monopage (SPA) utilisant un framework JavaScript moderne (par exemple, React, Vue ou Angular) pour le frontend. Un serveur unifié (Node.js/Express) servira à la fois le frontend, agira comme proxy pour l'API OpenAI, et gérera l'authentification des utilisateurs, les sessions de chat et la persistance des données dans une base de données SQLite.

## Conséquences

*   **Positif:**
    *   Expérience utilisateur fluide et réactive.
    *   Développement rapide du frontend grâce aux frameworks modernes.
    *   Réduction de la complexité côté serveur (pas de backend dédié pour l'API OpenAI).
*   **Négatif:**
    *   Complexité accrue due à l'ajout d'un backend avec gestion des utilisateurs et persistance des données.
    *   Nécessite la gestion d'une base de données (SQLite).
*   **Neutre:**
    *   Le choix spécifique du framework JavaScript sera une décision ultérieure.
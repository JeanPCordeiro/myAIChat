# 0001. Architecture Système

Date: 2025-08-20

## Statut

Proposé

## Contexte

L'application est une interface frontend pour l'API OpenAI, similaire à ChatGPT. Elle doit être intuitive, réactive et capable d'afficher les réponses de l'IA en temps réel.

## Décision

L'architecture système sera basée sur une application web monopage (SPA) utilisant un framework JavaScript moderne (par exemple, React, Vue ou Angular) pour le frontend. La communication avec l'API OpenAI se fera directement depuis le frontend.

## Conséquences

*   **Positif:**
    *   Expérience utilisateur fluide et réactive.
    *   Développement rapide du frontend grâce aux frameworks modernes.
    *   Réduction de la complexité côté serveur (pas de backend dédié pour l'API OpenAI).
*   **Négatif:**
    *   Dépendance directe à l'API OpenAI depuis le client, nécessitant une gestion sécurisée des clés API (par exemple, via un proxy si nécessaire, ou en s'assurant que les clés ne sont pas exposées côté client).
    *   Potentiels problèmes de CORS si l'API OpenAI ne configure pas les en-têtes appropriés.
*   **Neutre:**
    *   Le choix spécifique du framework JavaScript sera une décision ultérieure.
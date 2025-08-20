# 0004: Utilisation d'un proxy côté serveur pour la gestion CORS avec l'API OpenAI

Date: 2025-08-20

## Statut
Accepté

## Contexte
L'application frontend interagit directement avec l'API OpenAI. Lors des tests, une erreur CORS (`Access-Control-Allow-Origin`) a été rencontrée, empêchant les requêtes du frontend d'atteindre l'API OpenAI. Cette erreur est survenue même lorsque l'application était servie par un serveur web local, indiquant que l'API OpenAI ne renvoie pas les en-têtes CORS nécessaires pour autoriser les requêtes depuis l'origine de l'application.

## Décision
Pour résoudre le problème CORS de manière robuste et sécurisée, il a été décidé d'implémenter un proxy côté serveur. Ce proxy agira comme un intermédiaire entre l'application frontend et l'API OpenAI.

## Conséquences
*   **Résolution CORS**: Le proxy permettra d'ajouter les en-têtes `Access-Control-Allow-Origin` appropriés aux réponses de l'API OpenAI avant de les renvoyer au frontend, résolvant ainsi le problème CORS.
*   **Sécurité de la clé API**: La clé API OpenAI sera gérée côté serveur par le proxy, réduisant le risque d'exposition de la clé côté client.
*   **Complexité accrue**: L'ajout d'un composant serveur introduit une complexité supplémentaire à l'architecture du projet (déploiement, maintenance).
*   **Technologies utilisées**: Le proxy sera implémenté en Node.js avec le framework Express. La bibliothèque `cors` sera utilisée pour la gestion des en-têtes CORS et `node-fetch` (ou la fonction `fetch` native de Node.js si la version le permet) pour les requêtes vers l'API OpenAI.
*   **Modification du frontend**: Le fichier `script.js` du frontend a été modifié pour diriger les requêtes vers le point de terminaison du proxy (`/api/openai`) au lieu de l'URL directe de l'API OpenAI.
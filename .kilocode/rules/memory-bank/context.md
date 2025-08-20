# Context

## Current work focus
Implémentation initiale de l'application frontend OpenAI (HTML, CSS, JS).

## Recent changes
- Création du répertoire `adr` à la racine du projet.
- Création des ADRs `0001-architecture-systeme.md`, `0002-decisions-techniques-cles.md`, et `0003-technologies-utilisees.md`.
- Mise à jour de `architecture.md` et `tech.md` pour référencer les ADRs.
- Ajout du répertoire `features/` dans la banque de mémoire.
- Implémentation de la gestion de la clé API OpenAI via une saisie utilisateur au démarrage.
- Résolution du problème CORS en implémentant un proxy côté serveur (Node.js/Express) et en modifiant `script.js` pour utiliser ce proxy.
- Ajout du besoin de gestion des utilisateurs, des sessions de chat et de la persistance dans une base SQLite.
- Mise à jour de `features/chat.feature` pour inclure les scénarios de gestion des utilisateurs et des sessions.
- Création de l'ADR `0005-gestion-utilisateurs-sessions-sqlite.md`.
- Mise à jour de `adr/0001-architecture-systeme.md` et `adr/0003-technologies-utilisees.md` pour refléter l'ajout du backend de gestion des utilisateurs/sessions et de SQLite.
- Mise à jour des diagrammes d'architecture (`context.puml`, `container.puml`, `component.puml`) pour inclure le nouveau service backend et la base de données SQLite.

## Next steps
- Affiner le choix du framework JavaScript si nécessaire.
- Documenter les dépendances et l'environnement de développement.
- Mettre à jour la banque de mémoire pour refléter les changements significatifs.
- Implémenter le service backend pour la gestion des utilisateurs, des sessions et de la persistance.
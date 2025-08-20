# features/chat.feature

Fonctionnalité: Interaction avec l'IA via l'interface de chat

  En tant qu'utilisateur de l'application
  Je veux pouvoir interagir avec l'IA
  Afin d'obtenir des réponses à mes requêtes

  Scénario: Envoi d'une requête simple à l'IA
    Étant donné que je suis sur la page de chat
    Et qu'une clé API valide est configurée
    Et que le champ de saisie est vide
    Quand je saisis "Bonjour, comment vas-tu ?" dans le champ de saisie
    Et que je clique sur le bouton "Envoyer"
    Alors la requête est envoyée à l'API OpenAI
    Et je vois un indicateur de chargement

  Scénario: Affichage d'une réponse de l'IA
    Étant donné que j'ai envoyé une requête à l'IA
    Et qu'une clé API valide est configurée
    Quand je reçois une réponse de l'API OpenAI
    Alors l'indicateur de chargement disparaît
    Et la réponse de l'IA est affichée dans la conversation

  Scénario: Gestion des erreurs de l'API
    Étant donné que je suis sur la page de chat
    Et qu'une clé API valide est configurée
    Quand j'envoie une requête à l'IA
    Et que l'API OpenAI renvoie une erreur
    Alors un message d'erreur approprié est affiché
    Et la conversation n'est pas mise à jour avec une réponse erronée

  Fonctionnalité: Gestion sécurisée de la clé API

    En tant qu'utilisateur de l'application
    Je veux que ma clé API soit gérée de manière sécurisée
    Afin de protéger mes informations d'identification

    Scénario: Configuration de la clé API
      Étant donné que je suis sur la page de configuration
      Et que j'ai testé une clé API valide avec succès
      Quand je saisis cette clé API dans le champ de saisie
      Et que je clique sur "Enregistrer"
      Alors la clé API est stockée de manière sécurisée
      Et l'application est prête à interagir avec l'API OpenAI

    Scénario: Tester la clé API avant de l'enregistrer
      Étant donné que je suis sur la page de configuration
      Quand je saisis une clé API dans le champ de saisie
      Et que je clique sur le bouton "Tester la clé API"
      Alors une requête de test est envoyée à l'API OpenAI
      Et je vois un message indiquant si la clé est valide ou non

    Scénario: Tentative d'utilisation avec une clé API manquante
      Étant donné que je suis sur la page de chat
      Et qu'aucune clé API n'est configurée
      Quand j'essaie d'envoyer une requête à l'IA
      Alors un message m'invite à configurer ma clé API
      Et la requête n'est pas envoyée

    Scénario: Tentative d'utilisation avec une clé API invalide
      Étant donné que je suis sur la page de chat
      Et qu'une clé API invalide est configurée
      Quand j'envoie une requête à l'IA
      Alors un message d'erreur indique que la clé API est invalide
      Et la requête n'est pas envoyée
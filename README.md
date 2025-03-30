# Projets de Développement

Ce repository contient trois projets distincts développés dans le cadre d'une mission freelance:

## 1. Tracker de Prix de l'Or (`gold_price_tracker`)

Un script Python qui:
- Récupère le prix de l'or à Chicago toutes les 10 minutes
- Envoie les données par email aux utilisateurs configurés
- Fonctionne de manière autonome en production

### Technologies utilisées
- Python 3.6+
- API Alpha Vantage
- APScheduler pour la planification des tâches
- SMTP pour l'envoi d'emails

### Déploiement
Le script peut être déployé via:
- Service systemd (Linux)
- Docker
- Cron

[Voir documentation détaillée](gold_price_tracker/README.md)

## 2. Formateur de Conversation (`conversation_formatter`)

Une application web qui:
- Transforme un fichier texte de conversation en format visuel similaire à WhatsApp
- Affiche les messages dans des bulles avec noms des participants et horodatage
- Permet le chargement de fichiers ou la saisie directe dans l'interface

### Technologies utilisées
- HTML5, CSS3, JavaScript (ES6+)
- Application front-end pure sans dépendances

### Utilisation
Ouvrez simplement `index.html` dans un navigateur moderne.

[Voir documentation détaillée](conversation_formatter/README.md)

## 3. Modélisation MongoDB (`mongodb_model`)

Une conception de base de données MongoDB optimisée pour:
- Un système de chatbot avec clients, utilisateurs, et historique de conversation
- Des bots, scénarios et campagnes marketing

### Structure
- 7 collections principales: `clients`, `users`, `bots`, `conversations`, `messages`, `scenarios`, `campaigns`
- Modèles de données avec indexation optimisée
- Exemples de code pour l'utilisation avec Mongoose

### Technologies utilisées
- MongoDB
- Mongoose (ODM pour Node.js)

[Voir documentation détaillée](mongodb_model/README.md)

## Installation

Chaque projet est indépendant et contient ses propres instructions d'installation et d'utilisation dans son répertoire respectif.

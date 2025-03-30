# Formateur de Conversation

Une application web qui transforme un fichier texte de conversation en format visuel similaire à WhatsApp avec des bulles de messages, le nom des participants et l'horodatage.

## Fonctionnalités

- Chargement de fichiers de conversation au format texte
- Copier-coller de conversations directement dans l'application
- Formatage automatique avec reconnaissance des expéditeurs et des horodatages
- Interface visuelle similaire à WhatsApp
- Prise en charge des emojis basiques et des URL cliquables
- Responsive design (adapté aux mobiles et tablettes)

## Utilisation

1. Ouvrez `index.html` dans un navigateur web moderne
2. Chargez un fichier de conversation ou collez le texte directement
3. Cliquez sur "Convertir" pour visualiser la conversation au format WhatsApp
4. Vous pouvez aussi cliquer sur "Utiliser l'exemple" pour tester l'application avec une conversation préchargée

## Format attendu pour les conversations

L'application attend un format de texte précis pour analyser correctement la conversation :

```
YYYY-MM-DD HH:MM - Nom de l'expéditeur: Message
```

Exemple :
```
2023-05-10 14:30 - Jean Dupont: Bonjour tout le monde !
2023-05-10 14:32 - Marie Martin: Salut Jean ! Comment vas-tu ?
```

## Personnalisation

Vous pouvez personnaliser l'application en modifiant :
- Les couleurs et styles dans `css/styles.css`
- L'arrière-plan de conversation en remplaçant `assets/whatsapp-bg.png`
- La logique de traitement dans `js/script.js`

## Déploiement

Pour déployer cette application :
1. Copiez tous les fichiers sur votre serveur web
2. Assurez-vous que le serveur web peut servir des fichiers statiques
3. Accédez à l'application via le navigateur

Pour un déploiement local simple, vous pouvez utiliser :
```bash
# Avec Python
python -m http.server

# Avec Node.js
npx serve
```

## Technologies utilisées

- HTML5
- CSS3
- JavaScript (ES6+)
- Pas de dépendances externes 
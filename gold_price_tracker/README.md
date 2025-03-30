# Tracker de Prix de l'Or

Ce script Python récupère le prix de l'or à Chicago toutes les 10 minutes et envoie ces informations par email à une liste de destinataires configurée.

## Prérequis

- Python 3.6+
- Bibliothèques requises (installables via `pip install -r requirements.txt`) :
  - requests
  - apscheduler

## Configuration

1. Obtenir une clé API gratuite auprès d'Alpha Vantage : [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)

2. Modifier le fichier `config.json` avec :
   - Votre clé API Alpha Vantage
   - Les informations de votre serveur SMTP (pour Gmail, utilisez un mot de passe d'application)
   - La liste des destinataires des emails

## Déploiement en production

### Option 1 : Service systemd (Linux)

1. Créer un fichier systemd service `/etc/systemd/system/gold-tracker.service` :
```
[Unit]
Description=Gold Price Tracker Service
After=network.target

[Service]
User=votre_utilisateur
WorkingDirectory=/chemin/vers/gold_price_tracker
ExecStart=/usr/bin/python3 /chemin/vers/gold_price_tracker/gold_tracker.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

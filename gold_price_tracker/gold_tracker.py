#!/usr/bin/env python3
import requests
import smtplib
import time
import json
import os
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler("gold_tracker.log"), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

def load_config():
    config_path = os.path.join(os.path.dirname(__file__), 'config.json')
    try:
        with open(config_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"Fichier de configuration non trouvé: {config_path}")
        raise

def get_gold_price():
    config = load_config()
    api_key = config['api_key']
    
    try:
        url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=XAUUSD&apikey={api_key}"
        response = requests.get(url)
        response.raise_for_status() 
        
        data = response.json()
        logger.info(f"Réponse de l'API: {data}")
        
        global_quote = data.get('Global Quote', {})
        if global_quote and '05. price' in global_quote:
            price = global_quote['05. price']
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            logger.info(f"Prix de l'or récupéré: ${price} à {timestamp}")
            return {
                'price': price,
                'timestamp': timestamp
            }
        else:
            logger.error("Impossible d'extraire le prix de l'or des données reçues.")
            logger.error(f"Données reçues: {data}")
            return None
    except Exception as e:
        logger.error(f"Erreur lors de la récupération du prix de l'or: {str(e)}")
        return None

def send_gold_price_email(gold_data):
    if not gold_data:
        logger.error("Aucune donnée à envoyer par email.")
        return
    
    config = load_config()
    smtp_config = config['smtp']
    recipients = config['recipients']
    
    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_config['sender_email']
        msg['To'] = ", ".join(recipients)
        msg['Subject'] = f"Prix de l'or - {datetime.now().strftime('%d/%m/%Y %H:%M')}"
        
        body = f"""
        <html>
          <body>
            <h2>Mise à jour du prix de l'or</h2>
            <p>Prix actuel: <strong>${gold_data['price']}</strong></p>
            <p>Horodatage: {gold_data['timestamp']}</p>
            <p>Ce message est généré automatiquement. Merci de ne pas y répondre.</p>
          </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))
        
        with smtplib.SMTP(smtp_config['server'], smtp_config['port']) as server:
            if smtp_config.get('use_tls', False):
                server.starttls()
            
            if smtp_config.get('username') and smtp_config.get('password'):
                server.login(smtp_config['username'], smtp_config['password'])
            
            server.send_message(msg)
            
        logger.info(f"Email envoyé à {len(recipients)} destinataire(s)")
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de l'email: {str(e)}")

def job():
    logger.info("Démarrage de la tâche planifiée")
    gold_data = get_gold_price()
    if gold_data:
        send_gold_price_email(gold_data)
    else:
        logger.error("Impossible d'envoyer l'email car les données du prix de l'or sont manquantes")

if __name__ == "__main__":
    logger.info("Démarrage du service de suivi du prix de l'or")
    
    job()
    
    scheduler = BlockingScheduler()
    scheduler.add_job(job, 'interval', minutes=10)
    
    try:
        logger.info("Le planificateur a démarré. Appuyez sur Ctrl+C pour quitter.")
        scheduler.start()
    except KeyboardInterrupt:
        logger.info("Service arrêté manuellement")
    except Exception as e:
        logger.error(f"Erreur non prévue: {str(e)}") 
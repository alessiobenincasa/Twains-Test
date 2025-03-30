# Modélisation MongoDB pour un Système de Chatbot

Ce document présente une modélisation optimisée pour MongoDB destinée à un système de chatbot comportant des clients, des utilisateurs, des historiques de conversation, des bots et des scénarios de campagne.

## Objectifs de la Modélisation

- Optimiser les requêtes fréquentes
- Minimiser les opérations de jointure
- Garantir la scalabilité
- Éviter la duplication excessive de données

## Structure des Collections

### 1. Collection `clients`

```javascript
{
  _id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2e"),
  name: "Entreprise ABC",
  token: "abc123token456",
  phone_numbers: ["+33123456789", "+33987654321"],
  created_at: ISODate("2023-01-15T10:30:00Z"),
  updated_at: ISODate("2023-05-20T14:45:00Z"),
  status: "active",
  bots: [
    {
      bot_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2a"),
      name: "Bot Commercial",
      default: true
    },
    {
      bot_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2b"),
      name: "Bot Support",
      default: false
    }
  ]
}
```

### 2. Collection `bots`

```javascript
{
  _id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2a"),
  client_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2e"),
  name: "Bot Commercial",
  description: "Bot dédié à la vente et présentation produits",
  avatar_url: "https://example.com/avatars/sales-bot.png",
  created_at: ISODate("2023-01-15T10:35:00Z"),
  updated_at: ISODate("2023-05-20T14:45:00Z"),
  status: "active",
  capabilities: ["product_info", "pricing", "promotions"],
  welcome_message: "Bonjour ! Je suis le bot commercial de l'entreprise ABC. Comment puis-je vous aider ?",
  scenarios: [
    ObjectId("5f8a7b6c9d8e7f6a5b4c3d30"),
    ObjectId("5f8a7b6c9d8e7f6a5b4c3d31")
  ]
}
```

### 3. Collection `users`

```javascript
{
  _id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d20"),
  client_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2e"),
  phone_number: "+33612345678",
  first_name: "Jean",
  last_name: "Dupont",
  email: "jean.dupont@example.com",
  age: 35,
  created_at: ISODate("2023-02-10T09:45:00Z"),
  updated_at: ISODate("2023-05-22T16:30:00Z"),
  preferences: {
    language: "fr",
    notifications: true,
    communication_channels: ["sms", "email"]
  },
  tags: ["premium", "interested_in_product_A"],
  last_interaction: ISODate("2023-05-22T16:30:00Z"),
  metadata: {
    acquisition_source: "website",
    customer_segment: "B2C",
    lifetime_value: 1250.75
  }
}
```

### 4. Collection `conversations`

```javascript
{
  _id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d40"),
  client_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2e"),
  user_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d20"),
  bot_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2a"),
  started_at: ISODate("2023-05-22T16:20:00Z"),
  ended_at: ISODate("2023-05-22T16:30:00Z"),
  status: "completed",
  summary: "Demande d'informations sur le Produit A et possibilités de remise",
  campaign_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d50"),
  scenario_path: ["welcome", "product_info", "pricing", "discount_request", "human_handoff"],
  metadata: {
    source: "whatsapp",
    user_satisfaction: 4,
    conversion: true
  }
}
```

### 5. Collection `messages`

```javascript
{
  _id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d60"),
  conversation_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d40"),
  client_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2e"),
  user_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d20"),
  bot_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2a"),
  sender_type: "user", // "user", "bot", "human_agent"
  sender_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d20"),
  recipient_type: "bot",
  recipient_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2a"),
  timestamp: ISODate("2023-05-22T16:25:30Z"),
  content: "Bonjour, j'aimerais avoir des informations sur le Produit A",
  content_type: "text", // "text", "image", "video", "audio", "file"
  metadata: {
    intent: "product_inquiry",
    confidence: 0.95,
    entities: [
      {
        name: "product",
        value: "Produit A"
      }
    ],
    sentiment: "positive"
  },
  status: "delivered" // "sent", "delivered", "read", "failed"
}
```

### 6. Collection `scenarios`

```javascript
{
  _id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d30"),
  client_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2e"),
  bot_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2a"),
  name: "Présentation Produit et Transfert Vendeur",
  description: "Scénario pour présenter les produits et rediriger vers un vendeur si nécessaire",
  created_at: ISODate("2023-01-16T11:30:00Z"),
  updated_at: ISODate("2023-05-18T10:15:00Z"),
  version: 2,
  status: "active",
  workflow: {
    start_node: "welcome",
    nodes: {
      "welcome": {
        message: "Bonjour ! Je suis là pour vous aider à découvrir nos produits. Que souhaitez-vous savoir ?",
        options: [
          {
            text: "Informations produit",
            next_node: "product_info"
          },
          {
            text: "Parler à un vendeur",
            next_node: "human_handoff"
          }
        ],
        fallback: "intent_recognition"
      },
      "product_info": {
        message: "Voici nos produits phares : Produit A, Produit B et Produit C. Lequel vous intéresse ?",
        options: [
          {
            text: "Produit A",
            next_node: "product_a_details"
          },
          {
            text: "Produit B",
            next_node: "product_b_details"
          },
          {
            text: "Produit C",
            next_node: "product_c_details"
          },
          {
            text: "Parler à un vendeur",
            next_node: "human_handoff"
          }
        ]
      },
      "human_handoff": {
        message: "Je vous mets en relation avec un vendeur. Voici un lien pour prendre rendez-vous : https://example.com/rdv",
        action: {
          type: "send_link",
          url: "https://example.com/rdv?utm_source=bot&utm_campaign=product_inquiry"
        },
        next_node: "end"
      },
      "end": {
        message: "Merci d'avoir échangé avec nous ! N'hésitez pas à revenir si vous avez d'autres questions."
      }
    }
  }
}
```

### 7. Collection `campaigns`

```javascript
{
  _id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d50"),
  client_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2e"),
  name: "Lancement Produit A - Été 2023",
  description: "Campagne de promotion pour le lancement du Produit A",
  status: "active",
  start_date: ISODate("2023-06-01T00:00:00Z"),
  end_date: ISODate("2023-08-31T23:59:59Z"),
  created_at: ISODate("2023-05-01T14:30:00Z"),
  updated_at: ISODate("2023-05-25T09:45:00Z"),
  target_audience: ["new_customers", "existing_premium_customers"],
  products: [
    {
      name: "Produit A",
      description: "Notre nouveau produit révolutionnaire",
      price: 199.99,
      image_url: "https://example.com/images/product_a.jpg",
      promo_code: "ETE2023",
      discount_percentage: 15
    }
  ],
  scenario_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d30"),
  performance: {
    impressions: 12500,
    conversations_started: 3200,
    conversions: 450,
    revenue: 76545.50,
    roi: 3.8
  }
}
```

## Justification de la Modélisation

1. **Structure dénormalisée stratégique**
   - Les références aux bots sont intégrées dans `clients` pour un accès rapide
   - Les conversations contiennent un résumé du parcours utilisateur pour faciliter les analyses

2. **Séparation des messages et conversations**
   - Permet de gérer efficacement un grand volume de messages
   - Facilite les requêtes ciblées (retrouver facilement les conversations sans charger tous les messages)

3. **Références bidirectionnelles**
   - Facilite les requêtes dans les deux sens (ex: trouver tous les bots d'un client ou retrouver le client propriétaire d'un bot)

4. **Indexation recommandée**
   - Indexer `client_id`, `user_id`, `phone_number` dans toutes les collections pertinentes
   - Indexer `conversation_id` dans la collection messages
   - Créer des index composites pour les requêtes courantes (ex: `{client_id: 1, status: 1}`)

## Requêtes Courantes Optimisées

1. Trouver tous les messages d'une conversation :
```javascript
db.messages.find({ conversation_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d40") }).sort({ timestamp: 1 })
```

2. Trouver toutes les conversations d'un utilisateur :
```javascript
db.conversations.find({ user_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d20") }).sort({ started_at: -1 })
```

3. Récupérer les informations utilisateur par numéro de téléphone :
```javascript
db.users.findOne({ phone_number: "+33612345678" })
```

4. Trouver tous les scénarios associés à un bot :
```javascript
db.scenarios.find({ bot_id: ObjectId("5f8a7b6c9d8e7f6a5b4c3d2a") })
```

## Considérations de Scaling

- Les collections `messages` et `conversations` vont croître très rapidement
- Considérer une stratégie d'archivage pour les anciennes conversations
- Utiliser le sharding MongoDB pour distribuer les données par `client_id`
- Mettre en place une politique de TTL (Time To Live) pour certaines données 
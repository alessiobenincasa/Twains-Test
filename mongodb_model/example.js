// Exemple d'utilisation du modèle MongoDB avec Node.js et Mongoose
const mongoose = require('mongoose');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/chatbot_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion MongoDB:', err));

// Définition des schémas
const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  phone_numbers: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  bots: [{
    bot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot' },
    name: String,
    default: Boolean
  }]
});

const botSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  name: { type: String, required: true },
  description: String,
  avatar_url: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  capabilities: [String],
  welcome_message: String,
  scenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' }]
});

const userSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  phone_number: { type: String, required: true },
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  preferences: {
    language: { type: String, default: 'fr' },
    notifications: { type: Boolean, default: true },
    communication_channels: [String]
  },
  tags: [String],
  last_interaction: Date,
  metadata: mongoose.Schema.Types.Mixed
});

const conversationSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot', required: true },
  started_at: { type: Date, default: Date.now },
  ended_at: Date,
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
  summary: String,
  campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  scenario_path: [String],
  metadata: mongoose.Schema.Types.Mixed
});

const messageSchema = new mongoose.Schema({
  conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot' },
  sender_type: { type: String, enum: ['user', 'bot', 'human_agent'], required: true },
  sender_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  recipient_type: { type: String, enum: ['user', 'bot', 'human_agent'], required: true },
  recipient_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  timestamp: { type: Date, default: Date.now },
  content: { type: String, required: true },
  content_type: { type: String, enum: ['text', 'image', 'video', 'audio', 'file'], default: 'text' },
  metadata: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ['sent', 'delivered', 'read', 'failed'], default: 'sent' }
});

// Création des index importants
clientSchema.index({ token: 1 });
userSchema.index({ client_id: 1, phone_number: 1 }, { unique: true });
conversationSchema.index({ client_id: 1, user_id: 1, started_at: -1 });
messageSchema.index({ conversation_id: 1, timestamp: 1 });
messageSchema.index({ client_id: 1, user_id: 1, timestamp: -1 });

// Définition des modèles
const Client = mongoose.model('Client', clientSchema);
const Bot = mongoose.model('Bot', botSchema);
const User = mongoose.model('User', userSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema);
const Scenario = mongoose.model('Scenario', require('./scenarioSchema'));
const Campaign = mongoose.model('Campaign', require('./campaignSchema'));

// Exemples d'utilisation des modèles

// 1. Création d'un nouveau client avec un bot
async function createClientWithBot() {
  try {
    // Créer un client
    const client = await Client.create({
      name: "Entreprise XYZ",
      token: "xyz789token456",
      phone_numbers: ["+33123456789"],
      status: "active"
    });

    // Créer un bot pour ce client
    const bot = await Bot.create({
      client_id: client._id,
      name: "Bot Assistant",
      description: "Bot d'aide à la navigation",
      welcome_message: "Bonjour, je suis l'assistant de XYZ. Comment puis-je vous aider ?",
      capabilities: ["faq", "navigation", "contact"]
    });

    // Ajouter la référence du bot au client
    await Client.findByIdAndUpdate(client._id, {
      $push: { bots: { bot_id: bot._id, name: bot.name, default: true } }
    });

    console.log("Client et bot créés avec succès");
    return { client, bot };
  } catch (error) {
    console.error("Erreur lors de la création du client et du bot:", error);
    throw error;
  }
}

// 2. Trouver ou créer un utilisateur par numéro de téléphone
async function findOrCreateUser(clientId, phoneNumber, userData = {}) {
  try {
    let user = await User.findOne({ client_id: clientId, phone_number: phoneNumber });
    
    if (!user) {
      user = await User.create({
        client_id: clientId,
        phone_number: phoneNumber,
        ...userData,
        last_interaction: new Date()
      });
      console.log("Nouvel utilisateur créé");
    } else {
      // Mettre à jour les données utilisateur si nécessaire
      if (Object.keys(userData).length > 0) {
        user = await User.findByIdAndUpdate(
          user._id,
          { 
            ...userData,
            last_interaction: new Date(),
            updated_at: new Date()
          },
          { new: true }
        );
      }
      console.log("Utilisateur existant trouvé et mis à jour");
    }
    
    return user;
  } catch (error) {
    console.error("Erreur lors de la recherche/création de l'utilisateur:", error);
    throw error;
  }
}

// 3. Démarrer une nouvelle conversation
async function startConversation(clientId, userId, botId, campaignId = null) {
  try {
    const conversation = await Conversation.create({
      client_id: clientId,
      user_id: userId,
      bot_id: botId,
      started_at: new Date(),
      status: 'active',
      campaign_id: campaignId,
      scenario_path: ['welcome']
    });
    
    console.log("Nouvelle conversation démarrée:", conversation._id);
    return conversation;
  } catch (error) {
    console.error("Erreur lors du démarrage de la conversation:", error);
    throw error;
  }
}

// 4. Ajouter un message à une conversation
async function addMessage(conversationData, senderType, senderId, recipientType, recipientId, content, contentType = 'text', metadata = {}) {
  try {
    const message = await Message.create({
      conversation_id: conversationData._id,
      client_id: conversationData.client_id,
      user_id: conversationData.user_id,
      bot_id: conversationData.bot_id,
      sender_type: senderType,
      sender_id: senderId,
      recipient_type: recipientType,
      recipient_id: recipientId,
      timestamp: new Date(),
      content: content,
      content_type: contentType,
      metadata: metadata,
      status: 'sent'
    });
    
    if (metadata.scenario_node) {
      await Conversation.findByIdAndUpdate(
        conversationData._id,
        { 
          $push: { scenario_path: metadata.scenario_node },
          updated_at: new Date()
        }
      );
    }
    
    console.log("Message ajouté à la conversation");
    return message;
  } catch (error) {
    console.error("Erreur lors de l'ajout du message:", error);
    throw error;
  }
}

async function getConversationHistory(conversationId) {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation non trouvée");
    }
    
    const messages = await Message.find({ conversation_id: conversationId })
      .sort({ timestamp: 1 });
    
    console.log(`Récupération de ${messages.length} messages de la conversation`);
    return {
      conversation,
      messages
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    throw error;
  }
}
async function runExample() {
  try {
    const { client, bot } = await createClientWithBot();
    
    const user = await findOrCreateUser(client._id, "+33612345678", {
      first_name: "Sophie",
      last_name: "Martin",
      email: "sophie.martin@example.com"
    });
    
    const conversation = await startConversation(client._id, user._id, bot._id);
    
    await addMessage(
      conversation,
      'bot',
      bot._id,
      'user',
      user._id,
      "Bonjour Sophie ! Comment puis-je vous aider aujourd'hui ?",
      'text',
      { scenario_node: 'welcome' }
    );
    
    await addMessage(
      conversation,
      'user',
      user._id,
      'bot',
      bot._id,
      "J'aimerais des informations sur vos services",
      'text',
      { 
        intent: 'service_inquiry',
        confidence: 0.92,
        scenario_node: 'service_info'
      }
    );
    
    const history = await getConversationHistory(conversation._id);
    console.log("Historique de la conversation:", JSON.stringify(history, null, 2));
    
  } catch (error) {
    console.error("Erreur dans l'exemple:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Connexion MongoDB fermée");
  }
}

runExample(); 
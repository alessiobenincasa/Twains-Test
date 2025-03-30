const mongoose = require('mongoose');

// Schéma pour les produits dans une campagne
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  image_url: String,
  promo_code: String,
  discount_percentage: Number,
  metadata: mongoose.Schema.Types.Mixed
}, { _id: false });

// Schéma pour les performances d'une campagne
const performanceSchema = new mongoose.Schema({
  impressions: { type: Number, default: 0 },
  conversations_started: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  roi: { type: Number, default: 0 },
  metrics_by_day: [{
    date: Date,
    impressions: Number,
    conversations: Number,
    conversions: Number,
    revenue: Number
  }]
}, { _id: false });

// Schéma principal pour les campagnes
const campaignSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  name: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['draft', 'scheduled', 'active', 'paused', 'completed'], default: 'draft' },
  start_date: { type: Date, required: true },
  end_date: Date,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  target_audience: [String],
  products: [productSchema],
  scenario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' },
  performance: { type: performanceSchema, default: () => ({}) },
  budget: {
    total: Number,
    spent: { type: Number, default: 0 }
  },
  tags: [String],
  metadata: mongoose.Schema.Types.Mixed
});

campaignSchema.index({ client_id: 1, status: 1 });
campaignSchema.index({ client_id: 1, start_date: -1 });
campaignSchema.index({ status: 1, start_date: 1, end_date: 1 });

module.exports = campaignSchema; 
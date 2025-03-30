const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  message: { type: String, required: true },
  options: [{
    text: String,
    next_node: String
  }],
  fallback: String,
  action: {
    type: { type: String },
    url: String,
    data: mongoose.Schema.Types.Mixed
  },
  next_node: String
}, { _id: false });

const scenarioSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  bot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot', required: true },
  name: { type: String, required: true },
  description: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  version: { type: Number, default: 1 },
  status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft' },
  workflow: {
    start_node: { type: String, required: true },
    nodes: { type: Map, of: nodeSchema, required: true }
  },
  tags: [String],
  metadata: mongoose.Schema.Types.Mixed
});

scenarioSchema.index({ client_id: 1, bot_id: 1, status: 1 });
scenarioSchema.index({ client_id: 1, name: 1 });

module.exports = scenarioSchema; 
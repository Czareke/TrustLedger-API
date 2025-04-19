// src/models/account.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User reference is required'] },
  type: { type: String, enum: ['checking', 'savings'], required: [true, 'Account type is required'] },
  balance: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);


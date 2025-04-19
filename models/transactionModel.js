
// src/models/transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: [true, 'Source account is required'] },
  toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: [true, 'Destination account is required'] },
  type: { type: String, enum: ['transfer', 'deposit', 'withdrawal'], required: [true, 'Transaction type is required'] },
  amount: { type: Number, required: [true, 'Amount is required'] },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

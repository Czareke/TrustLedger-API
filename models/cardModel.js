    // src/models/card.js
    const mongoose = require('mongoose');

    const cardSchema = new mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: [true, 'Account reference is required'] },
    cardNumber: { type: String, required: [true, 'Card number is required'], unique: true },
    expiryMonth: { type: Number, required: [true, 'Expiry month is required'] },
    expiryYear: { type: Number, required: [true, 'Expiry year is required'] },
    cvv: { type: String, required: [true, 'CVV is required'], select: false },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' }
    }, { timestamps: true });

    module.exports = mongoose.model('Card', cardSchema);

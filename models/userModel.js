    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const crypto = require('crypto');
    const validator = require("validator");

    const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true, 
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"], },
    password: { type: String, required: [true, 'Password is required'], select: false },
    passwordConfirm: { type: String, required: [true, 'Please confirm your password'], select: false },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer', required: [true, 'Role is required'] },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: { type: Boolean, default: true }
    }, { timestamps: true });

    // Pre-save middleware to hash password
    userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
    });

    // Pre-save middleware to update timestamps
    userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
    });

    // Instance method to check if password is correct
    userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    if (!candidatePassword || !userPassword) return false;
    return await bcrypt.compare(candidatePassword, userPassword);
    };

    // Instance method to create password reset token
    userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
    };

    // Query middleware to filter out inactive users
    userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } });
    next();
    });

    module.exports = mongoose.model('User', userSchema);


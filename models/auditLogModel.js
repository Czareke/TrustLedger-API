const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'TRANSFER', 'DEPOSIT', 'WITHDRAW']
    },
    resourceType: {
        type: String,
        required: true,
        enum: ['USER', 'ACCOUNT', 'TRANSACTION', 'CARD', 'SYSTEM']
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILURE', 'PENDING'],
        default: 'SUCCESS'
    },
    changes: {
        type: Object,
        default: null
    }
}, {
    timestamps: true
});

// Index for better query performance
auditLogSchema.index({ user: 1, action: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
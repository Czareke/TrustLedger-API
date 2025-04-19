const User = require('../models/userModel');
const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel');
const AuditLog = require('../models/auditLogModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
        .select('-password')
        .skip(skip)
        .limit(limit);

    if (!users) {
        return next(new AppError('No users found', 404));
    }

    const total = await User.countDocuments();

    res.status(200).json({
        status: 'success',
        results: users.length,
        total,
        data: { users }
    });
});

exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const { role, status } = req.body;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role, status },
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    // Send email notification for status change
    await sendEmail({
        email: user.email,
        subject: 'Account Status Update',
        message: `Your account status has been updated to: ${status}`
    });

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.getSystemStats = catchAsync(async (req, res, next) => {
    const stats = await Promise.all([
        User.countDocuments(),
        Account.countDocuments(),
        Transaction.countDocuments(),
        Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ])
    ]);

    if (!stats) {
        return next(new AppError('Error fetching system statistics', 500));
    }

    res.status(200).json({
        status: 'success',
        data: {
            totalUsers: stats[0],
            totalAccounts: stats[1],
            totalTransactions: stats[2],
            totalTransactionAmount: stats[3][0]?.totalAmount || 0
        }
    });
});

exports.getAuditLogs = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find()
        .populate('user', 'name email')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);

    if (!logs) {
        return next(new AppError('No audit logs found', 404));
    }

    const total = await AuditLog.countDocuments();

    res.status(200).json({
        status: 'success',
        results: logs.length,
        total,
        data: { logs }
    });
});

exports.freezeAccount = catchAsync(async (req, res, next) => {
    const account = await Account.findByIdAndUpdate(
        req.params.accountId,
        { status: 'frozen' },
        { new: true }
    );

    if (!account) {
        return next(new AppError('No account found with that ID', 404));
    }

    // Send email notification
    const user = await User.findById(account.user);
    await sendEmail({
        email: user.email,
        subject: 'Account Frozen',
        message: 'Your account has been frozen. Please contact support for more information.'
    });

    res.status(200).json({
        status: 'success',
        data: { account }
    });
});

exports.adjustBalance = catchAsync(async (req, res, next) => {
    const { amount, reason } = req.body;

    const account = await Account.findById(req.params.accountId);
    if (!account) {
        return next(new AppError('No account found with that ID', 404));
    }

    account.balance += amount;
    await account.save();

    // Log the adjustment
    await AuditLog.create({
        user: req.user._id,
        action: 'UPDATE',
        resourceType: 'ACCOUNT',
        resourceId: account._id,
        description: `Balance adjusted by ${amount}. Reason: ${reason}`,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
    });

    res.status(200).json({
        status: 'success',
        data: { account }
    });
});
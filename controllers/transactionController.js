const Transaction = require('../models/transactionModel');
const Account = require('../models/accountModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.transfer = catchAsync(async (req, res, next) => {
    const { fromAccountId, toAccountId, amount } = req.body;

    const fromAccount = await Account.findOne({
        _id: fromAccountId,
        user: req.user.id,
        status: 'active'
    });

    if (!fromAccount) {
        return next(new AppError('Source account not found or inactive', 404));
    }

    if (fromAccount.balance < amount) {
        return next(new AppError('Insufficient funds', 400));
    }

    const toAccount = await Account.findOne({
        _id: toAccountId,
        status: 'active'
    });

    if (!toAccount) {
        return next(new AppError('Destination account not found or inactive', 404));
    }

    // Create transaction
    const transaction = await Transaction.create({
        fromAccount: fromAccountId,
        toAccount: toAccountId,
        amount,
        type: 'transfer',
        status: 'completed'
    });

    // Update account balances
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await Promise.all([
        fromAccount.save(),
        toAccount.save()
    ]);

    res.status(201).json({
        status: 'success',
        data: { transaction }
    });
});

exports.getTransactionHistory = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({
        $or: [
            { fromAccount: req.params.accountId },
            { toAccount: req.params.accountId }
        ]
    })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

    const total = await Transaction.countDocuments({
        $or: [
            { fromAccount: req.params.accountId },
            { toAccount: req.params.accountId }
        ]
    });

    res.status(200).json({
        status: 'success',
        results: transactions.length,
        total,
        data: { transactions }
    });
});
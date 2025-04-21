const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createAccount = catchAsync(async (req, res, next) => {
    const account = await Account.create({
        user: req.user.id,
        type: req.body.type,
        balance: 0
    });

    res.status(201).json({
        status: 'success',
        data: { account }
    });
});

exports.getMyAccounts = catchAsync(async (req, res, next) => {
    const accounts = await Account.find({ user: req.user.id });

    res.status(200).json({
        status: 'success',
        results: accounts.length,
        data: { accounts }
    });
});

exports.getAccountBalance = catchAsync(async (req, res, next) => {
    const account = await Account.findOne({
        _id: req.params.accountId,
        user: req.user.id
    });

    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            balance: account.balance
        }
    });
});

exports.closeAccount = catchAsync(async (req, res, next) => {
    const account = await Account.findOneAndUpdate(
        {
            _id: req.params.accountId,
            user: req.user.id,
            balance: 0
        },
        { status: 'closed' },
        { new: true }
    );

    if (!account) {
        return next(new AppError('Account not found or balance is not zero', 400));
    }

    res.status(200).json({
        status: 'success',
        data: { account }
    });
});
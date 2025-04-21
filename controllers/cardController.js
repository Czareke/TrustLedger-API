const Card = require('../models/cardModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.requestCard = catchAsync(async (req, res, next) => {
    const { accountId, type } = req.body;

    const card = await Card.create({
        account: accountId,
        type,
        status: 'pending'
    });

    res.status(201).json({
        status: 'success',
        data: { card }
    });
});

exports.getMyCards = catchAsync(async (req, res, next) => {
    const cards = await Card.find({ user: req.user.id })
        .populate('account');

    res.status(200).json({
        status: 'success',
        results: cards.length,
        data: { cards }
    });
});

exports.activateCard = catchAsync(async (req, res, next) => {
    const card = await Card.findOneAndUpdate(
        {
            _id: req.params.cardId,
            user: req.user.id,
            status: 'pending'
        },
        { status: 'active' },
        { new: true }
    );

    if (!card) {
        return next(new AppError('Card not found or already activated', 400));
    }

    res.status(200).json({
        status: 'success',
        data: { card }
    });
});

exports.blockCard = catchAsync(async (req, res, next) => {
    const card = await Card.findOneAndUpdate(
        {
            _id: req.params.cardId,
            user: req.user.id
        },
        { status: 'blocked' },
        { new: true }
    );

    if (!card) {
        return next(new AppError('Card not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { card }
    });
});
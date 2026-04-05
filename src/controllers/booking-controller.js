const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const { message } = require('../utils/common/error-response');

const inMemDb = {};

async function createBooking(req, res){
    try {
        const response = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats
        });

        SuccessResponse.data = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = {
            message: error.message || 'An unexpected error occurred',
            explanation: error.explanation || [] 
        };
        return res
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}

async function makePayment(req, res){
    const idempotencyKey = req.headers['x-idempotency-key'];

    if (!idempotencyKey) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'x-idempotency-key header is required for payments' });
    }

    if (inMemDb[idempotencyKey]) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Cannot retry on a successful payment' });
    }
    try {
        const idempotencyKey = req.headers['x-idempotency-key'];
        if(idempotencyKey && inMemDb[idempotencyKey]) {
            return res
                .status(error.statusCode || StatusCodes.BAD_REQUEST)
                .json({message: 'cannot retry on a successful payment'});
        }
        const response = await BookingService.makePayment ({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId
        });
        if(idempotencyKey) {
            inMemDb[idempotencyKey] = idempotencyKey;
        }
        SuccessResponse.data = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = {
            message: error.message || 'An unexpected error occurred',
            explanation: error.explanation || [] 
        };
        return res
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}

module.exports = {
    createBooking,
    makePayment,
    
}
const axios = require('axios');

const { BookingRepository } = require('../respositories');
const { ServerConfig } = require('../config');
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { message } = require('../utils/common/error-response');

async function createBooking(data) {
    try {
        const result = db.sequelize.transaction(async function bookingImp(t) {
            const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            const flightData = flight.data.data;
            if(data.noOfSeats > flightData.totalSeats) {
                throw new AppError('not enought seats available', StatusCodes.BAD_REQUEST);
            }
            return true;
        });

        return result;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    createBooking,
    
}
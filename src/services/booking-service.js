const axios = require('axios');

const { BookingRepository } = require('../respositories');
const { ServerConfig } = require('../config');
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { message } = require('../utils/common/error-response');

async function createBooking(data) {
    return new Promise((resolve, reject) => {
        const result = db.sequelize.transaction(async function bookingImp(t) {
            const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            const flightData = flight.data.data;
            if(data.noOfSeats > flightData.totalSeats) {
                reject(new AppError('not enought seats available', StatusCodes.BAD_REQUEST));
            }
            resolve(true);
        });

        return result;
    });
}

module.exports = {
    createBooking,
    
}
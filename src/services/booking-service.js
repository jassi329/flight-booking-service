const axios = require('axios');

const { BookingRepository } = require('../respositories');
const { ServerConfig } = require('../config');
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { message } = require('../utils/common/error-response');

const bookingRepository = new BookingRepository();

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try{
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;
        if(data.noOfSeats > flightData.totalSeats) {
            throw new AppError('not enought seats available', StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmount = data.noOfSeats * flightData.price; 
        const bookingPayLoad = {...data, totalCost: totalBillingAmount};
        const booking = await bookingRepository.createBooking(bookingPayLoad, transaction);

        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
            seats: data.noOfSeats
        })

        await transaction.commit();
        return(true);
    }catch(error){
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    createBooking,
    
}
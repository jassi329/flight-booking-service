const express = require('express');

const {InfoController, BookingController} = require('../../controllers')
const BookingRoutes = require('./booking');
 
const router = express.Router();

router.get('/info', InfoController.info);

router.use('/bookings', BookingRoutes);

module.exports = router;
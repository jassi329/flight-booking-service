const cron = require('node-cron');

const { BookingService } = require('../../services');
function scheduleCrons(){
    cron.schedule('*/5 * * * * *', async () => {
        console.log('starting cron again', BookingService)
        const response = await BookingService.cancelOldBookings();
        console.log(response);
    })
}

module.exports = scheduleCrons;
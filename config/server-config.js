const dotenv = require('dotenv');
const { PORT } = require('.');

dotenv.config();

module.exports = {
    PORT: process.env.PORT
}
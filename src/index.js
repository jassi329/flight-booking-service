const express = require('express');

const { ServerConfig, logger } = require('./config');
const apiRoutes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`successfully started the server on 
        port : ${ServerConfig.PORT}`);
    logger.info("successfully server started", {});
}); 
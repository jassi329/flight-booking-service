const express = require('express');

const { ServerConfig, logger } = require('./config');
const apiRoutes = require('./routes');
const CRON  = require('./utils/common/cron-jobs')

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, '0.0.0.0',  () => {
    console.log(`successfully started the server on 
        port : ${ServerConfig.PORT}`);
    CRON();
}); 

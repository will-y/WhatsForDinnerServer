const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bearerToken = require('express-bearer-token');
const server = require('./server');

const port = process.env.PORT || 8080;

const app = express()
    .use(cors())
    .use(bodyParser.json())
    .use(server());

mongoose.connect(`mongodb://192.168.86.233:27017/dinner_dev`, {useNewUrlParser: true})
    .then(() => {
        console.log('Connected to database');
        app.listen(port, () => {
            console.log(`Express server listening on port ${port}`);
        });
    });

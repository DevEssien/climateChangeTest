const express = require('express');
const bodyParser = require('body-parser');

const weatherRoute = require('./routes/weatherData')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', weatherRoute)

app.use((error, req, res, next) => {
    const status = error.status || 'Failed'
    const message = error.message || 'Server Side Error!!';
    const code = error.code || 500;
    const data = error.data || null;
    return res.status(code).json({
        status, message, data
    });
});

module.exports = app;
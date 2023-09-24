const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const weatherDataSchema = new Schema({
    climate:  String,
    area_code: {
        type: Number,
        min: 100,
        max: 1000
    },
    temperature: Number,
    humidity: Number,
    chances_of_rain: Number
});

module.exports = mongoose.model('weatherData', weatherDataSchema)
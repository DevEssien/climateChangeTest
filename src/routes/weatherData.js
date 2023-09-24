const express = require('express');
const weatherHandler = require('../handlers/weather/weatherData')


const router = express.Router();

router.get('/', weatherHandler.getAllWeatherData);

router.get('/get-by-area/:area_code', weatherHandler.getByArea);

router.get('/get-by-climate/:climate', weatherHandler.getByClimate);

router.get('/convert-climate', weatherHandler.getClimateConversion)

router.post('/create-data', weatherHandler.createWeatherData);

router.put('/update-data/:_id', weatherHandler.updateWeatherData);

router.delete('/delete-data/:_id', weatherHandler.deleteWeatherData)


module.exports = router;
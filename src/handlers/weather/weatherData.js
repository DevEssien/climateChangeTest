const { findById } = require('../../models/WeatherData');
const Weather = require('../../models/WeatherData')
const AppError = require('../error/error');

exports.getAllWeatherData = async (req, res, next) => {
    try {
        const weatherData = await Weather.find();
        if (!weatherData) return next(new AppError('No record of weather data', 404))

        return res.status(200).json({
            success: true,
            message: 'getting all weather',
            data: { weatherData }
        });
    } catch (error) {
        next(error)
    }
}

exports.getByArea = async (req, res, next) => {
    try {
        const weatherData = await Weather.find({ area_code: req.params?.area_code });

        if (!weatherData) return next(new AppError('No record with this area code exist', 404));

        return res.status(200).json({
            success: true,
            message: 'getting a single weather data by area code',
            data: { weatherData }
        });
    } catch (error) {
        next(error)
    }
}

exports.getByClimate = async (req, res, next) => {
    try {
        const weatherData = await Weather.find({ climate: req.params?.climate.toLowerCase() });

        if (!weatherData) return next(new AppError('No record with this climate exist', 404));

        return res.status(200).json({
            success: true,
            message: 'getting a single weather data by climate',
            data: { weatherData }
        });
    } catch (error) {
        next(error)
    }
}

exports.getClimateConversion = async (req, res, next) => {
    const { from_climate, to_climate, area_code } = req.body
        
    try {
        const data = await Weather.find({ area_code: area_code });
        if (!data) return next(new AppError('No record with area code', 404));

        const fromClimateData = await Weather.findOne({ area_code: area_code, climate: from_climate });
        if (!fromClimateData) return next(new AppError(`No record with ${from_climate} climate for area code ${area_code}`, 404));

        const toClimateData = await Weather.findOne({ area_code: area_code, climate: to_climate });
        if (!toClimateData) return next(new AppError(`No record with ${to_climate} climate for area code ${area_code}`, 404));

        const temperature_delta = ( fromClimateData?.temperature + toClimateData?.temperature) / data.length;
        const humidity_delta = ( fromClimateData?.humidity + toClimateData?.humidity) / data.length;
        const rain_chances_delta = ( fromClimateData?.chances_of_rain + toClimateData?.chances_of_rain) / data.length;
        const climate_change_index = (temperature_delta * humidity_delta)/rain_chances_delta;

        return res.status(200).json({
            success: true,
            message: `getting data conversion btw ${from_climate} to ${to_climate}`,
            data: {
                climate_delta: `${from_climate} -> ${to_climate}`,
                temperature_delta,
                humidity_delta,
                rain_chances_delta,
                climate_change_index,
                }
                
        });
    } catch (error) {
        next(error)
    }
}

exports.createWeatherData = async (req, res, next) => {
    const { climate: clim, area_code, temperature, humidity, chances_of_rain } = req.body
    const climate = clim.toLowerCase()
    try {
        const data = await Weather.findOne({ area_code: area_code, climate: climate });
        if (data) return next(new AppError('Weather data already exist', 422)); 
        
        const condition = ['hot', 'humid', 'rainy', 'cold'];

        if (!condition.includes(climate)) return next(new AppError('invalid climate condition', 401));
                
        const newData = new Weather({
            climate : climate,
            area_code: area_code, 
            temperature : temperature, 
            humidity: humidity, 
            chances_of_rain: chances_of_rain 
        });
        const saveData = await newData.save();
        if (!saveData) return (new AppError('Unable to save weather data', 500));

        return res.status(201).json({
            success: true,
            message: 'created a new weather data',
            data: { id: newData?._id }
        })

    } catch (error) {
        next(error);
    }
}


exports.updateWeatherData = async (req, res, next) => {
    const reqObject = req.body
    try {
        const data = await Weather.findById(req.params?._id);
        if (!data) return next(new AppError('Weather data do not exist', 404));

        for (const field in reqObject) {
            data[field]  = reqObject[`${field}`]
        }

        const updatedData = await data.save()
        
        if (!updatedData) return next(new AppError('Could not update the record', 500));

        return res.status(200).json({
            success: true,
            message: 'updated a weather record',
            data: {  _id: data?._id }
        })

    } catch (error) {
        next(error);
    }
}

exports.deleteWeatherData = async (req, res, next) => {
    try {
        const data = await Weather.findOne({ _id: req.params?._id});
        if (!data) return next(new AppError("Weather record not found", 404));

        const deletedData = await Weather.deleteOne({ _id: req.params?._id});
        if (!deletedData) return next(new AppError('Unable to delete Weather record', 500));

        return res.status(200).json({
            success: true,
            message: 'Deleted a Weather record',
            data: { id: req.params?._id }
        })
    } catch (error) {
        next(error)
    }
}

const db = require("../database"); 

/**
 * Controller for all database actions related to the WeatherInterval model
 */

/**
 * Create a weather interval entry 
 * @param data The data object to build off of. Assumes the same field names
 *  are used as in the model definition
 */
const createWeatherInterval = (data) => {
    db.models.WeatherInterval.create({
        ...data
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to create WeatherInterval: ", error);
    });
};

/**
 * Retrieve every interval stored in the database at once
 * @returns An array of all interval model instances in the database
 */
const getAllWeatherIntervals = () => {
    const intervals = db.models.WeatherInterval.findAll().then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve all WeatherIntervals: ", error);
    });
    return intervals;
};

/**
 * Retieve all of the weather intervals for a specific game
 * @param gameID The game to retrieve intervals for
 * @returns An array of model instances for each of the intervals in the game
 */
const getAllWeatherIntervalsForGame = (gameID) => {
    const intervals = db.models.WeatherInterval.findAll({
        where: {
            gameID: gameID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve WeatherIntervals for game: ", error);
    });
    return intervals;
};

/**
 * Retrieve a specific interval from the database
 * @param gameID The game to retrieve
 * @param intervalNumber The interval to retrieve
 * @returns A matching WeatherInterval model instance if found
 */
const getWeatherInterval = (gameID, intervalNumber) => {
    const interval = db.models.WeatherInterval.findOne({
        where: {
            gameID: gameID,
            intervalNumber: intervalNumber
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve WeatherInterval: ", error);
    });
    return interval;
};

/**
 * Update a specific interval in the database with new weather data
 * @param gameID The game to update
 * @param intervalNumber The interval to update
 * @param updatedInterval Updated object entry for the interval
 */
const updateWeatherInterval = (gameID, intervalNumber, updatedInterval) => {
    db.models.WeatherInterval.update({
        ...updatedInterval,
        where: {
            gameID: gameID,
            intervalNumber: intervalNumber
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to update WeatherInterval: ", error);
    });
};

/**
 * Delete a specific weather interval from the database
 * @param gameID Specific id of the game 
 * @param intervalNumber Interval in game to be detroyed
 */
const deleteWeatherInterval = (gameID, intervalNumber) => {
    db.models.WeatherInterval.destroy({
        where: {
            gameID: gameID,
            intervalNumber: intervalNumber
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to delete WeatherInterval: ", error);
    });
};

module.exports = {
    createWeatherInterval,
    getAllWeatherIntervals,
    getAllWeatherIntervalsForGame,
    getWeatherInterval,
    updateWeatherInterval,
    deleteWeatherInterval
};

const { DataTypes } = require("sequelize");

/**
 * The data representation of a weather interval during an AUDL game. Identified
 * with the relevant gameID and the interval number
 */
module.exports = (sequelize) => {
    sequelize.define("WeatherInterval", {
        gameID: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        intervalNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        intervalTime: {
            type: DataTypes.TIME
        },
        temperature: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        windSpeed: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        precipitation: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        humidity: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        }
    });
};

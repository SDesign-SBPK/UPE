const { DataTypes } = require("sequelize");

/**
 * The data representation of an AUDL location. Identified by the teamID
 */
module.exports = (sequelize) => {
    sequelize.define("Location", {
        teamID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        fieldName: {
            type: DataTypes.STRING
        },
        averageTemperature: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        averageWindSpeed: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        averagePrecipitation: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        averageHumidity: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        altitude: {
            type: DataTypes.INTEGER
        },
        state: {
            type: DataTypes.STRING
        }
    });
};
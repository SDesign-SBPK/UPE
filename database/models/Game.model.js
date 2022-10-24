const { DataTypes } = require("sequelize");

/**
 * The data representation of an AUDL game. Identified by the gameID (string)
 */
module.exports = (sequelize) => {
    sequelize.define("Game", {
        gameID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        awayTeam: {
            type: DataTypes.STRING
        },
        homeTeam: {
            type: DataTypes.STRING
        },
        startTime: {
            type: DataTypes.TIME
        },
        endTime: {
            type: DataTypes.TIME
        },
        awayScore: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        homeScore: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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
        awayTeamCity: {
            type: DataTypes.STRING
        },
        homeTeamCity: {
            type: DataTypes.STRING
        }
    });
};

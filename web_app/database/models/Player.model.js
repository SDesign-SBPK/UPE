const { DataTypes } = require("sequelize");

/**
 * The data representation of AUDL player. Identified by the playerID (string)
 */
module.exports = (sequelize) => {
    sequelize.define("Player", {
        playerID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        completionPercentage: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        completions: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        goals: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        assists: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        plusMinus: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        gamesPlayed: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        minutesPlayed: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        pointsPlayed: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        huckPercentage: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        drops: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        throwaways: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        blocks: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        yardsThrown: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        yardsReceived: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        offenseEfficiency: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        }
    });
};

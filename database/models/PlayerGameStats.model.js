const { DataTypes } = require("sequelize");

/**
 * The data representation of an AUDL player's stats during one game.
 * Referenced by the gameID and playerID
 */
module.exports = (sequelize) => {
    sequelize.define("PlayerGameStats", {
        gameID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        playerID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        goals: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        assists: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        throwaways: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        completionPercentage: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        completions: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        catches: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        drops: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        blocks: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        secondsPlayed: {
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
        }
    });
};

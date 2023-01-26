const { DataTypes } = require("sequelize");

/**
 * The data representation of an AUDL team's stats during one game
 * Referenced by the gameID and teamID
 */
module.exports = (sequelize) => {
    sequelize.define("TeamGameStats", {
        gameID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        teamID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        completionPercentage: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        completions: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        huckPercentage: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        redZonePercentage: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        holdPercentage: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        breakPercentage: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        score: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        turnovers: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        blocks: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });
};

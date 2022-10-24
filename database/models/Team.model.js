const { DataTypes } = require("sequelize");

/**
 * The data representation of an AUDL team. Identified by the teamID (string)
 */

module.exports = (sequelize) => {
    sequelize.define("Team", {
        teamID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        teamName: {
            type: DataTypes.STRING,
            unique: true
        },
        wins: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        losses: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        gamesPlayed: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        completionPercentage: {
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
        huckPercentage: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        turnovers: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        blocks: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        redZonePercentage: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        scoresFor: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        scoresAgainst: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });
};

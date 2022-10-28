/*
* Default database schema for the UPE - not finalized.
* Currently setup to reset the database everytime the script is run
*
* Login to your mysql on your system, then run `source database.sql`
* Use `show tables;` and `DESC <table name>;` to see internal representation
*/

CREATE DATABASE IF NOT EXISTS upe;
USE upe;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Player;
CREATE TABLE Player (
    playerID VARCHAR(16),
    firstName VARCHAR(64),
    lastName VARCHAR(64),
    completionPercentage DECIMAL(5,2) DEFAULT 0.00,
    completions INT(8) DEFAULT 0,
    goals INT(8) DEFAULT 0,
    assists INT(8) DEFAULT 0,
    plusMinus INT(8) DEFAULT 0,
    gamesPlayed INT(8) DEFAULT 0,
    minutesPlayed INT(8) DEFAULT 0,
    pointsPlayed INT(8) DEFAULT 0,
    huckPercentage DECIMAL(5,2) DEFAULT 0.00,
    drops INT(8) DEFAULT 0,
    throwaways INT(8) DEFAULT 0,
    blocks INT(8) DEFAULT 0,
    yardsThrown INT(16) DEFAULT 0,
    yardsReceived INT(16) DEFAULT 0,
    offenseEfficiency DECIMAL(5,2) DEFAULT 0.00,
    PRIMARY KEY (playerID)
);

DROP TABLE IF EXISTS Team;
CREATE TABLE Team (
    teamID VARCHAR(16),
    teamName VARCHAR(64),
    wins INT(8) DEFAULT 0,
    losses INT(8) DEFAULT 0,
    gamesPlayed INT(8) DEFAULT 0,
    completionPercentage DECIMAL(5,2) DEFAULT 0.00,
    holdPercentage DECIMAL(5,2) DEFAULT 0.00,
    breakPercentage DECIMAL(5,2) DEFAULT 0.00,
    huckPercentage DECIMAL(5,2) DEFAULT 0.00,
    turnovers INT(8) DEFAULT 0,
    blocks INT(8) DEFAULT 0,
    redZonePercentage DECIMAL(5,2) DEFAULT 0.00,
    scoresFor INT(8) DEFAULT 0,
    scoresAgainst INT(8) DEFAULT 0,
    UNIQUE KEY (teamName),
    PRIMARY KEY (teamID)
);

DROP TABLE IF EXISTS Game;
CREATE TABLE Game (
    gameID VARCHAR(64),
    awayTeam VARCHAR(64),
    homeTeam VARCHAR(64),
    startTime VARCHAR(64),
    endTime VARCHAR(64),
    awayScore INT(8) DEFAULT 0,
    homeScore INT(8) DEFAULT 0,
    averageTemp DECIMAL(5,2) DEFAULT 0.00,
    averageWindSpeed DECIMAL(5,2) DEFAULT 0.00,
    averagePrecipitation DECIMAL(5,2) DEFAULT 0.00,
    averageHumidity DECIMAL(5,2) DEFAULT 0.00,
    awayTeamCity VARCHAR(64),
    homeTeamCity VARCHAR(64),
    PRIMARY KEY (gameID)
);

DROP TABLE IF EXISTS Locations;
CREATE TABLE Locations (
    teamID VARCHAR(16),
    fieldName VARCHAR(256),
    averageTemp DECIMAL(5,2) DEFAULT 0.00,
    averageWindSpeed DECIMAL(5,2) DEFAULT 0.00,
    averagePrecipitation DECIMAL(5,2) DEFAULT 0.00,
    averageHumidity DECIMAL(5,2) DEFAULT 0.00,
    altitude INT(8) DEFAULT 0,
    FOREIGN KEY (teamID) 
        REFERENCES Team (teamID),
    PRIMARY KEY (teamID)
);

DROP TABLE IF EXISTS WeatherInterval;
CREATE TABLE WeatherInterval (
    gameID VARCHAR(64),
    intervalNumber INT(8) DEFAULT 0,
    intervalTime VARCHAR(64),
    temperature DECIMAL(5,2) DEFAULT 0.00,
    windSpeed DECIMAL(5,2) DEFAULT 0.00,
    precipitation DECIMAL(5,2) DEFAULT 0.00,
    humidity DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (gameID)
        REFERENCES Game (gameID),
    PRIMARY KEY (gameID, intervalNumber)
);

DROP TABLE IF EXISTS PlayerGameStats;
CREATE TABLE PlayerGameStats (
    gameID VARCHAR(64),
    playerID VARCHAR(16),
    goals INT(8) DEFAULT 0,
    assists INT(8) DEFAULT 0,
    throwaways INT(8) DEFAULT 0,
    completionPercentage DECIMAL(5,2) DEFAULT 0.00,
    completions INT(8) DEFAULT 0,
    catches INT(8) DEFAULT 0,
    drops INT(8) DEFAULT 0,
    blocks INT(8) DEFAULT 0,
    secondsPlayed INT(8) DEFAULT 0,
    yardsThrown INT(8) DEFAULT 0,
    yardsReceived INT(8) DEFAULT 0,
    FOREIGN KEY (gameID)
        REFERENCES Game (gameID),
    FOREIGN KEY (playerID)
        REFERENCES Player (playerID),
    PRIMARY KEY (gameID, playerID)
);

DROP TABLE IF EXISTS TeamGameStats;
CREATE TABLE TeamGameStats (
    gameID VARCHAR(64),
    teamID VARCHAR(16),
    completionPercentage DECIMAL(5,2) DEFAULT 0.00,
    completions INT(8) DEFAULT 0,
    huckPercentage DECIMAL(5,2) DEFAULT 0.00,
    redZonePercentage DECIMAL(5,2) DEFAULT 0.00,
    holdPercentage DECIMAL(5,2) DEFAULT 0.00,
    breakPercentage DECIMAL(5,2) DEFAULT 0.00,
    score INT(8) DEFAULT 0,
    turnovers INT(8) DEFAULT 0,
    blocks INT(8) DEFAULT 0,
    FOREIGN KEY (gameID)
        REFERENCES Game (gameID),
    FOREIGN KEY (teamID)
        REFERENCES Team (teamID),
    PRIMARY KEY (gameID, teamID)
);

SET FOREIGN_KEY_CHECKS = 1;

"""
File that interfaces between the database and python files. Since Sequelize is
used, there isn't a Python connector for it. For the ML algorithm to be able to
retrieve the necessary data, raw SQL queries must be made to retrieve data

Uses the same `connection.json` file as the rest of the database files use
"""

import mysql.connector as connector
import json

connection_file = open("./connection.json")
connection_details = json.load(connection_file)
connection = connector.connect(
    user = connection_details["user"],
    password = connection_details["pass"],
    host = connection_details["host"],
    port = connection_details["port"],
    database = connection_details["database"]
)


def getGame(gameID: str):
    """
    Gets a game using a gameID
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM Games WHERE gameID = %s", (gameID,))
    game = c.fetchone()
    return game


def getLocation(teamID: str):
    """
    Gets a specific location using the relevant teamID
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM Locations WHERE teamID = %s", (teamID,))
    location = c.fetchone()
    return location


def getPlayer(playerID: str):
    """
    Gets a player using their playerID
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM Players WHERE playerID = %s", (playerID,))
    player = c.fetchone()
    return player


def getAllStatsforPlayer(playerID: str):
    """
    Gets all of the game stat entries for a specific player
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM PlayerGameStats WHERE playerID = %s", (playerID,))
    stats = c.fetchall()
    return stats


def getGameStatForPlayer(playerID: str, gameID: str):
    """
    Gets the game stat entry for a specific player in a specific game
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM PlayerGameStats WHERE playerID = %s AND gameID = %s", (playerID, gameID))
    stat = c.fetchone()
    return stat


def getTeam(teamID: str):
    """
    Gets a team entry with a given teamID
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM Teams WHERE teamID = %s", (teamID,))
    team = c.fetchone()
    return team


def getAllStatsforTeam(teamID: str):
    """
    Gets all of the game stat entries for a specific team
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM TeamGameStats WHERE teamID = %s", (teamID,))
    stats = c.fetchall()
    return stats


def getGameStatForTeam(teamID: str, gameID: str):
    """
    Gets the game stat entry for a specific team in a specific game
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM TeamGameStats WHERE teamID = %s AND gameID = %s", (teamID, gameID))
    stat = c.fetchone()
    return stat


def getGameWeatherIntervals(gameID: str):
    """
    Gets all of the weather intervals for a given game
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM WeatherIntervals WHERE gameID = %s", (gameID,))
    intervals = c.fetchall()
    return intervals


def getWeatherInterval(gameID: str, intervalNumber: str):
    """
    Gets a specific interval from a game
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM WeatherIntervals WHERE gameID = %s AND intervalNumber = %s", (gameID, intervalNumber))
    interval = c.fetchone()
    return interval
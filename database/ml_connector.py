"""
File that interfaces between the database and python files. Since Sequelize is
used, there isn't a Python connector for it. For the ML algorithm to be able to
retrieve the necessary data, raw SQL queries must be made to retrieve data

Uses the same `connection.json` file as the rest of the database files use
"""

import mysql.connector as connector
import json

connection_file = open("connection.json")
connection_details = json.load(connection_file)
connection = connector.connect(
    user = connection_details["user"],
    password = connection_details["pass"],
    host = connection_details["host"],
    port = connection_details["port"]
)


def getGame(gameID):
    """
    Gets a game using a gameID
    """
    pass


def getLocation(teamID):
    """
    Gets a specific location using the relevant teamID
    """
    pass


def getPlayer(playerID):
    """
    Gets a player using their playerID
    """
    pass


def getAllStatsforPlayer(playerID):
    """
    Gets all of the game stat entries for a specific player
    """
    pass


def getGameStatForPlayer(playerID, gameID):
    """
    Gets the game stat entry for a specific player in a specific game
    """
    pass


def getTeam(teamID):
    """
    Gets a team entry with a given teamID
    """
    pass


def getAllStatsforTeam(teamID):
    """
    Gets all of the game stat entries for a specific team
    """
    pass


def getGameStatForTeam(teamID, gameID):
    """
    Gets the game stat entry for a specific player in a specific game
    """
    pass


def getGameWeatherIntervals(gameID):
    """
    Gets all of the weather intervals for a given game
    """
    pass


def getWeatherInterval(gameID, intervalNumber):
    """
    Gets a specific interval from a game
    """
    pass
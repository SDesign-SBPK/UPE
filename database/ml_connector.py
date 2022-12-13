"""
File that interfaces between the database and python files. Since Sequelize is
used, there isn't a Python connector for it. For the ML algorithm to be able to
retrieve the necessary data, raw SQL queries must be made to retrieve data

Uses the same `connection.json` file as the rest of the database files use
"""
import json

import mysql.connector as connector

import paramiko as paramiko

from sshtunnel import SSHTunnelForwarder


connection_file = open("/Users/brandonharvey/Documents/gwu/2022/fall/senior-design/UPE/database/connection.json")
connection_details = json.load(connection_file)

# ssh_file = open("/Users/brandonharvey/Documents/gwu/2022/fall/senior-design/UPE/database/ssh.json")
# ssh_details = json.load(ssh_file)
# ssh_key = paramiko.RSAKey.from_private_key_file(ssh_details["ssh_key_file"], password=ssh_details["ssh_key_pass"])
#
# tunnel = SSHTunnelForwarder((ssh_details["host"], ssh_details["ssh_port"]), ssh_username=ssh_details["user"],
#                             ssh_pkey=ssh_key, remote_bind_address=(ssh_details["remote_host"], ssh_details["remote_port"]))
#
# tunnel.start()

connection = connector.connect(host=connection_details["host"],
                               user=connection_details["user"],
                               passwd=connection_details["pass"],
                               port=connection_details["port"],
                               database=connection_details["database"])


def getGame(gameID: str):
    """
    Gets a game using a gameID
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM Games WHERE gameID = %s", (gameID,))
    game = c.fetchone()
    c.close()
    return game


def getLocation(teamID: str):
    """
    Gets a specific location using the relevant teamID
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM Locations WHERE teamID = %s", (teamID,))
    location = c.fetchone()
    c.close()
    return location


def getPlayer(playerID: str):
    """
    Gets a player using their playerID
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM Players WHERE playerID = %s", (playerID,))
    player = c.fetchone()
    c.close()
    return player


def getAllStatsForPlayer(playerID: str):
    """
    Gets all of the game stat entries for a specific player
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM PlayerGameStats WHERE playerID = %s", (playerID,))
    stats = c.fetchall()
    c.close()
    return stats


def getGameStatForPlayer(playerID: str, gameID: str):
    """
    Gets the game stat entry for a specific player in a specific game
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM PlayerGameStats WHERE playerID = %s AND gameID = %s", (playerID, gameID))
    stat = c.fetchone()
    c.close()
    return stat


def getTeam(teamID: str):
    """
    Gets a team entry with a given teamID
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM Teams WHERE teamID = %s", (teamID,))
    team = c.fetchone()
    c.close()
    return team


def getAllStatsForTeam(teamID: str):
    """
    Gets all of the game stat entries for a specific team
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM TeamGameStats WHERE teamID = %s", (teamID,))
    stats = c.fetchall()
    c.close()
    return stats


def getGameStatForTeam(teamID: str, gameID: str):
    """
    Gets the game stat entry for a specific team in a specific game
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM TeamGameStats WHERE teamID = %s AND gameID = %s", (teamID, gameID))
    stat = c.fetchone()
    c.close()
    return stat


def getGameWeatherIntervals(gameID: str):
    """
    Gets all of the weather intervals for a given game
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM WeatherIntervals WHERE gameID = %s", (gameID,))
    intervals = c.fetchall()
    c.close()
    return intervals


def getWeatherInterval(gameID: str, intervalNumber: str):
    """
    Gets a specific interval from a game
    """
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM WeatherIntervals WHERE gameID = %s AND intervalNumber = %s", (gameID, intervalNumber))
    interval = c.fetchone()
    c.close()
    return interval
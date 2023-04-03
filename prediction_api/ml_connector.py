"""
File that interfaces between the database and python files. Since Sequelize is
used, there isn't a Python connector for it. For the ML algorithm to be able to
retrieve the necessary data, raw SQL queries must be made to retrieve data
Uses the same `connection.json` file as the rest of the database files use
"""
import json

import mysql.connector as connector

# import paramiko as paramiko

# from sshtunnel import SSHTunnelForwarder


connection_file = open("connection.json")
connection_details = json.load(connection_file)

# ssh_file = open("/Users/brandonharvey/Documents/gwu/2022/fall/senior-design/UPE/database/ssh.json")
# ssh_details = json.load(ssh_file)
# ssh_key = paramiko.RSAKey.from_private_key_file(ssh_details["ssh_key_file"], password=ssh_details["ssh_key_pass"])
#
# tunnel = SSHTunnelForwarder((ssh_details["host"], ssh_details["ssh_port"]), ssh_username=ssh_details["user"],
#                             ssh_pkey=ssh_key, remote_bind_address=(ssh_details["remote_host"], ssh_details["remote_port"]))
#
# tunnel.start()
def getConnection():
    return connector.connect(host=connection_details["host"],
                               user=connection_details["user"],
                               password=connection_details["pass"],
                               port=connection_details["port"],
                               database=connection_details["database"])


def getGame(gameID: str):
    """
    Gets a game using a gameID
    """
    connection = getConnection()
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM games WHERE gameID = %s", (gameID,))
    game = c.fetchone()
    c.close()
    connection.close()
    return game


def getLocation(teamID: str):
    """
    Gets a specific location using the relevant teamID
    """
    connection = getConnection()
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM locations WHERE teamID = %s", (teamID,))
    location = c.fetchone()
    c.close()
    connection.close()
    return location


def getPlayer(playerID: str):
    """
    Gets a player using their playerID
    """
    connection = getConnection()
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM players WHERE playerID = %s", (playerID,))
    player = c.fetchone()
    c.close()
    connection.close()
    return player


def getAllStatsForPlayer(playerID: str):
    """
    Gets all of the game stat entries for a specific player
    """
    connection = getConnection()
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM playergamestats WHERE playerID = %s", (playerID,))
    stats = c.fetchall()
    c.close()
    connection.close()
    return stats


def getGameStatForPlayer(playerID: str, gameID: str):
    """
    Gets the game stat entry for a specific player in a specific game
    """
    connection = getConnection()
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM playergamestats WHERE playerID = %s AND gameID = %s", (playerID, gameID))
    stat = c.fetchone()
    c.close()
    connection.close()
    return stat


def getTeam(teamID: str):
    """
    Gets a team entry with a given teamID
    """
    connection = getConnection()
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM teams WHERE teamID = %s", (teamID,))
    team = c.fetchone()
    c.close()
    connection.close()
    return team


def getAllStatsForTeam(teamID: str):
    """
    Gets all of the game stat entries for a specific team
    """
    connection = getConnection()
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM teamgamestats WHERE teamID = %s", (teamID,))
    stats = c.fetchall()
    c.close()
    connection.close()
    return stats


def getGameStatForTeam(teamID: str, gameID: str):
    """
    Gets the game stat entry for a specific team in a specific game
    """
    connection = getConnection()
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM teamgamestats WHERE teamID = %s AND gameID = %s", (teamID, gameID))
    stat = c.fetchone()
    c.close()
    connection.close()
    return stat


def getGameWeatherIntervals(gameID: str):
    """
    Gets all of the weather intervals for a given game
    """
    connection = getConnection()
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM weatherintervals WHERE gameID = %s", (gameID,))
    intervals = c.fetchall()
    c.close()
    connection.close()
    return intervals


def getWeatherInterval(gameID: str, intervalNumber: str):
    """
    Gets a specific interval from a game
    """
    connection = getConnection()
    c = connection.cursor(buffered = True)
    c.execute("SELECT * FROM weatherintervals WHERE gameID = %s AND intervalNumber = %s", (gameID, intervalNumber))
    interval = c.fetchone()
    c.close()
    connection.close()
    return interval

def getGameFromTeamID(teamID):
    connection = getConnection()
    c = connection.cursor(buffered=True)
    c.execute("SELECT * FROM games WHERE awayTeam = %s OR homeTeam = %s", (teamID, teamID))
    results = c.fetchall()
    c.close()
    connection.close()
    return results

def getTeamGameRoster(gameID, away):
    home = 1
    if away:
        home = 0
    connection = getConnection()
    c = connection.cursor(buffered=True)
    c.execute("SELECT * FROM playergamestats WHERE gameID = %s AND isHome = %s", (gameID[0], home))
    results = c.fetchall()
    c.close()
    connection.close()
    return results
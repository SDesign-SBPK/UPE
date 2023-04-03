"""
Script to retrieve all of the player IDs and names from the database and generate
a dictionary for player information

Requires running this file with the prediction_api venv
"""

import json
import mysql.connector as connector

connection = connector.connect(
    host = "",
    port = 3306,
    database = "",
    user = "",
    password = "",
)
c = connection.cursor(buffered = True)
c.execute("SELECT players.playerID, players.firstName, players.lastName FROM players JOIN playergamestats ON players.playerID = playergamestats.playerID GROUP BY playerID ORDER BY playerID ASC")
info = c.fetchall()
c.close()
connection.close()
player_info = {}
player_info["ids"] = []
for row in info:
    player_info["ids"].append(row[0])
    name = row[1] + " " + row[2]
    player_info[row[0]] = name

file = open("playerDictionary.json", mode="w")
json.dump(player_info, file, indent=4)
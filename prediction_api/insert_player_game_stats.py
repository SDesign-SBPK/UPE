"""
Re-inserts Player Game Stats into the DB given you have a player-game-stats folder in the same 
directory that contains the json files for each separate player game stat.

Requires the prediction_api venv to be activated
"""

import mysql.connector as connector
import json
import os

conn_file = open("../connection.json")
conn_details = json.load(conn_file)
conn_file.close()

connection = connector.connect(
    host = conn_details["host"],
    port = conn_details["port"],
    database = conn_details["database"],
    user = conn_details["user"],
    password = conn_details["pass"]
)
c = connection.cursor(buffered = True)

sql = "INSERT INTO playergamestats (gameID, playerID, isHome, goals, assists, throwaways, completionPercentage, completions, catches, drops, blocks, secondsPlayed, yardsThrown, yardsReceived, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

path_to_json = os.getcwd() + '/player-game-stats/'
json_file_names = [filename for filename in os.listdir(path_to_json) if filename.endswith('.json')]

for json_file_name in json_file_names:
    with open(os.path.join(path_to_json, json_file_name)) as json_file:
        json_text = json.load(json_file)
        values = (json_text["gameID"], json_text["playerID"], json_text["isHome"], json_text["goals"], json_text["assists"], json_text["throwaways"], json_text["completionPercentage"], json_text["completions"], json_text["catches"], json_text["drops"], json_text["blocks"], json_text["secondsPlayed"], json_text["yardsThrown"], json_text["yardsReceived"], "2023-03-20 13:25:00", "2023-03-20 13:25:00")
        c.execute(sql, values)
        connection.commit()
        print("File " + str(json_file) + " completed")

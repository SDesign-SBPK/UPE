"""
Scrape for players

Requires the prediction_api venv to be activated
"""

import wget
import mysql.connector as connector
import json
import os

conn_file = open("connection.json")
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

AUDL_BACKEND = "https://www.backend.audlstats.com/web-api/player-stats?limit=20&page="
PAGE_LIMIT = 162

# Get all pages down from the backend
for page in range(1, PAGE_LIMIT + 1):
    player_stats = wget.download(AUDL_BACKEND + str(page))
    # Go through the retrieved page and update the row in the players table
    player_file = open(player_stats)
    players = json.load(player_file)
    player_file.close()
    for player in players["stats"]:
        c.execute("SELECT * from players WHERE playerID = %s", (player["playerID"],))
        rows = c.fetchall()
        sql = ""
        values = ()
        if not rows:
            # Player not in DB, add them
            sql = "INSERT INTO players VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            names = player["name"].split(" ")
            values = (
                player["playerID"],
                names[0],
                names[1],
                player["completionPercentage"],
                player["completions"],
                player["goals"],
                player["assists"],
                player["plusMinus"],
                player["gamesPlayed"],
                player["minutesPlayed"],
                player["pointsPlayed"],
                player["huckPercentage"],
                player["drops"],
                player["throwaways"],
                player["blocks"],
                player["yardsThrown"],
                player["yardsReceived"],
                player["oEfficiency"],
                "2023-03-15 19:00:00",
                "2023-03-15 19:00:00"
            )
            print("Adding new player", player["name"])
        else: 
            sql = "UPDATE players \
            SET completions = %s, offenseEfficiency = %s, yardsReceived = %s, yardsThrown = %s, completionPercentage = %s, goals = %s, assists = %s, plusMinus = %s, gamesPlayed = %s, minutesPlayed = %s, pointsPlayed = %s, huckPercentage = %s, drops = %s, throwaways = %s, blocks = %s \
            WHERE playerID = %s"
            values = (
                player["completions"], 
                player["oEfficiency"], 
                player["yardsReceived"], 
                player["yardsThrown"], 
                player["completionPercentage"],
                player["goals"],
                player["assists"],
                player["plusMinus"],
                player["gamesPlayed"],
                player["minutesPlayed"],
                player["pointsPlayed"],
                player["huckPercentage"],
                player["drops"],
                player["throwaways"],
                player["blocks"],
                player["playerID"]
            )
        c.execute(sql, values)
        connection.commit()
    
    # Remove the retrieved file
    os.remove(player_stats)
    print("Page " + str(page) + " completed")
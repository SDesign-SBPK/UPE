"""
Script to pull player images down from the AUDL site
Add credentials to the connection information below and run the file inside the
virtual environment created for the prediction_api
Requires installing the `wget` module as well
"""
import wget
import mysql.connector as connector

BASE_URL = "https://theaudl.com/sites/default/files/players/profile-images/"

def createURL(playerID, png = False):
    """
    Create the URL for an image with a given playerID
    :param playerID: The ID of the player referenced
    :param png: Flag to try for a png image instead of a jpg
    """
    if png:
        return BASE_URL + playerID + "_profile.png"
    else:
        return BASE_URL + playerID + "_profile.jpg"

# Get player IDs from DB
connection = connector.connect(
    host = "",
    port = 3306,
    database = "",
    user = "",
    password = ""
)
c = connection.cursor(buffered = True)
c.execute("SELECT playerID FROM players")
ids = c.fetchall()
players = []
for id in ids:
    players.append(id[0])
c.close()
connection.close()

# Retrieve player image
for player in players:
    image_file = None
    try:
        image_file = wget.download(createURL(player))
    except:
        try: 
            # Try with png instead
            image_file = wget.download(createURL(player, png=True))
        except:
            print("No image found for player ", player)

"""
API for the ML prediction engine. Returns a JSON response

Endpoints for API:
- GET /api/v1/predict/teams/
- GET /api/v1/predict/players/
- GET /api/v1/predict/historical_players/
- GET /api/v1/predict/historical_teams/

Inputs for API (players):
- team1Players: [
        # playerIDs (7-14, team1 and team2 must have equal numbers)
    ]
- team2Players: [
        # playerIDs (7-14, team1 and team2 must have equal numbers)
    ]
- wind_speed: number (0-30 mph)
- temperature: number (degrees F)
- precipitation: decimal (inches)
- humidity: number (0-100) %

Inputs for API (teams):
- team1: teamID
- team2: teamID
- wind_speed: number (0-30 mph)
- temperature: number (degrees F)
- precipitation: decimal (inches)
- humidity: number (0-100) %

API converts ML output into API output:
Output of SVM:
team-X-stats correspond to stats-used indices
{
    "winning-team":"glory",
    "winning-team-percent":78.223,
    "team-one-stats":[[0.94, 0.76, 0.33, '1', '9'], [0.87, 0.72, 0.38, '2', '6'], [0.82, 0.74, 0.21, '0', '4'], [0.92, 0.64, 0.0, '1', '0'], [0.91, 0.62, 0.48, '1', '4'], [0.93, 0.67, 0.28, '2', '1'], [0.94, 0.94, 0.42, '2', '7'], [0.93, 0.91, 0.56, '2', '4'], [0.92, 0.67, 0.56, '0', '2'], [0.94, 0.84, 0.21, '0', '8']]
    "team-two-stats":[[0.94, 0.76, 0.33, '1', '9'], [0.87, 0.72, 0.38, '2', '6'], [0.82, 0.74, 0.21, '0', '4'], [0.92, 0.64, 0.0, '1', '0'], [0.91, 0.62, 0.48, '1', '4'], [0.93, 0.67, 0.28, '2', '1'], [0.94, 0.94, 0.42, '2', '7'], [0.93, 0.91, 0.56, '2', '4'], [0.92, 0.67, 0.56, '0', '2'], [0.94, 0.84, 0.21, '0', '8']]
    "stats-used":["completion percentage", "hold percentage", "break percentage", "wind", "precipitation"]
}

Converted output sent back from API: 
{
    "message": "Prediction succesful",
    "team1": "glory",
    "team2": "empire"
    "winner": "glory",
    "percentage": 78.223,
    "team-one-stats":[[0.94, 0.76, 0.33, '1', '9'], [0.87, 0.72, 0.38, '2', '6'], [0.82, 0.74, 0.21, '0', '4'], [0.92, 0.64, 0.0, '1', '0'], [0.91, 0.62, 0.48, '1', '4'], [0.93, 0.67, 0.28, '2', '1'], [0.94, 0.94, 0.42, '2', '7'], [0.93, 0.91, 0.56, '2', '4'], [0.92, 0.67, 0.56, '0', '2'], [0.94, 0.84, 0.21, '0', '8']]
    "team-two-stats":[[0.94, 0.76, 0.33, '1', '9'], [0.87, 0.72, 0.38, '2', '6'], [0.82, 0.74, 0.21, '0', '4'], [0.92, 0.64, 0.0, '1', '0'], [0.91, 0.62, 0.48, '1', '4'], [0.93, 0.67, 0.28, '2', '1'], [0.94, 0.94, 0.42, '2', '7'], [0.93, 0.91, 0.56, '2', '4'], [0.92, 0.67, 0.56, '0', '2'], [0.94, 0.84, 0.21, '0', '8']]
    "stats-used":["completion percentage", "hold percentage", "break percentage", "wind", "precipitation"]
    "wind": 12
    "precipitation": 0.01
    "temperature": 75,
    "humidity": 56
}
"""

from flask import Flask, request, jsonify
from ml.svm import predict
from ml.player_svm import predictByPlayers

# Will need to add import for ml.player_svm
# May also need to change each predict method name, so there is no overlap

app = Flask(__name__)

USAGE_MESSAGE = "Usage: \n\tGET /api/v1/predict/teams\n\tGET /api/v1/predict/players\n\tGET /api/v1/predict/historical_players/\n\tGET /api/v1/predict/historical_teams/"

@app.route("/api/v1/", methods = ["GET"])
def home():
    return jsonify(
        {
            "message": USAGE_MESSAGE
        }
    )


@app.route("/api/v1/predict/teams/", methods = ["GET"])
def predict_teams():
    # Check valid parameters
    parameters = request.args

    team1 = parameters.get("team1")
    team2 = parameters.get("team2")
    wind_speed = parameters.get("wind_speed")
    temperature = parameters.get("temperature")
    precipitation = parameters.get("precipitation")
    humidity = parameters.get("humidity")

    if not (team1 or team2 or wind_speed or temperature or precipitation or humidity):
        return invalid_endpoint(404, custom_message="Missing parameters")
    elif len(team1) == 0 or len(team2) == 0:
        return invalid_endpoint(404, custom_message="Invalid parameters for teams")
    
    # Pass prediction
    result = predict(team1, team2, temperature, wind_speed, precipitation, humidity)
    if not result:
        return invalid_endpoint(404, custom_message="No result from prediction")
    # [team1 score, team2 score]
    # [team1 score, team2 score]
    # Average the scores out to see what is accurate
    win_percentage = 0
    winner_percents =  [(float(result[0][0]) + float(result[1][0])) / 2, (float(result[0][1]) + float(result[1][1])) / 2]
    if winner_percents[0] > winner_percents[1]:
        winner = team1
        win_percentage = winner_percents[0]
    else: 
        winner = team2
        win_percentage = winner_percents[1]
    
    # Return result 
    return jsonify(
        {
            "message": "Prediction successful",
            "winner": winner,
            "team1": team1,
            "team2": team2,
            "percentage": win_percentage,
            "wind": wind_speed,
            "precipitation": precipitation,
            "temperature": temperature,
            "humidity": humidity
        }
    )


@app.route("/api/v1/predict/players/", methods = ["GET"])
def predict_players():
    # Check Valid Parameters
    parameters = request.args

    team1Players = parameters.getlist("team1Players")
    team2Players = parameters.getlist("team2Players")
    wind_speed = parameters.get("wind_speed")
    temperature = parameters.get("temperature")
    precipitation = parameters.get("precipitation")
    humidity = parameters.get("humidity")
    print(team1Players, team2Players)

    if not (team1Players or team2Players or wind_speed or temperature or precipitation or humidity):
        return invalid_endpoint(404, custom_message="Missing parameters")
    elif len(team1Players) < 7 or len(team2Players) < 7 or len(team1Players) > 14 or len(team2Players) > 14:
        return invalid_endpoint(404, custom_message="Invalid Parameters: Teams do either contain less than 7 or more than 14 players")
    elif len(team1Players) != len(team2Players):
        return invalid_endpoint(404, custom_message="Invalid Parameters: Teams do not contain an equal amount of players")

    for players in team1Players:
        if (len(players) == 0):
            return invalid_endpoint(404, custom_message="Invalid parameters for player in team1")
    for players in team2Players:
        if (len(players) == 0):

            return invalid_endpoint(404, custom_message="Invalid parameters for a player in team2")
        
    # Pass prediction
    #Will need to change the predict method name
    result = predictByPlayers(team1Players, team2Players, temperature, wind_speed, precipitation, humidity)
    if not result:
        return invalid_endpoint(404, custom_message="No result from prediction")

    # Average the scores out to see what is accurate
    win_percentage = 0
    print(result)
    winner_percents =  [(float(result[0][0]) + float(result[1][0])) / 2, (float(result[0][1]) + float(result[1][1])) / 2]
    if winner_percents[0] > winner_percents[1]:
        winner = team1Players
        win_percentage = winner_percents[0]
    else: 
        winner = team2Players
        win_percentage = winner_percents[1]

    # Return result 
    return jsonify(
        {
            "message": "Prediction successful",
            "winner": winner,
            # Will most likely need to change how we return the players in JSON Format
            "team1": team1Players,
            "team2": team2Players,
            "percentage": win_percentage,
            "wind": wind_speed,
            "precipitation": precipitation,
            "temperature": temperature,
            "humidity": humidity
        }
    )

@app.route("/api/v1/predict/historical_players/", methods = ["GET"])

def historical_predict_players():
    # Check Valid Parameters
    parameters = request.args

    gameID = parameters.get("gameID")
    team1Players = parameters.get("team1Players")
    team2Players = parameters.get("team2Players")
    wind_speed = parameters.get("wind_speed")
    temperature = parameters.get("temperature")
    precipitation = parameters.get("precipitation")
    humidity = parameters.get("humidity")

    if not (gameID or team1Players or team2Players or wind_speed or temperature or precipitation or humidity):
        return invalid_endpoint(404, custom_message="Missing parameters")
    elif len(team1Players) < 7 or len(team2Players) < 7 or len(team1Players) > 14 or len(team2Players) > 14:
        return invalid_endpoint(404, custom_message="Invalid Parameters: Teams do either contain less than 7 or more than 14 players")
    elif len(team1Players) != len(team2Players):
        return invalid_endpoint(404, custom_message="Invalid Parameters: Teams do not contain an equal amount of players")
    
    for players in team1Players:
        if (len(players) == 0):
            return invalid_endpoint(404, custom_message="Invalid parameters for player in team1")
    for players in team2Players:
        if (len(players) == 0):
            return invalid_endpoint(404, custom_message="Invalid parameters for a player in team2")
        
    # Pass prediction
    #Will need to change the predict method name
    result = predictByPlayers(team1Players, team2Players, temperature, wind_speed, precipitation, humidity)
    if not result:
        return invalid_endpoint(404, custom_message="No result from prediction")

    # Average the scores out to see what is accurate
    win_percentage = 0
    winner_percents =  [(float(result[0][0]) + float(result[1][0])) / 2, (float(result[0][1]) + float(result[1][1])) / 2]
    if winner_percents[0] > winner_percents[1]:
        winner = team1Players
        win_percentage = winner_percents[0]
    else: 
        winner = team2Players
        win_percentage = winner_percents[1]

    # Return result 
    return jsonify(
        {
            "message": "Prediction successful",
            "winner": winner,
            "gameID": gameID,
            # Will most likely need to change how we return the players in JSON Format
            "team1": team1Players,
            "team2": team2Players,
            "percentage": win_percentage,
            "wind": wind_speed,
            "precipitation": precipitation,
            "temperature": temperature,
            "humidity": humidity
        }
    )


@app.route("/api/v1/predict/historical_teams/", methods = ["GET"])
def predict_historical_teams():
    # Check valid parameters
    parameters = request.args

    gameID = parameters.get("gameID")
    team1 = parameters.get("team1")
    team2 = parameters.get("team2")
    wind_speed = parameters.get("wind_speed")
    temperature = parameters.get("temperature")
    precipitation = parameters.get("precipitation")
    humidity = parameters.get("humidity")

    if not (gameID or team1 or team2 or wind_speed or temperature or precipitation or humidity):
        return invalid_endpoint(404, custom_message="Missing parameters")
    elif len(team1) == 0 or len(team2) == 0 or len(gameID) == 0:
        return invalid_endpoint(404, custom_message="Invalid parameters for teams or gameID")
    
    # Pass prediction
    result = predict(gameID, team1, team2, temperature, wind_speed, precipitation, humidity)
    if not result:
        return invalid_endpoint(404, custom_message="No result from prediction")
    
    # Average the scores out to see what is accurate
    win_percentage = 0
    winner_percents =  [(float(result[0][0]) + float(result[1][0])) / 2, (float(result[0][1]) + float(result[1][1])) / 2]
    if winner_percents[0] > winner_percents[1]:
        winner = team1
        win_percentage = winner_percents[0]
    else: 
        winner = team2
        win_percentage = winner_percents[1]
    
    # Return result 
    return jsonify(
        {
            "message": "Prediction successful",
            "winner": winner,
            "gameID": gameID,
            "team1": team1,
            "team2": team2,
            "percentage": win_percentage,
            "wind": wind_speed,
            "precipitation": precipitation,
            "temperature": temperature,
            "humidity": humidity
        }
    )


@app.errorhandler(404)
def invalid_endpoint(e, custom_message = ""):
    print(custom_message)
    return jsonify(
            {
                "message": USAGE_MESSAGE,
                "info": custom_message
            }
        ), 404

app.run(port=50300)
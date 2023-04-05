"""
API for the ML prediction engine. Returns a JSON response
Input for teams/players is given as an array entry
    Examples: 
        # Pre-built teams
        team1 = ['empire']
        # Players 
        player1 = ['bjagt']
        # Custom team
        team1 = [
            'bjagt', 
            'cbrock', 
            # Other players... 
        ] 
Weather input is given a dictionary/json entry
    Example:
        {
            'factors': 2,
            'wind_speed': 15,
            'temperature': 98
        }
"""

from flask import Flask, request, jsonify
from ml.svm import predict
# Will need to add import for ml.player_svm
# May also need to change each predict method name, so there is no overlap

app = Flask(__name__)

USAGE_MESSAGE = "Usage: \n\tGET /api/v1/predict/teams\n"

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

    team1Players = parameters.get("team1Players")
    team2Players = parameters.get("team2Players")
    wind_speed = parameters.get("wind_speed")
    temperature = parameters.get("temperature")
    precipitation = parameters.get("precipitation")
    humidity = parameters.get("humidity")
    print(len(team1Players), len(team2Players))

    if not (team1Players or team2Players or wind_speed or temperature or precipitation or humidity):
        return invalid_endpoint(404, custom_message="Missing parameters")
    elif len(team1Players) < 7 or len(team2Players) < 7 or len(team1Players) > 14 or len(team2Players) > 14:
        return invalid_endpoint(404, custom_message="Invalid Parameters: Teams do either contain less than 7 or more than 14 players")
    elif len(team1Players) != len(team2Players):
        return invalid_endpoint(404, custom_message="Invalid Parameters: Teams do not contain an equal amount of players")
    
    for player in team1Players:
        if (len(player) == 0):
            return invalid_endpoint(404, custom_message="Invalid parameters for player in team1")
    for player in team2Players:
        if (len(player) == 0):
            return invalid_endpoint(404, custom_message="Invalid parameters for a player in team2")
        
    # Pass prediction
    #Will need to change the predict method name
    result = predict(team1Players, team2Players, temperature, wind_speed, precipitation, humidity)
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
def predict_players_historical():
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
    
    for i in team1Players:
        if (len(team1Players[i]) == 0):
            return invalid_endpoint(404, custom_message="Invalid parameters for player in team1")
    for i in team2Players:
        if (len(team2Players[i]) == 0):
            return invalid_endpoint(404, custom_message="Invalid parameters for a player in team2")
        
    # Pass prediction
    #Will need to change the predict method name
    result = predict(team1Players, team2Players, temperature, wind_speed, precipitation, humidity)
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
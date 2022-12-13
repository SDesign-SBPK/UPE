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
#import ml

app = Flask(__name__)

USAGE_MESSAGE = "Usage: TODO"

@app.route("/api/v1/", methods = ["GET"])
def home():
    return jsonify(
        {
            "message": USAGE_MESSAGE
        }
    )


@app.route("/api/v1/predict/teams", methods = ["GET"])
def predict_teams():
    # Check valid parameters
    parameters = request.args

    team1 = parameters.get("team1")
    team2 = parameters.get("team2")
    weather_list = parameters.get("weather")

    if not (team1 or team2 or weather_list):
        return invalid_endpoint(404)

    # TODO: Need to call ML Engine prediction function with given info
    pass


@app.route("/api/v1/predict/players", methods = ["GET"])
def predict_players():
    pass


@app.route("/api/v1/predict/teams_custom", methods = ["GET"])
def predict_teams_custom():
    pass


@app.errorhandler(404)
def invalid_endpoint(e):
    return jsonify(
            {
                "message": USAGE_MESSAGE
            }
        ), 404

app.run()
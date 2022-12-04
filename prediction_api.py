"""
API for the ML prediction engine. Returns a JSON response
"""

from flask import Flask, request, jsonify, make_response
#import ml

app = Flask(__name__)

@app.route("/", methods = ["GET"])
def home():
    pass


@app.route("/predict", methods = ["GET", "POST"])
def predict():
    if request.method == "GET":
        return jsonify(
            {
                "message": "Usage: TODO"
            }
        )
    pass


@app.errorhandler(404)
def invalid_endpoint():
    return jsonify(
            {
                "message": "Endpoint not found"
            }
        ), 404

app.run()
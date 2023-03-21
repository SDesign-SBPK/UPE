const express = require('express');
const http = require("http");
const querystring = require("querystring");
const mysql = require('mysql');
const connection = require("../../database/connection.json");

const con = mysql.createConnection({
	host: connection.host,
	user: connection.user,
	password: connection.pass,
	database: connection.database
});

var router = express.Router();

/**
 * Collects all upcoming games from the database
 */
router.get("/Upcoming-Games", (req, res) => {
	
	con.query('SELECT gameID, awayTeam, homeTeam, startTime, timeZone, winner, forecastedTemp, forecastedWindSpeed, forecastedPrecipitation, forecastedHumidity, awayTeamCity, homeTeamCity FROM predictedgames', (err, rows, fields) => {
		if (err) throw err;
		res.send(rows);

	});
});

/**
 * Returns a predicted game entry
 * Requires a valid gameID
 */
router.get("/Select-Upcoming-Game/:id", (req, res) => {
	
	con.query('SELECT gameID, awayTeam, homeTeam, startTime, timeZone, winner, winnerPercentage, forecastedTemp, forecastedWindSpeed, forecastedPrecipitation, forecastedHumidity, awayTeamCity, homeTeamCity FROM predictedgames WHERE gameID = ?', [req.params.id], (err, rows, fields) => {
		if (err) throw err;

		res.send(rows[0]);
	});
});

/**
 * Forwards a prediction request to the prediction API (team-based)
 */
router.post("/Prediction-Form", (req, res) => {
	let homeTeam = req.body.homeTeam;
	let awayTeam = req.body.awayTeam;
	let windspeed = req.body.wind;
	let temp = req.body.temp;
	let humidity = req.body.humid;
	let precip = req.body.precip;

	// Create an object to be sent
	const url_object = {
		team1: homeTeam,
		team2: awayTeam,
		temperature: temp,
		wind_speed: windspeed,
		precipitation: precip,
		humidity: humidity
	};
	const url_args = querystring.stringify(url_object);

	// Send request
	let prediction = http.get("http://localhost:50300/api/v1/predict/teams/?" + url_args, response => {
		let data = "";
		response.on("data", chunk => {
			data += chunk;
		});

		response.on("end", () => {
			let msg = JSON.parse(data).message;
			let winner = JSON.parse(data).winner;
			res.send(data);
		});
	});
});

module.exports = router;
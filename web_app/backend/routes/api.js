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

const API_HOST = "http://localhost:50300";

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
 * Returns the average stats for a specified team
 */
router.get("/Team-Stats/:id", (req, res) => {
	con.query("SELECT teamID, teamName, wins, losses, gamesPlayed, completionPercentage, holdPercentage, breakPercentage, huckPercentage, turnovers, blocks, redZonePercentage, scoresFor, scoresAgainst FROM teams WHERE teamID = ?", [req.params.id], (err, rows, fields) => {
		if (err) throw err;
		console.log(rows);
		res.send(rows[0]);
	})
})

/**
 * Returns the average stat for a specified player
 */
router.get("/Player-Stats/:id", (req, res) => {
	con.query("SELECT playerID, firstName, lastName, completionPercentage, completions, goals, assists, plusMinus, gamesPlayed, minutesPlayed, pointsPlayed, huckPercentage, drops, throwaways, blocks, yardsThrown, yardsReceived, offenseEfficiency FROM players WHERE playerID = ?", [req.params.id], (err, rows, fields) => {
		if (err) throw err;
		console.log(rows);
		res.send(rows[0]);
	})
})

/**
 * Forwards a prediction request to the prediction API (player-based)
 */
router.post("/Prediction-Form-Player", (req, res) => {
	// Retrieve parameters from request
	let windspeed = req.body.wind;
	let temp = req.body.temp;
	let humidity = req.body.humid;
	let precip = req.body.precip;
	let team1Players = req.body.team1Players;
	let team2Players = req.body.team2Players;

	// Create a url object to send over
	const url_object = {
		team1Players: team1Players,
		team2Players: team2Players,
		temperature: temp,
		wind_speed: windspeed,
		precipitation: precip,
		humdidity: humidity
	};
	const url_args = querystring.stringify(url_object);

	// Send request to prediction API
	// TODO: Once Prection API has been udpated, update method to send request correctly
	console.log("Received request: " + url_args);
});

/**
 * Forwards a prediction request to the prediction API (team-based)
 */
router.post("/Prediction-Form-Team", (req, res) => {
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
	let prediction = http.get(API_HOST + "/api/v1/predict/teams/?" + url_args, response => {
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
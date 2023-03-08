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

//Collects Upcoming Games From DB
router.get("/Upcoming-Games", (req, res) => {
	
	con.query('SELECT gameID, awayTeam, homeTeam, startTime, timeZone, winner, forecastedTemp, forecastedWindSpeed, forecastedPrecipitation, forecastedHumidity, awayTeamCity, homeTeamCity FROM predictedgames', (err, rows, fields) => {
		if (err) throw err;
		
		res.send(rows);

	});
});

//Form Page
router.get("/Prediction-Form", (req, res) => {
	
});

router.post("/Prediction-Form", (req, res) => {
	console.log(req.body);
	let homeTeam = req.body.homeTeam;
	let awayTeam = req.body.awayTeam;
	let windspeed = req.body.wind;
	let temp = req.body.temp;
	let humidity = req.body.humid;
	let precip = req.body.precip;

	console.log(windspeed);
	//Send homeTeam and awayTeam to ML
	const url_object = {
		team1: homeTeam,
		team2: awayTeam,
		temperature: temp,
		wind_speed: windspeed,
		precipitation: precip,
		humidity: humidity
	};
	console.log(url_object);
	const url_args = querystring.stringify(url_object);
	console.log(url_args);
	let prediction = http.get("http://localhost:50300/api/v1/predict/teams/?" + url_args, response => {
		let data = "";
		response.on("data", chunk => {
			data += chunk;
		});

		response.on("end", () => {
			let msg = JSON.parse(data).message;
			let winner = JSON.parse(data).winner;
			console.log(data);
			console.log(winner);
			console.log(msg);
			res.send(data);
			// con.query('SELECT teamName FROM teams WHERE teamID = ?', [winner], (err, rows, fields) => {
			// 	if (err) throw err;

			// 	predictedWinner = rows;
			// 	res.send(predictedWinner[0].teamName);
				
			// });
		});
	});
});

module.exports = router;
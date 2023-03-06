const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const connection = require("../database/connection.json");
const http = require("http");
const querystring = require("querystring");
const { response } = require('express');

const con = mysql.createConnection({
	host: connection.host,
	user: connection.user,
	password: connection.pass,
	database: connection.database
  });

const app = express();

//Port 8080
const PORT = 8080;
/*process.env.PORT*/ 

//Build in middleware to handle urlencoded data (form data)
app.use(bodyParser.urlencoded({ extended: false }));

//Built in middleware for json
app.use(express.json());

//Used to serve static files
app.use(express.static(path.join(__dirname, '/../static')));

//Simple route for home page - file path will be changed
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, '/../templates/index.html'));
});

app.get("/Upcoming-Games", (req, res) => {
	
	con.query('SELECT gameID, awayTeam, homeTeam, startTime, timeZone, winner, forecastedTemp, forecastedWindSpeed, forecastedPrecipitation, forecastedHumidity, awayTeamCity, homeTeamCity FROM predictedgames', (err, rows, fields) => {
		if (err) throw err;
		
		res.send(rows);

	});
});

//Form Pages - need to be added
app.get("/Prediction-Form", (req, res) => {
	res.sendFile(path.join(__dirname, '/../templates/input.html'));
});

app.post("/Prediction-Form", (req, res) => {
	console.log(req.body);
	let homeTeam = req.body.homeTeam;
	let awayTeam = req.body.awayTeam;
	let windspeed = req.body.wind;
	let temp = req.body.temp;
	let humidity = req.body.humid;
	let precip = req.body.precip;

	//Send homeTeam and awayTeam to ML
	const url_object = {
		team1: homeTeam,
		team2: awayTeam,
		temperature: temp,
		wind_speed: windspeed,
		precipitation: precip,
		humidity: humidity
	};
	const url_args = querystring.stringify(url_object);
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
			con.query('SELECT teamName FROM teams WHERE teamID = ?', [winner], (err, rows, fields) => {
				if (err) throw err;

				predictedWinner = rows;
				res.send(predictedWinner[0].teamName);
				
			});
		});

	});

});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
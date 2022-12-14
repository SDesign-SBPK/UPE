const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const connection = require("../database/connection.json");
const http = require("http");
const querystring = require("querystring");

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
	res.sendFile(path.join(__dirname, '/../templates/index.html'))
});

app.get("/Upcoming-Games", (req, res) => {
	const mock_data = [
		{
			"homeTeam": "empire",
			"awayTeam": "breeze",
			"startTime": "December 16, 2022 6:00 PM"
		},
		{
			"homeTeam": "flyers",
			"awayTeam": "legion",
			"startTime": "December 16, 2022, 7:00 PM"
		},
		{
			"homeTeam": "hustle",
			"awayTeam": "cannons",
			"startTime": "December 17, 2022, 3:00 PM"
		},
		{
			"homeTeam": "royal",
			"awayTeam": "rush",
			"startTime": "December 17, 2022 6:30 PM"
		},
		{
			"homeTeam": "union",
			"awayTeam": "radicals",
			"startTime": "December 17, 2022 6:30 PM"
		}
	];

	let html_string = `<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1">
					<title>Upcoming Games</title>
					<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
		</head>
		<body>
		<input type = "button" onclick="document.location='/'" value = "Home" class = "btn btn-link">
		<div class = "container">
		<h1>Upcoming Games</h1>
		<div class = "row border-bottom">
			<div class = "col-sm-3">Away</div>
			<div class = "col-sm-3">Home</div> 
			<div class = "col-sm-3">Time</div>
			<div class = "col-sm-3">Predicted Winner</div>
		</div>`;

	// Call for a prediction of each game
	mock_data.forEach((game) => {
		const url_object = {
			team1: game.homeTeam,
			team2: game.awayTeam,
			wind_speed: 3
		};
		const url_args = querystring.stringify(url_object);
		let prediction = http.get("http://localhost:50300/api/v1/predict/teams/?" + url_args, response => {
			let data = "";
			response.on("data", chunk => {data += chunk});
			response.on("end", () => {
				game.winner = JSON.parse(data).winner;
			});
		});
	});

	console.log(mock_data);

	// Build table entries for each game
	mock_data.forEach((game) => {
		html_string += `<div class = "row">
			<div class = "col-sm-3">${game.awayTeam}</div>
			<div class = "col-sm-3">${game.homeTeam}</div> 
			<div class = "col-sm-3">${game.startTime}</div>
			<div class = "col-sm-3">${game.winner}</div>
			</div>`;
	});

	html_string += `</div></body></html>`;

	res.send(html_string);
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

	
	res.sendFile(path.join(__dirname, '/../templates/output.html'));
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
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
	
	con.query('SELECT gameID, , homeTeam, startTime, winner FROM predictedgames', (err, rows, fields) => {
		if (err) throw err;
		
		games = rows;

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

			// Build table entries for each game
		for (let i = 0; i< games.length; i++){
			html_string += `<div class = "row">
				<div class = "col-sm-2">${games[i].awayTeam}</div>
				<div class = "col-sm-2">${games[i].homeTeam}</div>
				<div class = "col-sm-2">${games[i].startTime}</div>
				<div class = "col-sm-3">${games[i].winner}</div>
			</div>`;
		}
				
		res.send(html_string);
	});
});

//This route showcases the ten games with the highest average wind speed
app.get("/Showcase-game-wspd", (req, res) => {
	let games = 0;

	con.query('SELECT gameID, homeTeam, awayTeam, averageWindSpeed, startTime, homeScore, awayScore FROM Games ORDER BY averageWindSpeed DESC LIMIT 25;', (err, rows, fields) => {
		if (err) throw err;
		
		games = rows;
		let html_string = `<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
						<meta name="viewport" content="width=device-width, initial-scale=1">
						<title>Highest Wind Speed Games</title>
						<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
			</head>
			<body>
			<input type = "button" onclick="document.location='/'" value = "Home" class = "btn btn-link">
			<div class = "container">
				<h1>Games with the Highest Wind Speed</h1>
				<div class = "row border-bottom">
					<div class = "col-sm-2">Away</div>
					<div class = "col-sm-2">Home</div>
					<div class = "col-sm-2">Time</div>
					<div class = "col-sm-2">Wind Speed</div>
					<div class = "col-sm-2">Score</div>
				</div>
			`;

		// Build table entries for each game
		for (let i = 0; i< games.length; i++){
			html_string += `<div class = "row">
				<div class = "col-sm-2">${games[i].awayTeam}</div>
				<div class = "col-sm-2">${games[i].homeTeam}</div>
				<div class = "col-sm-2">${games[i].startTime}</div>
				<div class = "col-sm-2">${games[i].averageWindSpeed}</div>
				<div class = "col-sm-2">${games[i].awayScore + "-" + games[i].homeScore}</div>
			</div>`;
		}

		html_string += `</div></body></html>`;
		res.send(html_string);
	});
})

//Route for Showcasing the ten players with the highest with the highest goals scored in a single game when windspeed is above 15 mph
app.get("/Showcase-playerstats-goals", (req, res) => {
	let playerGoals = 0;

	con.query('SELECT games.gameID, Players.firstName, Players.lastName, playergamestats.goals, games.averageWindSpeed, games.awayTeam, games.homeTeam FROM playergamestats INNER JOIN Games ON playergamestats.gameID = games.gameID AND games.averageWindSpeed >= 15 INNER JOIN Players ON playergamestats.playerID = players.playerID ORDER BY playergamestats.goals DESC LIMIT 25;', (err, rows, fields) => {
		if (err) throw err;
		
		playerGoals = rows;

		let html_string = `<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
						<meta name="viewport" content="width=device-width, initial-scale=1">
						<title>Highest Windy Game Goals</title>
						<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
			</head>
			<body>
			<input type = "button" onclick="document.location='/'" value = "Home" class = "btn btn-link">
			<div class = "container">
				<h1>Players with the Most Goals in Windy Games</h1>
				<h2>Windy is classified as being above 15 mph</h2>
				<div class = "row border-bottom">
					<div class = "col-sm-2">Name</div>
					<div class = "col-sm-2">Goals</div>
					<div class = "col-sm-2">Away Team</div>
					<div class = "col-sm-2">Home Team</div>
					<div class = "col-sm-2">Wind Speed</div>
				</div>
			`;

		for (let i = 1; i < playerGoals.length; i++) {
			html_string += `<div class = "row">
				<div class = "col-sm-2">${playerGoals[i].firstName + " " + playerGoals[i].lastName}</div>
				<div class = "col-sm-2">${playerGoals[i].goals}</div>
				<div class = "col-sm-2">${playerGoals[i].homeTeam}</div>
				<div class = "col-sm-2">${playerGoals[i].awayTeam}</div>
				<div class = "col-sm-2">${playerGoals[i].averageWindSpeed}</div>
			</div>`
		}

		html_string += `</div></body></html>`;
		res.send(html_string);
	});
})

//Form Pages - need to be added
app.get("/Prediction-Form", (req, res) => {
	res.sendFile(path.join(__dirname, '/../templates/input.html'));
});

app.post("/Prediction-Form", (req, res) => {
	console.log(req.body);
	let homeTeam = req.body.homeTeam;
	let awayTeam = req.body.awayTeam;
	let windspeed = req.body.wind;

	//Send homeTeam and awayTeam to ML
	const url_object = {
		team1: homeTeam,
		team2: awayTeam,
		wind_speed: windspeed
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
			res.send(`<!doctype html>
			<html lang="en">
			  <head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<title>Output</title>
				<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
			  </head>
			  <body>
				<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
				<input type = "button" onclick="document.location='/'" value = "Home" class = "btn btn-link">
				<div class="container-md">
				  <figure class="text-center">
					<h1>Your Predicted Outcome!</h1>        
				  </div>
				  <br>
				  <div class="row">
					<div class="col">
						The predicted winner of your custom match-up is the: 
					</div>
					<div class="col">
						<p class="text-danger">${ winner }</p>
					</div>
				  </div>
				  <br>
				  <div class="row">
					<div class="col">
			
					</div>
					<div class="col">
						<img src="fans.jpeg" class="img-fluid" alt="...">
					</div>
					<div class="col">
			
					</div>
				  </div>
				  
				</div>
				<div class="container-lg text-center">
				  <div class="row">
				  </div>
				</div>
			
			  </body>
			</html>`);
		});

	});

	//res.sendFile(path.join(__dirname, '/../templates/output.html'));
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
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
	res.sendFile(path.join(__dirname, '/../templates/index.html'))
});

//Needs to be updated if we decide to add this
app.get("/Upcoming-Games", (req, res) => {
	res.send("Under Construction - List of Games");
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
					<div class="col">
					  <form action="/">
						<input type="submit" class="btn btn-primary" value="Return Home" />
					  </form>
					</div>
				  </div>
				</div>
			
			  </body>
			</html>`);
		});

	});

	//res.sendFile(path.join(__dirname, '/../templates/output.html'));
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
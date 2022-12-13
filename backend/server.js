const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const connection = require("../database/connection.json");

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
	let homeTeam = req.body.dropdown1;
	let awayTeam = req.body.dropdown2;
	let windspeed = req.body.wind;

	//Send homeTeam and awayTeam to ML

	res.sendFile(path.join(__dirname, '/../templates/output.html'));
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
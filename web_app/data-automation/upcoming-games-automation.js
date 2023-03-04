const mysql = require('mysql');
const connection = require("../database/connection.json");
const upcomingGamesParser = require("../scrapers/player/upcoming-games-store.js");
//import { weatherForecastData } from "../scrapers/weather/weather-forecast-script.js";
const moment = require("moment");
const http = require("http");
const querystring = require("querystring");

//Connection to DB
const con = mysql.createConnection({
	host: connection.host,
	user: connection.user,
	password: connection.pass,
	database: connection.database
});

//updateUpcomingGames();
calculatePredictions();

/*async function updateUpcomingGames(){

    //Deletes all current game predictions from DB
    await con.query('DELETE FROM predictedgames', (err, rows, fields) => {
        if (err) throw err;
    });

    //Updates Games from Upcoming to final status after the start time date passes
    con.query('SELECT * FROM games WHERE status = "Upcoming"', (err, rows, fields) => {
        if (err) throw err;

        let games = rows;
        let date = new Date().toJSON();
        let dateTime = date.substring(0, 19);
        for (let i = 0; i < games.length; i++){
            s = moment(games[i].startTime).toISOString(true);
            var startTime = s.substring(0, 19);
            if (moment(startTime).isBefore(dateTime) == true){
                con.query('UPDATE games SET status = "Final" WHERE gameID = ?',[games[i].gameID], (err, rows, fields) => {
                    if (err) throw err;
                });
            }
        }
    }) 

    await upcomingGamesParser.storeGamesOnPage;
    //await calculatePredictions();
    //weatherForecastData.gameDataRetrieval;
    return;
} */

//Calculates Predictions for Current Upcoming Games
//Stores Predicted Information into predictedgames table
async function calculatePredictions() {

    //Get all upcoming games from DB
    con.query('SELECT * FROM games WHERE status = "Upcoming"', (err, rows, fields) => {
		if (err) throw err;

        let games = rows;
        for (let i = 0; i < games.length; i++){

            //Argument sent to Prediction Algorithm
            //Will need to be changed when ML is updated
            const url_object = {
                team1: games[i].homeTeam,
                team2: games[i].awayTeam,
                temperature: games[i].averageTemperature,
                wind_speed: games[i].averageWindSpeed,
                precipitation: games[i].averagePrecipitation,
                humidity: games[i].averageHumidity
            };

            //Send request to Prediction API
            const url_args = querystring.stringify(url_object);
            let prediction = http.get("http://localhost:50300/api/v1/predict/teams/?" + url_args, response => {
                let data = "";
                response.on("data", chunk => {data += chunk});
                response.on("end", () => {
                    //console.log(data);
                    let winner = JSON.parse(data).winner;
                    console.log(winner);
                    
                    //Store Prediction Results
                    let records = [[
                        games[i].gameID, 
                        games[i].awayTeam,
                        games[i].homeTeam, 
                        games[i].startTime, 
                        games[i].timeZone,
                        winner, 
                        games[i].averageTemperature, 
                        games[i].averageWindSpeed, 
                        games[i].averagePrecipitation, 
                        games[i].averageHumidity, 
                        games[i].homeTeamCity, 
                        games[i].awayTeamCity, 
                        games[i].homeTeamCity]
                    ];

                    //Insert Prediction Results into Predicted Games Table
                    con.query('INSERT INTO predictedgames (gameID, awayTeam, homeTeam, startTime, timeZone, winner, forecastedTemp, forecastedWindSpeed, forecastedPrecipitation, forecastedHumidity, locationName, awayTeamCity, homeTeamCity) VALUES ?', [records], (err, result, fields) => {
                        
                        if (err) throw err;

                        console.log(result);
                    });
                    
                });
            });
        }
    
    });

    return;

}

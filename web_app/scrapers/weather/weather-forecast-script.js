import fetch from "node-fetch";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
var moment = require('moment');
const mysql = require('mysql');
const connection = require("../../database/connection.json");
const gameController = require("../../database/controllers/Game.controller");
const weatherController = require("../../database/controllers/WeatherInterval.controller");

const con = mysql.createConnection({
	host: connection.host,
	user: connection.user,
	password: connection.pass,
	database: connection.database
  });

gameDataRetrieval();

async function gameDataRetrieval() {

    con.query('SELECT * FROM games WHERE status = "Upcoming"', async (err, rows, fields) => {
		if (err) throw err;

        let games = rows;

        for (let i = 0; i < games.length; i++){
            var startTime = games[i].startTime;
            var location = games[i].homeTeamCity;
            let game = {
                gameID: games[i].gameID,
                awayTeam: games[i].awayTeam,
                homeTeam: games[i].homeTeam,
                awayTeamCity: games[i].awayCity,
                homeTeamCity: games[i].homeCity,
                startTime: startTime.replace("T", " "),
                endTime: " ",
                awayScore: games[i].awayScore,
                homeScore: games[i].homeScore,
                status: games[i].status,
                averageTemperature: 0,
                averageWindSpeed: 0,
                averagePrecipitation: 0,
                averageHumidity: 0
            }

            await wait(2500);
            getWeatherData(startTime, location, game);
            await wait(2500);
        }
	});
    return;
}


//Wait function to slow down requests to VisualCrossingAPI
function wait(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

//Retrieves weather data from VisualCrossingAPI depending on start, end, and location parameters
async function getWeatherData(start, loc, game){
    try {
        //Automatically computes end timestamp based on the start of each game
        var dateString = game.gameID.substring(0, 10);
        var startDateTime = dateString + "T" + start;
        var endDateTime = moment(startDateTime).add(2, 'h').toISOString(true);
        var endTime = endDateTime.substring(0, 19);
        game.endTime = endTime.replace("T", " ");
        
        //Weather API Request
        var uri = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?aggregateHours=1"
         + "&unitGroup=us&contentType=json&locationMode=single&location=" + loc + "&key=BXJMPGTKDASB9QYG9KQ595BQF";
         const response = await fetch(uri);

        if (!response.ok){
            throw new Error('Error! status: ' + response.status);
        }

        const result = await response.json();
        
        //Process and Extract Useful Weather Data
        processWeatherData(result, game);
        return;

    } catch (err) {
        console.log(err);
        console.error(err);
    }
}

//Processes WeatherData into 15 minute intervals
//Provides temp, wind speed, precipation, and humidity for each interval
async function processWeatherData(weatherData, game){
    if (!weatherData) {
        console.log("Empty response");
        return;
    }
    if (weatherData.errorCode>0) {
        console.log("Error detected. errorCode="+weatherData.errorCode+", message="+weatherData.message);
        return;
    }

    var location = weatherData['location'];
    var values = location['values'];
    //console.log(values);
    console.log("Location: "+location.address);
    let sumTemp = 0;
    let sumPrecip = 0;
    let sumWspd = 0;
    let sumHumidity = 0;

    for (var i=0;i<values.length;i++) {
        console.log(values[i].datetimeStr+": temp="+values[i].temp+", wspd="+values[i].wspd+", precip="+values[i].precip+ ", humidity="+values[i].humidity);
        let timestamp = values[i].datetimeStr;
        let intTime = (timestamp.substring(0, 19)).replace("T", " ");
        let weatherInterval = {
            gameID: game.gameID,
            intervalNumber: i+1,
            intervalTime: intTime,
            temperature: values[i].temp,
            windSpeed: values[i].wspd, 
            precipitation: values[i].precip, 
            humidity: values[i].humidity
        };
        weatherController.createWeatherInterval(weatherInterval);
        sumTemp += values[i].temp;
        sumPrecip += values[i].precip;
        sumWspd += values[i].wspd;
        sumHumidity += values[i].humidity;
    }
    
    game.averageTemperature = sumTemp / values.length;
    game.averagePrecipitation = sumPrecip / values.length;
    game.averageWindSpeed = sumWspd / values.length;
    game.averageHumidity = sumHumidity / values.length;
    console.log("AvgTemp=" + game.averageTemperature + ", AvgPrecip=" + game.averagePrecipitation + ", AvgWspd=" + game.averageWindSpeed + ", AvgHumidity=" + game.averageHumidity);

    gameController.updateGame(game.gameID, game);

    return;
}
import fetch from "node-fetch";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');
var moment = require('moment');
const gameController = require("../../database/controllers/Game.controller");
const weatherController = require("../../database/controllers/WeatherInterval.controller");

gameDataRetrieval(fs, path);

async function gameDataRetrieval(fs, path) {
    //Collects location and timestamp information from each game record.
    const dir = "./weather/game-history2/";
    const jsonFiles = fs.readdirSync(dir).filter(file => path.extname(file) === '.json');
    console.log(jsonFiles);
    
    //
    for (let i = 0; i < jsonFiles.length; i++) {
        const fileData = fs.readFileSync(path.join(dir, jsonFiles[i]));
        const json = JSON.parse(fileData.toString());
        var startTime = (json.timestamp).substring(0, 19);
        var location = json.homeCity;
        let game = {
            gameID: json.gameID,
            awayTeam: json.awayTeam,
            homeTeam: json.homeTeam,
            awayTeamCity: json.awayCity,
            homeTeamCity: json.homeCity,
            startTime: startTime.replace("T", " "),
            endTime: " ",
            awayScore: json.awayScore,
            homeScore: json.homeScore,
            averageTemperature: 0,
            averageWindSpeed: 0,
            averagePrecipitation: 0,
            averageHumidity: 0
        };
        console.log(jsonFiles[i]);
        await wait(2500);
        getWeatherData(startTime, location, game);
        await wait(2500);
    }

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
        var endTime = moment(start).add(2, 'h').toISOString(true);
        var end = endTime.substring(0, 19);
        game.endTime = end.replace("T", " ");
        
        //Weathe API Request
        var uri = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?combinationMethod=aggregate&aggregateMinutes=15&startDateTime=" + start
         + "&endDateTime=" + end + "&unitGroup=us&contentType=json&locationMode=single&location=" + loc + "&key=BXJMPGTKDASB9QYG9KQ595BQF";
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

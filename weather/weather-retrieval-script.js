//IMPORTANT: Must run command "npm install node-fetch" - then add the line: "type": "module" into package.json file.

import fetch from "node-fetch";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');
var moment = require('moment');

gameDataRetrieval(fs, path);

async function gameDataRetrieval(fs, path) {
    //Placeholder values for testing purposes
    var startTime = "2022-08-29T10:00:00";
    var endTime = "2022-08-27T20:00:00";
    var location = "Washington,DC";
    const val = getWeatherData(startTime, endTime, location);

    //Loop to read all JSON files from game-history directory
    //Collects location and timestamp from each file.
    const dir = "./game-history2/";
    const jsonFiles = fs.readdirSync(dir).filter(file => path.extname(file) === '.json');

    jsonFiles.forEach(file =>{
        const fileData = fs.readFileSync(path.join(dir, file));
        const json = JSON.parse(fileData.toString());
        startTime = json.timestamp;
        location = json.homeCity;
        console.log(file);
        console.log(startTime);
        console.log(location);
    })

    //const val = getWeatherData(startTime, endTime, location);

    //Must add way to Insert intervals into database

}

//Retrieves weather data from VisualCrossingAPI depending on start, end, and location parameters
async function getWeatherData(start, end, loc){
    try {
        var endTime = moment(start).add(2, 'h').toISOString(true);
        end = endTime.substring(0, 19)
        console.log(end);
        var uri = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?combinationMethod=aggregate&aggregateMinutes=15&startDateTime=" + start
         + "&endDateTime=" + end + "&unitGroup=us&contentType=json&locationMode=single&location=" + loc + "&key=BXJMPGTKDASB9QYG9KQ595BQF";
        const response = await fetch(uri);

        if (!response.ok){
            throw new Error('Error! status: ' + response.status);
        }

        const result = await response.json();
        
        const values = processWeatherData(result);
        return values;

    } catch (err) {
        console.log(err);
        console.error(err);
    }
}

//Processes WeatherData into 15 minute intervals
//Provides temp, wind speed, precipation, and humidity for each interval
async function processWeatherData(weatherData){
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
        sumTemp += values[i].temp;
        sumPrecip += values[i].precip;
        sumWspd += values[i].wspd;
        sumHumidity += values[i].humidity;
    }
    
    let avgTemp = sumTemp / values.length;
    let avgPrecip = sumPrecip / values.length;
    let avgWspd = sumWspd / values.length;
    let avgHumidity = sumHumidity / values.length;
    console.log("AvgTemp=" + avgTemp + ", AvgPrecip=" + avgPrecip + ", AvgWspd=" + avgWspd + ", AvgHumidity=" + avgHumidity);
    return values;
}

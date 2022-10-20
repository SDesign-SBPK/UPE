//IMPORTANT: Must run command "npm install node-fetch" - then add the line: "type": "module" into package.json file.

import fetch from "node-fetch";

const data = getWeatherData();

//Prints the json of a single request from Visual Crossing. Must be automated in the future.
async function getWeatherData(){
    try {
        var uri = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?&aggregateHours=24&startDateTime=2019-06-13T00:00:00&"
        + "endDateTime=2019-06-20T00:00:00&unitGroup=uk&contentType=json&dayStartTime=0:0:00&dayEndTime=0:0:00&location=Sterling,VA,US&key=BXJMPGTKDASB9QYG9KQ595BQF";

        const response = await fetch(uri);

        if (!response.ok){
            throw new Error('Error! status: ' + response.status);
        }

        const result = await response.json();
        
        //Printing the response is not ideal at the moment.
        //Further work will be done in order to print the direct temperature values.
        console.log(result);
        return response;

    } catch (err) {
        console.log(err);
        console.error(err);
    }
}

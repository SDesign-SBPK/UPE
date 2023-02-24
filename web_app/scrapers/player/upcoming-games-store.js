const internet = require('https')
const mysql = require('mysql');
const connection = require("../../database/connection.json");
const baseUrl = 'https://www.backend.audlstats.com/web-api/games?current'

let pageOfGameHistory

//Connection to DB
const con = mysql.createConnection({
	host: connection.host,
	user: connection.user,
	password: connection.pass,
	database: connection.database
});


//Collect Upcoming Games Data for the next week from AUDL and store in DB
const savePageJson = function (res) {
    let body = "";
    try {
        //Wait until the information received from the https request is the actual raw data, then store it in a temporary variable
        res.on("data", (chunk) => {
            body += chunk;
        })

        //Once we've received all the json info, we parse in order to access it, then store it into the DB.
        res.on("end", () => {
            pageOfGameHistory = JSON.parse(body);
            
            //Loop through the Upcoming Games JSON and store each separate game into the DB 
            for(let index = 0; index < pageOfGameHistory['games'].length; index++){
                    let currentDate = new Date().toJSON().slice(0, 19);
                    let records = [[
                        pageOfGameHistory['games'][index]['gameID'], 
                        pageOfGameHistory['games'][index]['awayTeamID'],
                        pageOfGameHistory['games'][index]['homeTeamID'], 
                        pageOfGameHistory['games'][index]['startTimestamp'], 
                        pageOfGameHistory['games'][index]['startTimezone'], 
                        pageOfGameHistory['games'][index]['status'],
                        pageOfGameHistory['games'][index]['awayTeamCity'], 
                        pageOfGameHistory['games'][index]['homeTeamCity'],
                        currentDate,
                        currentDate]
                    ];
                    console.log(pageOfGameHistory['games'][index]['gameID']);

                    //Insert Upcoming game into games table
                    con.query('INSERT INTO games (gameID, awayTeam, homeTeam, startTime, timeZone, status, awayTeamCity, homeTeamCity, createdAt, updatedAt) VALUES ?', [records], (err, result, fields) => {
                        
                        if (err) throw err;

                        console.log(result);
                    });
            }
            //Close DB Connection
            con.end();
        });
    }catch (error){}
}

//The initial function to call.
function storeGamesOnPage (){
    internet.get(baseUrl, savePageJson).on("error", (error) => {});
}

storeGamesOnPage();
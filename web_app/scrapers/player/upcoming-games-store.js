const internet = require('https')
const mysql = require('mysql');
const moment = require("moment");
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

loop();

async function loop(){

    //Gather new Upcoming Games from the AUDL every 24 hours
    setInterval(storeGamesOnPage, 1000 * 60 * 60 * 24);
    //setInterval(storeGamesOnPage, 10000)
}


//Collect Upcoming Games Data for the next week from AUDL and store in DB
const savePageJson = async function (res) {
    let body = "";

    //Deletes Any remaining predictedgames from DB
    await con.query('DELETE FROM predictedgames', (err, rows, fields) => {
        if (err) throw err;
    });

    //Deletes all previously calculated weather intervals from DB
    await con.query('DELETE weatherintervals FROM weatherintervals INNER JOIN games ON weatherintervals.gameID = games.gameID WHERE games.status = "Upcoming"', (err, rows, fields) => {
        if (err) throw err;
    });

    //Deletes Any leftover upcoming games from DB
    await con.query('DELETE FROM games WHERE status = "Upcoming"', (err, rows, fields) => {
        if (err) throw err;
    });

    //Updates Games from Upcoming to final status after the start time date passes
    await con.query('SELECT * FROM games WHERE status = "Upcoming"', (err, rows, fields) => {
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

    try {
        //Wait until the information received from the https request is the actual raw data, then store it in a temporary variable
        await res.on("data", (chunk) => {
            body += chunk;
        })

        //Once we've received all the json info, we parse in order to access it, then store it into the DB.
        await res.on("end", () => {
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
        });
    }catch (error){}
    return;
}

//The initial function to call.
async function storeGamesOnPage (){
    await internet.get(baseUrl, savePageJson).on("error", (error) => {});
    return;
}

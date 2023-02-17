const internet = require('https')
const mysql = require('mysql');
const connection = require("../../database/connection.json");
const pageLimit = 145
const baseUrl = 'https://www.backend.audlstats.com/web-api/games?limit=10&page='
let page = 1
let interval

let pageOfGameHistory

//Connection to DB
const con = mysql.createConnection({
	host: connection.host,
	user: connection.user,
	password: connection.pass,
	database: connection.database
});


//Store the data being entered via https into a json format, and then save into a player file
const savePageJson = function (res) {
    let body = ""
    try {
        //Wait until the information received from the https request is the actual raw data, then store it in a temporary variable
        res.on("data", (chunk) => {
            body += chunk
        })

        //Once we've received all the json info, we parse in order to access it, then store it into the files.
        res.on("end", () => {
            pageOfGameHistory = JSON.parse(body);
            //Loop through the stats array of players in order to save each of the stats in an instance of the player class, then
            //stringify the instance and store it into a .json file named after the players lastname,firstname.
            for(let index = 0; index < pageOfGameHistory['games'].length; index++){
                if (pageOfGameHistory['games'][index]['status'] == "Upcoming"){
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
                    console.log(index);

                    //Insert Upcoming game into games table
                    con.query('INSERT INTO games (gameID, awayTeam, homeTeam, startTime, timeZone, status, awayTeamCity, homeTeamCity, createdAt, updatedAt) VALUES ?', [records], (err, result, fields) => {
                        
                        if (err) throw err;

                        console.log(result);
                    });
                    
                }
            }
            page++
            console.log(page);
            if(page > pageLimit){
                clearInterval(interval)
            }
        })
    }catch (error){}
}

//The initial function to call.
let storeGamesOnPage = function (){
    internet.get(baseUrl + page, savePageJson).on("error", (error) => {})

}

//Set this on an interval for each page. 
interval = setInterval(storeGamesOnPage, 10)
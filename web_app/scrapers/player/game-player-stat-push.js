const fs = require('fs')
const path = require('path')
const mysql = require('mysql');
const connection = require("../../database/connection.json");

//Connection to DB
const con = mysql.createConnection({
	host: connection.host,
	user: connection.user,
	password: connection.pass,
	database: connection.database
});

pushPlayerGameStatFiles(path.normalize(__dirname + '/../player-game-stats'));

function pushPlayerGameStatFiles(directory){

    //Callback function for readdir()
    let pushFile = function (err, files){

        //In case there is an error that pops up
        if(err){
            console.log(err)
        }

        //Take each file from the array and push it to the database
        files.forEach(file => {

            let controller = require('../../database/controllers/PlayerGameStats.controller')
            //Make the path for each of the files
            let fullFilePath = path.normalize(directory + '/' + file.name)

            //Read the data from the file using the file path into a string format
            let data = fs.readFileSync(fullFilePath)

            //Storing the raw data from the file into a JSON format
            let json = JSON.parse(data)
            //Use the database controller to push the JSON file
                        //console.log(json);
                        let currentDate = new Date().toJSON().slice(0, 19);
                        let records = [[
                            json.gameID,
                            json.playerID,
                            json.isHome,
                            json.goals,
                            json.assists,
                            json.throwaways,
                            json.completionPercentage,
                            json.completions,
                            json.catches,
                            json.drops,
                            json.blocks,
                            json.secondsPlayed,
                            json.yardsThrown,
                            json.yardsReceived,
                            currentDate,
                            currentDate]
                        ];
                        con.query('INSERT INTO playergamestats (gameID, playerID, isHome, goals, assists, throwaways, completionPercentage, completions, catches, drops, blocks, secondsPlayed, yardsThrown, yardsReceived, createdAt, updatedAt) VALUES ?', [records], (err, result, fields) => {
                            if (err) throw err;
            
                        });
        })
    }

    fs.readdir(directory,{withFileTypes: true}, pushFile)
}



module.exports ={pushPlayerGameStatFiles}
/**
 * IMPORTANT: This requires there to be a directory at the same level of the run directory labeled game-history in order to store the files
 * future iterations will hopefully have the ability to create the directory.
 */

const internet = require('https')
const fileStream = require("fs")
const pageLimit = 145
const baseUrl = 'https://www.backend.audlstats.com/web-api/games?limit=10&page='
let page = 1
let interval

let pageOfGameHistory;

/*
Store the data being entered via https into a json format, and then save into a player file
 */
const savePageJson = function (res) {
    let body = ""
    try {
        //Wait until the information received from the https request is the actual raw data, then store it in a temporary variable
        res.on("data", (chunk) => {
            body += chunk
        })

        //Once we've received all the json info, we parse in order to access it, then store it into the files.
        res.on("end", () => {
            pageOfGameHistory = JSON.parse(body)
            //Loop through the stats array of players in order to save each of the stats in an instance of the player class, then
            //stringify the instance and store it into a .json file named after the players lastname,firstname.
            for(let index = 0; index < pageOfGameHistory['games'].length; index++){
                let game = require('../audl-containers/game')
                console.log(pageOfGameHistory['games'][index]['gameID'])
                game.gameID = pageOfGameHistory['games'][index]['gameID']
                game.awayTeam = pageOfGameHistory['games'][index]['awayTeamID']
                game.homeTeam = pageOfGameHistory['games'][index]['homeTeamID']
                game.awayCity = pageOfGameHistory['games'][index]['awayTeamCity']
                game.homeCity = pageOfGameHistory['games'][index]['homeTeamCity']
                game.locationName = pageOfGameHistory['games'][index]['locationName']
                game.awayScore = pageOfGameHistory['games'][index]['awayScore']
                game.homeScore = pageOfGameHistory['games'][index]['homeScore']
                game.status = pageOfGameHistory['games'][index]['status']
                game.timestamp = pageOfGameHistory['games'][index]['startTimestamp']
                game.timezone = pageOfGameHistory['games'][index]['startTimezone']
                game.week = pageOfGameHistory['games'][index]['week']
                let playerFile = fileStream.createWriteStream(__dirname + '/../game-history/' + game.gameID + '.json')
                fileStream.writeFile(playerFile.path, JSON.stringify(game), 'utf-8', function () {

                })
            }
            page++
            if(page > pageLimit){
                clearInterval(interval)
            }
        })
    }catch (error){}
}


//The initial function to call. Currently unsure why, but after every request, an error (I believe is just a connection timeout) is received.
let storeGamesOnPage = function (){
    internet.get(baseUrl + page, savePageJson).on("error", (error) => {})
    console.log("Page Done: " + page)

}

//Set this on an interval for each page. Has to be long enough as node.js is asynchronous which causes it to try and call
//when it may not be done processing a page
interval = setInterval(storeGamesOnPage, 1000)
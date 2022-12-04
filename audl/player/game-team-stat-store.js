/**
 * IMPORTANT: This requires there to be a directory at the same level of the run directory labeled game-history in order to store the files
 * future iterations will hopefully have the ability to create the directory.
 */

const internet = require('https')
const fileStream = require("fs")
const pageLimit = 129
const baseUrl = 'https://www.backend.audlstats.com/web-api/team-game-stats?limit=20&page='
let page = 1
let interval
const path = require('path')
let pageOfGameHistory

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
            for(let index = 0; index < pageOfGameHistory['stats'].length; index++){
                let game = require(path.normalize('../audl-containers/team-game-stats'))
                game.gameID = pageOfGameHistory['stats'][index]['gameID']
                game.teamID = pageOfGameHistory['stats'][index]['teamID']
                game.completionPercentage = pageOfGameHistory['stats'][index]['completions'] / pageOfGameHistory['stats'][index]['throwingAttempts']
                game.completions = pageOfGameHistory['stats'][index]['completions']
                game.huckPercentage = pageOfGameHistory['stats'][index]['hucksCompleted'] / pageOfGameHistory['stats'][index]['hucksAttempted']
                game.redZonePercentage = pageOfGameHistory['stats'][index]['redZoneScores'] / pageOfGameHistory['stats'][index]['redZonePossessions']
                game.holdPercentage = pageOfGameHistory['stats'][index]['oLineScores'] / pageOfGameHistory['stats'][index]['oLinePoints']
                game.breakPercentage = pageOfGameHistory['stats'][index]['dLineScores'] / pageOfGameHistory['stats'][index]['dLinePoints']
                game.score = -1
                game.turnovers = pageOfGameHistory['stats'][index]['turnovers']
                game.blocks = pageOfGameHistory['stats'][index]['blocks']
                let teamGameFile = fileStream.createWriteStream(path.normalize(__dirname + '/../team-game-stats/' + game.gameID + '.json') )
                teamGameFile.write(JSON.stringify(game), function () {
                    teamGameFile.close();
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

}

//Set this on an interval for each page. Has to be long enough as node.js is asynchronous which causes it to try and call
//when it may not be done processing a page
interval = setInterval(storeGamesOnPage, 10)
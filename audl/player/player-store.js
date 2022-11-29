/**
 * IMPORTANT: This requires there to be a directory at the same level of the run directory labeled player-files in order to store the files
 * future iterations will hopefully have the ability to create the directory.
 */

const internet = require('https')
const fileStream = require("fs")
let pageLimit = 149
const baseUrl = 'https://www.backend.audlstats.com/web-api/player-stats?limit=20&page='
let page = 1
let directory = __dirname + '/../player-files/'
let interval

let pageOfPlayers;

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
            pageOfPlayers = JSON.parse(body)
            //Loop through the stats array of players in order to save each of the stats in an instance of the player class, then
            //stringify the instance and store it into a .json file named after the players lastname,firstname.
            for(let index = 0; index < pageOfPlayers['stats'].length; index++){
                let player = require('../audl-containers/player')
                console.log(pageOfPlayers['stats'][index]['playerID'])
                player.playerID = pageOfPlayers['stats'][index]['playerID']
                player.firstName = pageOfPlayers['stats'][index]['name'].split(' ')[0]
                player.lastName = pageOfPlayers['stats'][index]['name'].split(' ')[1]
                player.completionPercentage = pageOfPlayers['stats'][index]['completionPercentage']
                player.goals = pageOfPlayers['stats'][index]['goals']
                player.assists = pageOfPlayers['stats'][index]['assists']
                player.plusMinus = pageOfPlayers['stats'][index]['plusMinus']
                player.gamesPlayed = pageOfPlayers['stats'][index]['gamesPlayed']
                player.minutesPlayed = pageOfPlayers['stats'][index]['minutesPlayed']
                player.pointsPlayed = pageOfPlayers['stats'][index]['pointsPlayed']
                player.huckPercentage = pageOfPlayers['stats'][index]['huckPercentage']
                player.drops = pageOfPlayers['stats'][index]['drops']
                player.throwaways = pageOfPlayers['stats'][index]['throwaways']
                player.blocks = pageOfPlayers['stats'][index]['blocks']
                let playerFile = fileStream.createWriteStream(directory + player.lastName + ',' + player.firstName + '.json')
                fileStream.writeFile(playerFile.path, JSON.stringify(player), 'utf-8', function () {})
                playerFile.close()
            }
            page++
            if(page > pageLimit){
                clearInterval(interval)
            }
        })
    }catch (error){}
}


//The initial function to call. Currently unsure why, but after every request, an error (I believe is just a connection timeout) is received.
let storePayersOnPage = function (){
    internet.get(baseUrl + page, savePageJson).on("error", (error) => {})
    console.log("Page Done: " + page)

}

/**
 * This will store the stats of players from the pages specified into a specified directory. It will print out the page number done once completed.
 *
 * @param startPage Must be greater than or equal to 1. This will be the page that the function will start pulling from the AUDL site
 * @param endPage The last page to store from the AUDL site
 * @param storingDirectory Defined base directory that each of the player files will be stored to. The directory has to exist in order to function.
 * Note that it is a relative path that is used.
 */
const storePlayerPages = function(startPage, endPage, storingDirectory){
    page = startPage
    pageLimit = endPage
    directory = storingDirectory
    interval = setInterval(storePayersOnPage, 100)
}

module.exports = {storePlayerPages}



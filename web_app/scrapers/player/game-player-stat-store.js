/**
 * IMPORTANT: This requires there to be a directory at the same level of the run directory labeled player-game-stats in order to store the files
 * future iterations will hopefully have the ability to create the directory.
 */

const internet = require('https')
const fileStream = require("fs")
const path = require('path')
const pageLimit = 149
const yearLimit = 2022
const baseStatsUrl = 'https://www.backend.audlstats.com/web-api/roster-game-stats-for-player?playerID='
const basePlayerUrl = 'https://www.backend.audlstats.com/web-api/player-stats?limit=20&page='
let startYear = 2014
let page = 1

let interval;

let storePlayerGameStats = function(pageNumber){
    return new Promise(() => {
        internet.get(basePlayerUrl + pageNumber, function (res) {
            let list = []
            let body = ""
            let parsedBody = "";
            try {

                res.on("data", (chunk) => {
                    body += chunk
                })


                res.on("end", () => {
                    parsedBody = JSON.parse(body)

                    for(let index = 0; index < parsedBody['stats'].length; index++){
                        let player = require(path.normalize('../audl-containers/player'))
                        player.playerID = parsedBody['stats'][index]['playerID']
                        list.push(player.playerID)
                    }

                    for(let index = 0; index < list.length; index++){
                        for(let year = startYear; year < yearLimit; year++){

                            new Promise(() => {
                                internet.get(baseStatsUrl + list[index] + '&year=' + year, function (results) {
                                    let yearBody = ""
                                    let parsedYear = ""
                                    try{
                                        results.on("data", (chunk) => {
                                            yearBody += chunk
                                        })

                                        results.on("end", () => {
                                            parsedYear = JSON.parse(yearBody)
                                            for(let game = 0; game < parsedYear['stats'].length; game++){
                                                let playerGameStat = require(path.normalize('../audl-containers/player-game-stats'))
                                                playerGameStat.gameID = parsedYear['stats'][game]['gameID']
                                                playerGameStat.playerID = list[index]
                                                playerGameStat.isHomeTeam = parsedYear['stats'][game]['isHome']
                                                playerGameStat.goals = parsedYear['stats'][game]['goals']
                                                playerGameStat.assists = parsedYear['stats'][game]['assists']
                                                playerGameStat.throwaways = parsedYear['stats'][game]['throwaways']
                                                playerGameStat.completions = parsedYear['stats'][game]['completions']
                                                playerGameStat.completionPercentage = ((parsedYear['stats'][game]['completions'] / parsedYear['stats'][game]['throwsAttempted']) * 100)
                                                playerGameStat.catches = parsedYear['stats'][game]['catches']
                                                playerGameStat.drops = parsedYear['stats'][game]['drops']
                                                playerGameStat.blocks = parsedYear['stats'][game]['blocks']
                                                playerGameStat.secondsPlayed = parsedYear['stats'][game]['secondsPlayed']
                                                playerGameStat.yardsThrown = parsedYear['stats'][game]['yardsThrown']
                                                playerGameStat.yardsReceived = parsedYear['stats'][game]['yardsReceived']
                                                try{
                                                    let playerGameFile = fileStream.createWriteStream(path.normalize(__dirname + '/../player-game-stats/' + list[index] + '-' + playerGameStat.gameID + '.json'))
                                                    playerGameFile.write(JSON.stringify(playerGameStat), function (){
                                                        playerGameFile.close();
                                                    })

                                                }catch (error) {console.log(error)}
                                            }
                                        })
                                    }catch (error) {console.log("Issue")}
                                }).on("error", () => {})
                            })
                        }
                    }
                })
            }catch (error){}
        }).on("error", () => {})
    })
}

let mainFunction = function (){
    storePlayerGameStats(page)
    page++
    if(page > pageLimit) clearInterval(interval)
}

interval = setInterval(mainFunction, 100)



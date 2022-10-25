/**
 * IMPORTANT: This requires there to be a directory at the same level of the run directory labeled player-game-stats in order to store the files
 * future iterations will hopefully have the ability to create the directory.
 */

const internet = require('https')
const fileStream = require("fs")
const pageLimit = 10
const yearLimit = 2022
const baseStatsUrl = 'https://www.backend.audlstats.com/web-api/roster-game-stats-for-player?playerID='
const basePlayerUrl = 'https://www.backend.audlstats.com/web-api/player-stats?limit=20&page='
let startYear = 2014
let page = 1
let interval

let playerIndex = 0
let playerIdList = []

const savePlayerGameStats = function (res) {
    let body = ""
    let parsedBody = ""
    try{
        res.on("data", (chunk) => {
            body += chunk
        })

        res.on("end", ()=>{
            parsedBody = JSON.parse(body)
            for(let index = startYear; index < yearLimit; index++){

            }

            playerIndex++
            if(playerIndex === playerIdList.length)(
                clearInterval(interval)
            )
        })
    }catch (error) {

    }
}


/*
Store the data being entered via https into a json format, and then save into a player file
 */

let storePlayerYear = function (playerId, year){
    return new Promise(() => {
        console.log("Player ID: " + playerId)
        console.log("Player Year: " + year)
    })
}

let playerIdsToArray = function(pageNumber){
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
                        let player = require('../audl-containers/player')
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
                                            console.log(parsedYear)
                                        })
                                    }catch (error) {}
                                }).on("error", () => {})
                            })
                        }
                    }
                })

            }catch (error){}
        }).on("error", () => {})
    })
}


for(let i = page; i < pageLimit; i++){
    playerIdsToArray(i)
}



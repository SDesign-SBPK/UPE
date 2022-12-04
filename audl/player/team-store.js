const internet = require('https')
const fileStream = require("fs")
const path = require('path')
let baseUrl = 'https://www.backend.audlstats.com/web-api/team-stats?limit=50'
let pageOfTeams
let teamDirectory = path.normalize(__dirname + '/../team-files/')
/*
Store the data being entered via https into a json format, and then save into a team file
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
            pageOfTeams = JSON.parse(body)
            //Loop through the stats array of players in order to save each of the stats in an instance of the player class, then
            //stringify the instance and store it into a .json file named after the players lastname,firstname.
            for(let index = 0; index < pageOfTeams['stats'].length; index++){
                let team = require(path.normalize('../audl-containers/team'))
                console.log(pageOfTeams['stats'][index]['teamID'])
                team.teamID = pageOfTeams['stats'][index]['teamID']
                team.teamName = pageOfTeams['stats'][index]['teamName']
                team.wins = pageOfTeams['stats'][index]['wins']
                team.losses = pageOfTeams['stats'][index]['losses']
                team.scoresFor = pageOfTeams['stats'][index]['scoresFor']
                team.scoresAgainst = pageOfTeams['stats'][index]['scoresAgainst']
                team.gamesPlayed = pageOfTeams['stats'][index]['gamesPlayed']
                team.completionPercentage = pageOfTeams['stats'][index]['completionPercentage']
                team.holdPercentage = pageOfTeams['stats'][index]['holdPercentage']
                team.breakPercentage = pageOfTeams['stats'][index]['breakPercentage']
                team.huckPercentage = pageOfTeams['stats'][index]['huckPercentage']
                team.turnovers = pageOfTeams['stats'][index]['turnovers']
                team.blocks = pageOfTeams['stats'][index]['blocks']
                team.redZonePercentage = pageOfTeams['stats'][index]['redZoneConversionPercentage']
                let teamFile = fileStream.createWriteStream(path.normalize(teamDirectory + team.teamID + '.json'))
                teamFile.writeFile(JSON.stringify(team), function () {
                    teamFile.close()
                })
            }
        })
    }catch (error){}
}


//The initial function to call. Currently unsure why, but after every request, an error (I believe is just a connection timeout) is received.
let storeTeams = function (storeDirectory){
    teamDirectory = storeDirectory
    internet.get(baseUrl, savePageJson).on("error", (error) => {})

}

module.exports = {storeTeams}
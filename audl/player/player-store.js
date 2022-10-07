const internet = require('https')
const stream = require('fs')
const baseUrl = 'https://www.backend.audlstats.com/web-api/player-stats?limit=20&page='
let currentPage = 0
let interval

const savePageJson = function (response){
    let file = stream.createWriteStream(__dirname + '/../pages/' + "page-" + currentPage + ".json")
    response.pipe(file)
    file.on("finish", () => {
        file.close()
        console.log("Completed Page: " + currentPage)
    })
}


const savePlayers = function (){
    if(currentPage < 149){
        internet.get(baseUrl + currentPage, savePageJson)
        currentPage++
    }else{
        clearInterval(interval)
    }
}


interval = setInterval(savePlayers, 5000)
const fs = require('fs')
const path = require('path')
const {connectDB} = require('../../database')

const pushPlayerGameStatFiles = function (directory){

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
            controller.createPlayerGameStat(json)
        })
    }

    fs.readdir(directory,{withFileTypes: true}, pushFile)
}



module.exports ={pushPlayerGameStatFiles}
const controller = require("../../database/controllers/Game.controller")
const fs = require("fs");

const pushGameFiles = function (directory){

    //Callback function for readdir()
    let pushFile = function (err, files){

        //In case there is an error that pops up
        if(err){
            console.log(err)
        }

        //Take each file from the array and push it to the database
        files.forEach(file => {
            //Make the path for each of the files
            let fullFilePath = directory + '/' + file.name

            //Read the data from the file using the file path into a string format
            let data = that.fs.readFileSync(fullFilePath).toString()

            //Storing the raw data from the file into a JSON format
            let json = JSON.parse(data)

            //Use the database controller to push the JSON file
            controller.createGame(json)
        })
    }

    fs.readdir(directory,{withFileTypes: true}, pushFile)
}



module.exports ={pushGameFiles}
const path = require('path')
const {pushPlayerGameStatFiles} = require('./game-player-stat-push')
const mainFunction = require('./game-player-stat-store')
const {resetDB, connectDB} = require('../../database')

mainFunction.mainFunction();


let directory = path.normalize(__dirname + '/../player-game-stats')


//pushPlayerGameStatFiles(directory)




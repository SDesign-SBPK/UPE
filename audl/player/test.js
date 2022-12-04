const path = require('path')
const {pushPlayerGameStatFiles} = require('./game-player-stat-push')
const {resetDB, connectDB} = require('../../database')


let directory = path.normalize(__dirname + '/../player-game-stats')


pushPlayerGameStatFiles(directory)




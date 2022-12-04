
const {pushPlayerGameStatFiles} = require("./game-player-stat-push");
const {connectDB, resetDB} = require("../../database");

let directory = __dirname + '/../player-game-stats'

connectDB()

resetDB().then(pushPlayerGameStatFiles(directory))




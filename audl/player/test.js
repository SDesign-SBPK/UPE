require("./game-player-stat-push")
const {GamePlayerStatPush} = require("./game-player-stat-push");

pusher = new GamePlayerStatPush(__dirname + '/../player-game-stats', '')
pusher.directory = __dirname + '/../player-game-stats'
pusher.pushAllFiles()
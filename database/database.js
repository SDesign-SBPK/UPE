const { Sequelize } = require("sequelize");
const connection = require("../connection.json");

/**
 * Sets up the database and all of the models
 */

// Connect to DB using saved credentials
const sequelize = new Sequelize({
    database: connection.database,
    username: connection.user,
    host: connection.host,
    port: connection.port,
    password: connection.pass,
    dialect: 'mysql'
});

// Define models in DB
const modelDefiners = [
    require("./models/Game.model"),
    require("./models/Team.model"),
    require("./models/Player.model"),
    require("./models/PlayerGameStats.model"),
    require("./models/TeamGameStats.model"),
    require("./models/WeatherInterval.model"),
    require("./models/Location.model")
];

for (defineModel of modelDefiners) {
    defineModel(sequelize);
}

// Add foreign key associations in
const { Team, Player, Game, Location, TeamGameStats, PlayerGameStats, WeatherInterval} = sequelize.models;

Team.hasOne(Location);
Location.belongsTo(Team);

Game.hasMany(WeatherInterval);
WeatherInterval.belongsTo(Game);

Player.hasMany(PlayerGameStats);
Game.hasMany(PlayerGameStats);
PlayerGameStats.belongsTo(Player);
PlayerGameStats.belongsTo(Game);

Team.hasMany(TeamGameStats);
Game.hasMany(TeamGameStats);
TeamGameStats.belongsTo(Team);
TeamGameStats.belongsTo(Game);


// Make connection available to the rest of the app
module.exports = sequelize;
const db = require("../database");

/**
 * Controller for all database actions related to the Game model.
 */


/**
 * Create a game data entry based on a passed in object
 * @param data The data object. Currently operates under the assumption that
 *  it has the same field names as in the model - can be changed later 
 */
const createGame = (data) => {
    db.models.Game.create({
        ...data
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to create Game: ", error);
    });
};

/**
 * Retrieve all of the games stored in the database at once
 * @returns An array of model instances for each game in the database
 */
const getAllGames = () => {
    const games = db.models.Game.findAll().then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve all Games: ", error);
    });
    return games;
};
/**
 * Retrieve a game from the database using a specific gameID
 * @param gameID The gameID to search by
 * @returns A matching Game model instance if found
 */
const getGame = (gameID) => {
    const game = db.models.Game.findOne({
        where: {
            gameID: gameID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve Game: ", error);
    });
    return game;
};

/**
 * Update a specific game in the database with new object fields
 * @param gameID gameID of specific game to update
 * @param updatedGame updated object entry for game
 */
const updateGame = (gameID, updatedGame) => {
    db.models.Game.update({
        ...updatedGame, // May cause issues later, possibly overwriting gameID
        where: {
            gameID: gameID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to update Game: ", error);
    });
};

/**
 * Delete a specific game from the database
 * @param gameID Specific id of game to be destroyed
 */
const deleteGame = (gameID) => {
    db.models.Game.destroy({
        where: {
            gameID: gameID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to delete Game: ", error);
    });
};

module.exports = {
    createGame,
    getAllGames,
    getGame,
    updateGame,
    deleteGame
};

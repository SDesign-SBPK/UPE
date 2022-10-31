const db = require("../database");

/**
 * Controller for all database actions related to the Player model
 */

/**
 * Create a player data entry based on a passed in object
 * @param data The data object being used to create a player. Currently relies
 *  on the assumption that it has the same field names as in the model
 */
const createPlayer = (data) => {
    db.models.Player.create({
        ...data
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to create Player: ", error);
    });
};

/**
 * Retrieve all of the players stored in the database at once
 * @returns An array of model instances for each player in the database
 */
const getAllPlayers = () => {
    const players = db.models.Player.findAll().then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve all Players: ", error);
    });
    return players;
};

/**
 * Retrive a player from the database using a specific playerID
 * @param playerID ID of player to be returned
 * @returns A matching Player model instance if found
 */
const getPlayer = (playerID) => {
    const player = db.models.Player.findOne({
        where: {
            playerID: playerID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrive Player: ", error);
    });
    return player;
};

/**
 * Update a specific player in the database with new object fields
 * @param playerID ID of player to be updated
 * @param updatedPlayer updated object entry for player
 */
const updatePlayer = (playerID, updatedPlayer) => {
    db.models.Player.update({
        ...updatedPlayer,
        where: {
            playerID: playerID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to update Player: ", error);
    });
};

/**
 * Delete a specific player from the database
 * @param playerID ID of player to be removed
 */
const deletePlayer = (playerID) => {
    db.models.Player.destroy({
        where: {
            playerID: playerID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to delete Player: ", error);
    });
};

module.exports = {
    createPlayer,
    getAllPlayers,
    getPlayer,
    updatePlayer,
    deletePlayer
};

const db = require("../database");

/**
 * Controller for all database actions related to the PlayerGameStats model
 */

/**
 * Create a stats entry for a player in a specific game
 * @param data The data object being used to create the entry. Assumes that the
 *  fields matchup to the model field names
 */
const createPlayerGameStat = (data) => {
    db.models.PlayerGameStats.create({
        ...data
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to create PlayerGameStat: ", error);
    });
};

/**
 * Retrieve all of the entries stored in the database at once. Note that this
 * returns everything - not everything for a specific player
 * @returns An array of model instances for each statistical entry per game per
 *  player in the database
 */
const getAllStats = () => {
    const stats = db.models.PlayerGameStats.findAll().then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to get all PlayerGameStats: ", error);
    });
    return stats;
};

/**
 * Retrieve all of the statistical entries in the database for a player
 * @param playerID The player whose stats are being searched for
 * @returns An array of model instances for the player's statistics in each of
 *  their games 
 */
const getAllStatsForPlayer = (playerID) => {
    const stats = db.models.PlayerGameStats.findAll({
        where: {
            playerID: playerID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve all PlayerGameStats for a player: ", error);
    });
    return stats;
};

/**
 * Retrieve a specific statistical entry for a player's game
 * @param playerID The player being searched for
 * @param gameID The game to get statistics for
 * @returns A matching PlayerGameStats model instance if found
 */
const getPlayerStatForGame = (playerID, gameID) => {
    const stat = db.models.PlayerGameStats.findOne({
        where: {
            playerID: playerID,
            gameID: gameID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve PlayerGameStat: ", error);
    });
    return stat;
};

/**
 * Update a specific entry in the database with new object fields
 * @param playerID The player being searched for
 * @param gameID The game to be updated
 * @param updatedStats The updated statistic object entry
 */
const updatePlayerGameStat = (playerID, gameID, updatedStats) => {
    db.models.PlayerGameStats.update(
        { ...updatedStats },
        {
            where: {
                playerID: playerID,
                gameID: gameID
            }
        }
    ).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to update PlayerGameStat: ", error);
    });
};

/**
 * Delete a specific player's game entry from the database
 * @param playerID The player whose game to delete
 * @param gameID The game to be deleted from the database
 */
const deletePlayerGameStat = (playerID, gameID) => {
    db.models.PlayerGameStats.destroy({
        where: {
            playerID: playerID,
            gameID: gameID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to destroy PlayerGameStat: ", error);
    });
};

module.exports = {
    createPlayerGameStat,
    getAllStats,
    getAllStatsForPlayer,
    getPlayerStatForGame,
    updatePlayerGameStat,
    deletePlayerGameStat
};

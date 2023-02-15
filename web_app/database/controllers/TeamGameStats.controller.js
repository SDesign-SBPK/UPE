const db = require("../database");

/**
 * Controller for all database actions related to the TeamGameStats model
 */

/**
 * Create a stats entry for a team in a specific game
 * @param data The data object being used to create the entry. Assumes that
 *  field names match up to the model field names
 */
const createTeamGameStat = (data) => {
    db.models.TeamGameStats.create({
        ...data
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to create TeamGameStat: ", error);
    });
};

/**
 * Retrieve all of the TeamGameStat entries stored in the database at once. Note
 * that this returns everything - not everything for a specific player
 * @returns An array of model instances for each statistical entry per team for
 *  each team in the database
 */
const getAllStats = () => {
    const stats = db.models.TeamGameStats.findAll().then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve all TeamGameStats: ", error);
    });
    return stats;
};

/**
 * Retrieve all of the statistical entries in the database for a team
 * @param teamID The team whose stats to find
 * @returns An array of model instances for the team's statistics for all of
 *  their games
 */
const getAllStatsForTeam = (teamID) => {
    const stats = db.models.TeamGameStats.findAll({
        where: {
            teamID: teamID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve TeamGameStats for a team: ", error);
    });
    return stats;
};

/**
 * Retrieve a specific statistical entry for a team's game
 * @param teamID The team whose stats to find
 * @param gameID The game to get statistics for
 * @returns A matching TeamGameStats model instance if found
 */
const getTeamStatForGame = (teamID, gameID) => {
    const stat = db.models.TeamGameStats.findOne({
        where: {
            teamID: teamID,
            gameID: gameID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve TeamGameStat: ", error);
    });
    return stat;
};

/**
 * Update a specific entry in the database with new object fields
 * @param teamID The team whose stats to update
 * @param gameID The game to be updated
 * @param updatedStats The updated statistic object entry
 */
const updateTeamGameStat = (teamID, gameID, updatedStats) => {
    db.models.TeamGameStats.update(
        { ...updatedStats },
        {
            where: {
                teamID: teamID,
                gameID: gameID
            }
        }
    ).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to update TeamGameStat: ", error);
    });
};

/**
 * Delete a specific team's game entry from the database
 * @param teamID The team whose game data to delete
 * @param gameID The specific game data to be deleted for the team
 */
const deleteTeamGameStat = (teamID, gameID) => {
    db.models.TeamGameStats.destroy({
        where: {
            teamID: teamID,
            gameID: gameID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to delete TeamGameStat: ", error);
    });
};

module.exports = {
    createTeamGameStat,
    getAllStats,
    getAllStatsForTeam,
    getTeamStatForGame,
    updateTeamGameStat,
    deleteTeamGameStat
};

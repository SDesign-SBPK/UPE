const db = require("../database");

/**
 * Controller for all database actions related to the Team model
 */

/**
 * Create a team data entry
 * @param data The data object to create from. Relies on the assumption that
 *  field names match the model definition (for now)
 */
const createTeam = (data) => {
    db.models.Team.create({
        ...data
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to create Team: ", error);
    });
};

/**
 * Retrieve all of the teams stored in the database at once
 * @returns An array of model instances for each team in the database
 */
const getAllTeams = () => {
    const teams = db.models.Team.findAll().then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve all Teams: ", error);
    });
    return teams;
};

/**
 * Retrieve a specific team from the database
 * @param teamID The team to search for
 * @returns A matching Team model instance if found
 */
const getTeam = (teamID) => {
    const team = db.models.Team.findOne({
        where: {
            teamID: teamID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve Team: ", error);
    });
    return team;
};

/**
 * Update a specific team in the database with new object fields
 * @param teamID The id of the team to be updated
 * @param updatedTeam The updated object entry for team
 */
const updateTeam = (teamID, updatedTeam) => {
    db.models.Team.update({
        ...updatedTeam,
        where: {
            teamID: teamID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to update Team: ", error);
    });
};

/**
 * Delete a specific team from the database
 * @param teamID The id of the team to be deleted
 */
const deleteTeam = (teamID) => {
    db.models.Team.destroy({
        where: {
            teamID: teamID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to delete Team: ", error);
    });
};

module.exports = {
    createTeam,
    getAllTeams,
    getTeam,
    updateTeam,
    deleteTeam
};

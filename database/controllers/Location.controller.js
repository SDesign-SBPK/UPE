const db = require("../database");

/**
 * Controller for all database actions related to the Location model
 */

/**
 * Insert a new location entry into the table
 * @param data The location entry data 
 */
const createLocation = (data) => {
    db.models.Location.create({
        ...data
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to create Location: ", error);
    });
};

/**
 * Retrieve all of the locations stored in the database at once
 * @returns An array of model instances for each location in the database
 */
const getAllLocations = () => {
    const locations = db.models.Location.findAll().then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve all Locations: ", error);
    });
    return locations;
};

/**
 * Retrieve a specific location from the database using the relevant teamID
 * @param teamID The id of the team that the location belongs to
 * @returns A matching Location model instance if found
 */
const getLocation = (teamID) => {
    const location = db.models.Location.findOne({
        where: {
            teamID: teamID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to retrieve Location: ", error);
    });
    return location;
};

/**
 * Updatea a specific location in the database with new object fields
 * @param teamID The id of the team that the location currently belongs to
 * @param updatedLocation Updated object entry for location
 */
const updateLocation = (teamID, updatedLocation) => {
    db.models.Location.update(
        { ...updatedLocation },
        {
            where: {
                teamID: teamID
            }
        }
    ).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to update Location: ", error);
    });
};

/**
 * Delete a specific location from the database
 * @param teamID The id of the location to delete
 */
const deleteLocation = (teamID) => {
    db.models.Location.destroy({
        where: {
            teamID: teamID
        }
    }).then(res => {
        console.log(res);
    }).catch((error) => {
        console.log("Failed to delete Location: ", error);
    });
};

module.exports = {
    createLocation,
    getAllLocations,
    getLocation,
    updateLocation,
    deleteLocation
};

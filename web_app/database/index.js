const db = require("./database");

/**
 * Set the state of the database back to the empty original state
 */
const resetDB = async () => {
    db.sync({force: true}).then(() => {
        console.log("DB schema initiated");
    }).catch((error) => {
        console.log("Error initing DB schema: ", error);
    });
};

/**
 * Test that the connection to the database is correctly working. Success will
 * be visualized in the console
 */
const connectDB = () => {
    db.authenticate().then(() => {
        console.log("Connection established");
    }).catch ((error) => {
        console.error("Error connecting to database: ", error);
    });
};

module.exports = {
    resetDB,
    connectDB
};

const db = require("./database");

const resetDB = () => {
    db.sync({force: true}).then(() => {
        console.log("DB schema initiated");
    }).catch((error) => {
        console.log("Error initing DB schema: ", error);
    });
};

module.exports = {
    resetDB
};

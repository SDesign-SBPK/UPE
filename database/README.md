# UPE Database

The database is based on MySQL and uses the Sequelize ORM to connect and create interactable objects for easy use in later operations

## Setup

Create a new file `connection.json` in this directory. This will be used for your connection to the database. Add the following contents:
```json
{
    "host": "<the host where your mysql is - likely 'localhost'>",
    "port": 3306,
    "database": "upe",
    "user": "<your mysql username>",
    "pass": "<your mysql password>"
}
```

Once the file has been created, running `node database.js` should test the connection successfully.

To setup the database schema, you can run `node index.js` to create the schema of the database using just the Node and Sequelize combination. The `database.sql` script is not used for anything at the moment and is left in the repository right now in order to have a reference of the overall schema.

## Interacting with the Database

To interact with the database, import the `database` module to the relevant file. An example:
```js
// From the database directory
const db = require("./database");

// Add, remove, read, etc.
```

The current state of the database relies purely on using the Sequelize interface to interact with the database. Wrapper modules will follow soon that abstract away some of the details and make it simpler to use. For now, the database can be interacted by using:

```js
// Create entry in <Model name>
// INSERT INTO Model VALUES ("fieldValue", ...)
db.models.model.create({
    "fieldName": "fieldValue",
    // Remaining columns in entry
}).then(res => {
    console.log(res);
}).catch((error) => {
    console.log("Failed to create entry: ", error);
});

// Retrieval
// SELECT * FROM Model
db.models.model.findAll().then(res => {
    console.log(res)
}).catch((error) => {
    console.error("Failed to retrieve data : ", error);
});

// SELECT * FROM Model WHERE columnName = columnValue
db.models.model.findOne({
    where: {
        columnName: "columnValue"
    }
}).then(res => {
    console.log(res)
}).catch((error) => {
    console.error("Failed to retrieve data : ", error);
});

// Remove a record
// DELETE FROM Model WHERE columnName = columnValue
db.models.model.destroy({
    where: {
        columnName: "columnValue"
    }
}).then(() => {
    console.log("Successfully deleted record.")
}).catch((error) => {
    console.error("Failed to delete record : ", error);
});
```
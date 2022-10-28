# UPE Database

The database is based on MySQL and uses the Sequelize ORM to connect and create interactable objects for easy use in later operations

## Setup

Make sure you have Node and NPM installed - everything runs off these, so I'd be worried if you don't have them at this point.

Make sure you have MySQL installed and setup on your system. You should be able to access your instance via some account - either the root or a user account. These will be needed to connect.

Install the Sequelize ORM and the required MySQL adapter by running `npm install` in this directory.

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

To interact with the database, import the relevant controller for the table you want to interact with:
```js
const games = require("./controllers/Game.model");

games.createGame(/* ... */);

// And so on
```

All of the models have the same base functions for now:
- `create` - adds a new entry to the database
- `getAll` - retrieves all of the entries from the database
- `get` - retrieves one entry from the database
- `update` - updates one specific entry in the database
- `delete` - removes a specific entry in the database

Future functions can be added later, depending on specific needs

In the `index.js` file of the `database` folder, there is a function available that resets the entire database if so desired
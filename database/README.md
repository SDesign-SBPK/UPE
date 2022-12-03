# UPE Database

The database is based on MySQL and uses the Sequelize ORM to connect and create interactable objects for easy use in later operations

## Setup

Make sure you have Node and NPM installed - everything runs off these, so I'd be worried if you don't have them at this point.

Make sure you have MySQL installed and setup on your system. You should be able to access your instance via some account - either the root or a user account. These will be needed to connect.

Ensure the `connection.json` file has been created. Then, running `node database.js` will test the connection successfully.

To setup the database schema, you can import `index.js` into another file and call for the `connectDB()` and `resetDB()` functions. 

The `database.sql` script is not used for anything at the moment and is left in the repository right now in order to have a reference of the overall schema.

## Interacting with the Database

### For Python Files

This section is mainly for the ML model.

Import the `ml_connector.py` file into the necessary file by adding an import statement to the top of the file:
```py
import database.ml_connector as conn

conn.getGame(gameID)

# And so on
```
The functions will return any entries that are found matching the passed in parameter

### For Node Files

To interact with the database, import the relevant controller for the table you want to interact with:
```js
const games = require("./controllers/Game.controller");

games.createGame(/* ... */);

// And so on
```

All of the models have the same base functions for now:
- `create` - adds a new entry to the database
- `getAll` - retrieves all of the entries from the database
- `get` - retrieves one entry from the database
- `update` - updates one specific entry in the database
- `delete` - removes a specific entry in the database

Both the `create` and `update` functions take in an object to be saved into the DB. These are currently just assumed to have the same field names as the model names and are not verified. This can be changed later, but some level of assumption has to be made for now.

Future functions can be added later, depending on specific needs

In the `index.js` file of the `database` folder, there is a function available that resets the entire database if so desired

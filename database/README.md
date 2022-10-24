# UPE Database

The database is based on MySQL and uses the Sequelize ORM to connect and create interactable objects

Create a new file `connection.json` in this directory. This will be used for your connection to the database. Add the following contents:
```
{
    "host": "<the host where your mysql is - likely 'localhost'>",
    "port": 3306,
    "database": "upe",
    "user": "<your mysql username>",
    "pass": "<your mysql password>"
}
```

Once the file has been created, running `node database.js` should connect successfully
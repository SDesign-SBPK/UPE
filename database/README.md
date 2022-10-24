# UPE Database

The database is based on MySQL and uses the Sequelize ORM to connect and create interactable objects for easy use in later operations

## Setup

To activate the MySQL schema using the SQL script, login to your MySQL terminal:
```bash
mysql -u <your username> -p
```
You can then run the following to activate the SQL script and view certains aspects:
```sql
source database.sql;
show tables; -- View all of the tables in the database
desc Player; -- View the schema for one of the tables
```

If all commands are completed without error, the SQL schema is ready to go and can be connected to using the Sequelize ORM for Node.js.

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

Once the file has been created and the sql script has been sourced in the mysql console, running `node database.js` should connect successfully.
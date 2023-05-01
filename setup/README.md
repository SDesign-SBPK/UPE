# Setup Script

## How to Use

The setup.sh script will download python, nodejs, npm, mySQL, and all required libraries to run the UPE.
It will also create two connection.json files which are used for the database connection.

Before running setup.sh, please add the full path to the UPE-BACKUP-FINAL-DEMO.sql file (located in the UPE/backups folder) to the pathToBackupFile variable in setup.sh.

Then simply run the following command:
```
./setup.sh
```

After the setup is complete, you can then run the entire UPE by simply running this command:
```
./run.sh
```
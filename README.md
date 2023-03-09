# UPE - Ultimate Prediction Engine

## Setup

Pre-requisites:
- MySQL
- Node.js + NPM
- Python

There are currently two key divisions of the project. Both can be setup and run independently of each other. However, to achieve the full functionality, both need to be updated.

There is one piece of setup that needs to be duplicated across both modules.

Create a new file `connection.json` in the base directory of each module. This is used to connect to the database. Add the following contents (needs to be the same in each module):
```json
{
    "host": "<the host where your mysql is - likely 'localhost'>",
    "port": 3306,
    "database": "upe-beta",
    "user": "<your mysql username>",
    "pass": "<your mysql password>"
}
```

The connection file needs to be duplicated and put into both the `prediction_api` and the `web_app/database` directories.

The database can be restored to a local copy by entering the `mysql` shell and running the following from the root level of the repository:
```
source backups/UPE-BETA-DB.sql;
```

### Predictions

The prediction package is built with Python. This is the part of the project that handles all of the machine learning logic to predict winners. An API is created around the prediction engine that exposes the functionality for use in the rest of the project.

Dependencies are managed with a virtual environment to avoid version conflicts with any other projects that may be on your system. To setup, navigate to the `prediction_api` folder and run the following:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

This will install of the packages for the prediction module and enable you to activate the API and run predictions.

Once all of the dependencies are installed and the `connection.json` file is created correctly, the module can be run after the virtual environment is activated:
```bash
source venv/bin/activate # Must be activated for packages to work!
python prediction_api.py
```

### Web Application

The web application handles all of the parts that the user mostly interacts with. This contains the front end, the supporting back end, the parsers/scrapers, and the overall database creation script.

Dependencies are managed with an NPM environment. To setup, navigate to the `web_app` folder and run the following:
```bash
npm install
```

This will install all of the packages for the web application module. Once the packages have been installed and the `connection.json` file is present, run the application by performing:
```bash
# From web_app/ folder
node backend/server.js
```

#### Front End

The front end is a separate module inside the web_app application. It has its own npm package list and needs to be run independently of the rest of the web_app.

To install, navigate to the `web_app/frontend` directory and run the following:
```bash
npm install
```

This installs all of the depencies involved in the front end development and deployment. To start the front end, run the following:
```bash
npm start
```

## Conclusion

There are three main parts that need to be running at all times for the application to be fully running:
- The back end
- The front end
- The prediction API

For other edge cases of running parts of the application (ex: database script, parsing scripts), see documentation in the relevant folder or ask the team.
# UPE

## Setup

Pre-requisites:
- MySQL
- Node.js + NPM
- Python

There are currently two different package managers in use for this project. Both can be easily setup by using the list of packages that need to be installed for the project.

The node.js packages can be installed by running `npm install` from the base directory

!TODO: Need to unify the various `package.json` files into one

The python packages can be installed by creating a new virtualenv and then installing the packages into it:
```bash
python3 -m venv venv
source venv/bin/activate # This line must run anytime that you want to interact with the python files
pip install -r requirements.txt
```

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
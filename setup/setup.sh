#!/bin/bash

host=localhost
port=3306
database=upemock
user=UPE-admin
password=UpTF@YW797@N
destination=connection.json
rootPassword=K6Q!ow6Nl7Z6
pathToBackupFile=

echo Updating
sudo apt update

echo Installing Python and required libraries
sudo apt install python3
python3 -m venv venv
source venv/bin/activate
cd prediction_api
pip install -r requirements.txt
cd ..
deactivate

echo Installing Nodejs, npm, and all required packages
sudo apt install nodejs
sudo apt install npm
cd web_app
npm install
cd scrapers/weather
npm install
cd ..
cd frontend
npm install
cd ..
cd ..

echo Creating Connection.json files and installing mySQL
sudo apt install mysql-server
sudo systemctl start mysql.service
sudo mysql
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY $rootPassword;
CREATE USER 'UPE-admin'@'localhost' IDENTIFIED BY $password;
GRANT ALL PRIVILEGES ON *.* TO 'UPE-admin'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SOURCE $pathToBackupFile;
exit
cd prediction_api
touch connection.json
json_string=$(
    jq --null-input \
    --arg host "${host}" \
    --arg port "${port}" \
    --arg database "${database}" \
    --arg user "${user}" \
    --arg password "${password}" \
    '{host: $host, port: $port, database: $database, user: $user, password: $password}'
)
echo $json_string = "${destination}"

cd ..
cd web_app/database
touch connection.json
json_string=$(
    jq --null-input \
    --arg host "${host}" \
    --arg port "${port}" \
    --arg database "${database}" \
    --arg user "${user}" \
    --arg password "${password}" \
    '{host: $host, port: $port, database: $database, user: $user, password: $password}'
)
echo $json_string = "${destination}"
cd ..
cd ..
echo All setup Complete

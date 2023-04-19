#!/bin/bash

sudo apt-get install gnome-terminal

gnome-terminal --tab --title="Backend" --command="bash -c 'cd ../web_app/backend; node server.js; exec bash'"
gnome-terminal --tab --title="Prediction_api" --command="bash -c 'cd ..; source venv/Scripts/activate; cd prediction_api; python prediction_api.py; exec bash'"
gnome-terminal --tab --title="FrontEnd" --command="bash -c 'cd ../web_app/frontend; npm start; exec bash'"
gnome-terminal --tab --title="Web Scraper" --command="bash -c 'cd ../web_app/scrapers/player; node upcoming-games-store.js; exec bash'"
sleep 5m
gnome-terminal --tab --title="Weather Scraper" --command="bash -c 'cd ../web_app/scrapers/weather; node weather-forecast-script.js exec bash'"
sleep 5m
gnome-terminal --tab --title="Prediction_automator" --command="bash -c 'cd ../web_app/data-automation; node calculate-predictions.js exec bash'"


import "./UpcomingGames.css";
import { Component } from "react";
const teamLogos = require.context("../public/logos", true);

const TESTING_GAMES = [
    {
        gameID: "2023-04-28-CAR-ATX", 
        awayTeam: "flyers", 
        homeTeam: "sol", 
        startTime: "2023-04-28 19:00:00", 
        timeZone: "EST", 
        winner: "flyers", 
        forecastedTemp: "76", 
        forecastedWindSpeed: "3", 
        forecastedPrecipitation: "0.00", 
        forecastedHumidity: "68", 
        awayTeamCity: "Carolina", 
        homeTeamCity: "Austin, TX, US"
    },
    {
        gameID: "2023-04-29-SD-SLC", 
        awayTeam: "growlers", 
        homeTeam: "shred", 
        startTime: "2023-04-29 19:00:00", 
        timeZone: "EST", 
        winner: "shred", 
        forecastedTemp: "80", 
        forecastedWindSpeed: "1", 
        forecastedPrecipitation: "0.00", 
        forecastedHumidity: "57", 
        awayTeamCity: "San Diego, CA", 
        homeTeamCity: "Salt Lake City, UT"
    }
];

/**
 * The overall container for showing game events. This takes in a set amount
 * to show, as it used to preview in the home page and as a standalone feature
 */
class UpcomingGames extends Component {

    render() {
        // Render the top upcoming games, sorting by recency

        // TODO: Insert a call to the backend here to retrieve the games
        //  instead of just the temp entries
        
        return (
            <div>
                <h2>Upcoming Games</h2>
                <div className="game-events">
                    {
                        TESTING_GAMES.map(game => {
                            let time_string_pieces = game.startTime.split(" ");
                            let time_string = [time_string_pieces[0], <br />, time_string_pieces[1]];
                            return (
                                <GameEvent 
                                    key= {game.gameID}
                                    team1 = { game.awayTeam }
                                    team2 = { game.homeTeam }
                                    time = { time_string }
                                    projectedWinner = { game.winner }
                                />
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

/**
 * Panel component that lays out a brief overview of a game. Used many times at
 * once to create a feed
 */
class GameEvent extends Component {

    render() {
        return (
            <div className="game-event">
                <p>{this.props.team1}</p>
                <img src = {teamLogos("./" + this.props.team1 + ".png")} alt = {this.props.team1 + " logo"} className = "logo-container" />
                <p>{ this.props.time }</p>
                <img src = {teamLogos("./" + this.props.team2 + ".png")} alt = {this.props.team2 + " logo"} className = "logo-container" />
                <p>{this.props.team2}</p>
            </div>
        );
    }
}

export default UpcomingGames;
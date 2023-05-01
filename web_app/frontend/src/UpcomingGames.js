import "./UpcomingGames.css";
import { Component } from "react";
const teamLogos = require.context("../public/logos", true);
const teamNames = require("./teamDictionary.json");

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * The overall container for showing game events. This takes in a set amount
 * to show, as it used to preview in the home page and as a standalone feature
 */
class UpcomingGames extends Component {

    constructor(props) {
        super(props);
        this.state = {
            upcoming_games: []
        }
    }

    renderUpcomingGames() {
        fetch("http://localhost:8080/api/Upcoming-Games")
            .then(res => res.text())
            .then(res => {
                let arr = JSON.parse(res);
                let games = arr;
                // Only get a set number of games, if directed
                if (this.props.gameLimit > 0) {
                    games = [];
                    for (let i = 0; i < this.props.gameLimit; i++) {
                        games.push(arr[i]);
                    }
                }
                this.setState({ upcoming_games: games })
            })
    }

    componentDidMount() {
        this.renderUpcomingGames();
    }

    render() {
        // Render the top upcoming games, sorting by recency
        return (
            <div>
                <h2>Upcoming Games</h2>
                <div className="game-events">
                    <div className="game-event">
                        <p className="game-event-piece">Away Team</p>
                        <p className="game-event-piece">Time</p>
                        <p className="game-event-piece">Home Team</p>
                        <p className="game-event-winner">Projected Winner</p>
                    </div>
                    {
                        this.state.upcoming_games?.map(game => {
                            let time = new Date(game.startTime);
                            let mins = time.getMinutes();
                            if (mins < 10) {
                                mins = mins.toString() + "0"
                            }
                            let time_string = [months[time.getMonth()], " ", time.getDate(), ", ", time.getFullYear(), <br key = {"timeBr1" + game}/>, time.getHours(), ":", mins];
                            return (
                                <GameEvent 
                                    key= {game.gameID}
                                    gameID = {game.gameID}
                                    team1 = { game.awayTeam }
                                    team2 = { game.homeTeam }
                                    time = { time_string }
                                    projectedWinner = { game.winner }
                                    clickHandler = {game => this.props.gameEventClickHandler(game) }
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
                <div className="game-event-piece">
                    <p className="piece-item">{teamNames[this.props.team1]}</p>
                    <img className="logo-container" src = {teamLogos("./" + this.props.team1 + ".png")} alt = {this.props.team1 + " logo"} />
                </div>
                <p className="game-event-piece">{ this.props.time }</p>
                <div className="game-event-piece">
                    <img className="logo-container" src = {teamLogos("./" + this.props.team2 + ".png")} alt = {this.props.team2 + " logo"} />
                    <p className="piece-item">{teamNames[this.props.team2]}</p>
                </div>
                <p className="clickable-link game-event-winner" onClick={() => {
                    this.props.clickHandler(this.props.gameID);
                }}>{teamNames[this.props.projectedWinner]}</p>
            </div>
        );
    }
}

export default UpcomingGames;
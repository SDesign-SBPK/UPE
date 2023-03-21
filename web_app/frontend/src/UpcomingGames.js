import "./UpcomingGames.css";
import { Component } from "react";
const teamLogos = require.context("../public/logos", true);

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
                    {
                        this.state.upcoming_games?.map(game => {
                            let time_string_pieces = game.startTime.split(" ");
                            let time_string = [time_string_pieces[0], <br />, time_string_pieces[1]];
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
                <p>{this.props.team1}</p>
                <img src = {teamLogos("./" + this.props.team1 + ".png")} alt = {this.props.team1 + " logo"} className = "logo-container" />
                <p>{ this.props.time }</p>
                <img src = {teamLogos("./" + this.props.team2 + ".png")} alt = {this.props.team2 + " logo"} className = "logo-container" />
                <p>{this.props.team2}</p>
                <p onClick={() => {
                    this.props.clickHandler(this.props.gameID);
                }}>{this.props.projectedWinner}</p>
            </div>
        );
    }
}

export default UpcomingGames;
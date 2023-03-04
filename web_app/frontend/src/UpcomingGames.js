import "./UpcomingGames.css";
import { Component } from "react";
const teamLogos = require.context("../public/logos", true);

/**
 * The overall container for showing game events. This takes in a set amount
 * to show, as it used to preview in the home page and as a standalone feature
 */
class UpcomingGames extends Component {
    render() {
        return (
            <div>
                <GameEvent team1 = "summit" team2 = "empire" />
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
                <img src = {teamLogos("./" + this.props.team1 + ".png")} alt = {this.props.team1 + " logo"} className = "logo-container" />
                <p>VS</p>
                <img src = {teamLogos("./" + this.props.team2 + ".png")} alt = {this.props.team2 + " logo"} className = "logo-container" />
            </div>
        );
    }
}

export default UpcomingGames;
import "./GameEvent.css";
import { Component } from "react";
const teamLogos = require.context("../public/logos", true);

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

export default GameEvent;
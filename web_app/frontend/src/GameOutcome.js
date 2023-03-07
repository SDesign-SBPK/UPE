import "./GameOutcome.css";
import { Component } from "react";
const teamLogos = require.context("../public/logos", true);

// Sample API response - currently used for planning out the display
const TEMP_WINNER = {
    message: "Prediction successful",
    team1: "alleycats",
    team2: "summit",
    winner: "summit",
    percentage: 75,
    wind: 15,
    precipitation: 0,
    temperature: 75,
    humidity: 60
};

/**
 * Wrapper for testing, until the frontend is successfully connected to the rest
 * of the application
 */
class GameOutcomeTemp extends Component {
    render() {
        return (
            <GameOutcome 
                team1 = {TEMP_WINNER.team1}
                team2 = {TEMP_WINNER.team2}
                winner = {TEMP_WINNER.winner}
                percentage = {TEMP_WINNER.percentage}
                wind = {TEMP_WINNER.wind}
                precipitation = {TEMP_WINNER.precipitation}
                temperature = {TEMP_WINNER.temperature}
                humidity = {TEMP_WINNER.humidity}
            />
        );
    }
}

/**
 * Show the outcome of a game. This is where we would want to have some kind of
 * breakdown of the prediction, if possible
 */
class GameOutcome extends Component {
    render() {
        let bar_components;
        // Generate the longer bar towards the winner side
        if (this.props.winner === this.props.team1) {
            bar_components = <div className="bar-split">
                <div style={{
                    width: `${this.props.percentage}%`,
                    backgroundColor: "#6CA857",
                    height: 30,
                }}>
                </div>
                <div style={{
                    width: `${100 - this.props.percentage}%`,
                    backgroundColor: "#DE1E1E",
                    height: 30,
                }}>
                </div>
            </div>;
        } else {
            bar_components = <div className="bar-split">
                <div style={{
                    width: `${100 - this.props.percentage}%`,
                    backgroundColor: "#6CA857",
                    height: 30,
                }}>
                </div>
                <div style={{
                    width: `${this.props.percentage}%`,
                    backgroundColor: "#DE1E1E",
                    height: 30,
                }}>
                </div>
            </div>;
        }
        return (
            <div>
                <h2>Matchup Winner</h2>
                <img src = {teamLogos("./" + this.props.winner + ".png")}
                    id = {this.props.winner}
                    alt = {this.props.winner + " logo"}
                />
                <div className="outcome-split">
                    <div className="outcome-split-piece">
                        <img src = {teamLogos("./" + this.props.team1 + ".png")}
                            id = {this.props.team1} 
                            alt = {this.props.team1 + " logo"}
                        />
                    </div>
                    <div className = "outcome-bars">
                        { bar_components }
                    </div>
                    <div className="outcome-split-piece">
                        <img src = {teamLogos("./" + this.props.team2 + ".png")}
                            id = {this.props.team2} 
                            alt = {this.props.team2 + " logo"}
                        />
                    </div>
                </div>
                <p>{this.props.percentage}% more likely to win</p>
                <div className="match-summary">
                    <h3>Match Summary</h3> 
                    <p>Wind: {this.props.wind} mph</p>
                    <p>Precipitation: {this.props.precipitation} inches</p>
                    <p>Temperature: {this.props.temperature} °F</p>
                    <p>Humidity: {this.props.humidity} %</p>
                </div>
            </div>
        );
    }
}

export default GameOutcomeTemp;
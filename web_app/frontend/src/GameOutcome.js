import "./GameOutcome.css";
import { Component } from "react";
const teamLogos = require.context("../public/logos", true);

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
                    <div className="summary-text">
                        <div className="summary-text-col">
                            <p>Wind</p>
                            <p>Precipitation</p>
                            <p>Temperature</p>
                            <p>Humidity</p>
                        </div>
                        <div className="summary-text-col">
                            <p>{this.props.wind}</p>
                            <p>{this.props.precipitation}</p>
                            <p>{this.props.temperature}</p>
                            <p>{this.props.humidity}</p>
                        </div>
                        <div className="summary-text-col">
                            <p>mph</p>
                            <p>inches</p>
                            <p>°F</p>
                            <p>%</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GameOutcome;
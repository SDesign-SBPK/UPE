import "./PlayerOutcome.css";
import { Component } from "react";
import { PlayerPredictionOption } from "./PredictionPlayer";
const playerInfo = require("./playerDictionary.json");

/**
 * Show the outcome of a player-based prediction input
 */
class PlayerOutcome extends Component {
    render() {
        let bar_components;
        // Generate the longer bar towards the winner side
        if (this.props.winner === "team1") {
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
                <h3>{ (this.props.winner === "team1") ? "Team 1": "Team 2"}</h3>
                <div className="outcome-bars">
                        {bar_components}
                    </div>
                <p>{this.props.percentage.toFixed(2)}% more likely to win</p>
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
                <div className="outcome-split">
                    <div className="player-choices outcome-split-piece">
                        <h3>Team 1</h3>
                        {
                            this.props.team1.map(player => (
                                <div className="selection-summary" style={{
                                    alignItems: "right",
                                    justifyItems: "right"
                                }}>
                                    <p key = {player + "name"}>{playerInfo[player]}</p>
                                    <PlayerPredictionOption
                                        key = {player + "img"}
                                        player = {player}
                                    />
                                </div>
                            ))
                        }
                    </div>
                    <div className="player-choices outcome-split-piece">
                        <h3>Team 2</h3>
                        {
                            this.props.team2.map(player => (
                                <div className="selection-summary" style={{
                                    alignItems: "left",
                                    justifyItems: "left"
                                }}>
                                    <PlayerPredictionOption
                                        key = {player + "img"}
                                        player = {player}
                                    />
                                    <p key = {player + "name"}>{playerInfo[player]}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default PlayerOutcome;
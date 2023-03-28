import { Component } from "react";
import "./PredictionPlayer.css";
const playerImages = require.context("../public/player_images", true);
const playerInfo = require("./playerDictionary.json");

/**
 * Display the input form a player-based prediction - user chooses 2 lines of players
 * for each side (28 total players, 14 a side)
 */
class PredictionPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            temperature: 0,
            humidity: 0,
            precipitation: 0,
            wind: 0,            
        };
    }

    render() {
        return (
            <div>
                <h2>Player Prediction Input</h2>
                <div className="picture-players-container">
                    {
                        playerInfo.ids.map(player => (
                            <PredictionOption
                                key={player}
                                player={player}
                            />
                        ))
                    }
                </div>
            </div>
        );
    }
}

class PredictionOption extends Component {
    render() {
        let img;
        try {
            // Try jpg
            img = <img
                src = {playerImages("./" + this.props.player + "_profile.jpg")} 
                alt = {this.props.player}
            />
        } catch {
            try {
                // Try png
                img = <img
                    src = {playerImages("./" + this.props.player + "_profile.png")} 
                    alt = {this.props.player}
                />
            } catch {
                // No picture found
                img = <img
                    src = {playerImages("./noimage_profile.jpg")} 
                    alt = {this.props.player}
                />
            }
        }

        return (
            <div className="picture-player">
                { img } 
            </div>
        );
    }
}

export default PredictionPlayer;
import { Component } from "react";
import "./PredictionInput.css";
const teamLogos = require.context("../public/logos", true);

const teams_list = [
    "alleycats",
    "aviators",
    "breeze",
    "cascades",
    "empire",
    "flyers",
    "glory",
    "growlers",
    "havoc",
    "hustle",
    "legion",
    "mechanix",
    "nitro",
    "phoenix",
    "radicals",
    "royal",
    "rush",
    "shred",
    "sol",
    "spiders",
    "summit",
    "thunderbirds",
    "union",
    "windchill"
];

/**
 * Display the input form for the prediction - user chooses two teams and then
 * includes their weather factors
 */
class PredictionInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            team1: "",
            team2: "",
            temperature: 0,
            humidity: 0,
            precipitation: 0,
            wind: 0
        };
    }

    /**
     * Input handler passed down to each individual team logo to handle input
     * to the prediction engine
     */
    handleInput(team) {
        // If no/one selection made so far, add it to the state
        if (this.state.team1 === "") {
            this.setState({
                team1: team.target.id
            });
        } else if (this.state.team2 === "") {
            this.setState({
                team2: team.target.id
            });
        } else {
            // If selection already exists - overwrite in sequential order
        }
    }

    // TODO: Fix the flex display to wrap correctly
    render() {
        let team1_selection;
        if (this.state.team1 !== "") {
            team1_selection = <img src = {teamLogos("./" + this.state.team1 + ".png")}
            id = {this.state.team1} 
            alt = {this.state.team1 + " logo"}
            />
        } else {
            team1_selection = "";
        }
        let team2_selection;
        if (this.state.team2 !== "") {
            team2_selection = <img src = {teamLogos("./" + this.state.team2 + ".png")}
            id = {this.state.team2} 
            alt = {this.state.team2 + " logo"}
            />
        } else {
            team2_selection = "";
        }
        return (
            <div>
                <h2>Predict Input</h2>
                <div className="input-selections">
                    <div className="input-selection">
                        <h3>Team 1:</h3>
                        {team1_selection}
                    </div>
                    <div className="input-selection">
                        <h3>Team 2:</h3>
                        {team2_selection}
                    </div>
                </div>
                <div className="input-options">
                    {
                        teams_list.map(team => (
                            <PredictionOption 
                                key = {team}
                                team = {team} 
                                clickHandler = {team => this.handleInput(team)} 
                                className = "input-option"
                            />
                        ))
                    }
                </div>
            </div>
        );
    }
}

/**
 * Container for a team input to the prediction screen. Shows the logo and 
 * displays the current state of selection
 */
class PredictionOption extends Component {
    render() {
        return (
            <div>
                <img src = {teamLogos("./" + this.props.team + ".png")}
                    id = {this.props.team} 
                    alt = {this.props.team + " logo"}
                    onClick = {this.props.clickHandler}    
                />
            </div>
        );
    }
}

export default PredictionInput;
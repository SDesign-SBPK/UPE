import { Component } from "react";
import "./PredictionInput.css";
const teamLogos = require.context("../public/logos", true);
const teamNames = require("./teamDictionary.json");

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
            wind: 0,
            overwriteTeam1: true,
            teamsInputted: false
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
            if (this.state.overwriteTeam1) {
                this.setState({
                    team1: team.target.id,
                    overwriteTeam1: false
                });
            } else {
                this.setState({
                    team2: team.target.id,
                    overwriteTeam1: true
                })
            }
        }
    }

    // Nice to have - possible to have color outlines of selected teams
    render() {
        let input_body;
        if (!this.state.teamsInputted) {
            // Check to see if a logo should be shown yet or not
            // TODO: Make an empty box here, so that the page isn't changing format on its own
            let team1_selection;
            if (this.state.team1 !== "") {
                team1_selection = <div>
                    <p>{ teamNames[this.state.team1] }</p>
                    <img src = {teamLogos("./" + this.state.team1 + ".png")}
                    id = {this.state.team1} 
                    alt = {this.state.team1 + " logo"}
                    />
                </div>;
            } else {
                team1_selection = "";
            }
            let team2_selection;
            if (this.state.team2 !== "") {
                team2_selection = <div>
                    <p>{ teamNames[this.state.team2] }</p>
                    <img src = {teamLogos("./" + this.state.team2 + ".png")}
                        id = {this.state.team2} 
                        alt = {this.state.team2 + " logo"}
                    />
                </div>;
            } else {
                team2_selection = "";
            }
            // Build the rest of the body with the given state
            input_body = <div>
                <button className="continue-button" onClick={() => {
                    if (this.state.team1 !== "" && this.state.team2 !== "" && this.state.team1 !== this.state.team2) {
                        this.setState({
                            teamsInputted: true  
                        })
                    }
                }}>Next</button>
                <div className="input-selections">
                    <div className="input-selection">
                        {
                            (this.state.team1 !== "") ? <TeamStatDisplay team = {this.state.team1} /> : ""
                        }
                    </div>
                    <div className="input-selection">
                        <h3>Team 1:</h3>
                        {team1_selection}
                    </div>
                    <div className="input-selection">
                        <h3>Team 2:</h3>
                        {team2_selection}
                    </div>
                    <div className="input-selection">
                        {
                            (this.state.team2 !== "") ? <TeamStatDisplay team = {this.state.team2} /> : ""
                        }
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
            </div>;
        } else {
            // If teams are inputted, render weather input
            input_body = <div>
                <button className="continue-button" onClick={() => {
                    this.setState({
                        teamsInputted: false
                    }) 
                }}>Back</button>
                <p>Wind Speed: 
                    <input type = "number" value={this.state.wind} 
                        onChange={(event) => {
                            this.setState({wind: event.target.value})
                        }} required
                        min={0}    
                        max={30}
                    /> mph</p>
                <p>Precipitation: 
                    <input type = "decimal" value={this.state.precipitation}
                        onChange={(event) => {
                            this.setState({precipitation: event.target.value})
                        }} required 
                        min={0}    
                        max={1}
                    /> inches</p>
                <p>Temperature: 
                    <input type = "number" value={this.state.temperature} 
                        onChange={(event) => {
                            this.setState({temperature: event.target.value})
                        }} required 
                        min={30}
                        max={100}
                    /> °F</p>
                <p>Humidity: 
                    <input type = "number" value={this.state.humidity} 
                        onChange={(event) => {
                            this.setState({humidity: event.target.value})
                        }} required 
                        min={1}    
                        max= {100}
                    /> %</p>
                <button className="finish-button" onClick={() => {
                    let prediction = {
                        awayTeam: this.state.team1,
                        homeTeam: this.state.team2,
                        temp: this.state.temperature,
                        humid: this.state.humidity,
                        precip: this.state.precipitation,
                        wind: this.state.wind
                    };
                    this.props.prediction_handler(prediction);
                }}>Predict!</button>
            </div>
        }

        return (
            <div>
                <h2>Predict Input</h2>
                {input_body}
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

class TeamStatDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
    }

    retrieveStats() {
        fetch("http://localhost:8080/api/Team-Stats/" + this.props.team)
        .then(res => res.json())
        .then(res => {
            this.setState({ data: res })
        })
    }

    componentDidUpdate() {
        this.retrieveStats();
    }

    componentDidMount() {
        this.retrieveStats();
    }

    render() {
        return (
            <div>
                <h3>{this.state.data.teamName}</h3>
                <PredictionOption
                    team = {this.props.team}
                    clickHandler = {() => {}}
                />
                <h4>Stats</h4>
                <div className="stat-summary">
                    <div className="stat-summary-col">
                        <p>Wins</p>
                        <p>Losses</p>
                        <p>Games Played</p>
                        <p>Completion Percentage</p>
                        <p>Hold Percentage</p>
                        <p>Break Percentage</p>
                        <p>Huck Percentage</p>
                        <p>Turnovers</p>
                        <p>Blocks</p>
                        <p>Red Zone Percentage</p>
                        <p>Scores For</p>
                        <p>Scores Against</p>
                    </div>
                    <div className="stat-summary-col">
                        <p>{this.state.data.wins}</p>
                        <p>{this.state.data.losses}</p>
                        <p>{this.state.data.gamesPlayed}</p>
                        <p>{this.state.data.completionPercentage}</p>
                        <p>{this.state.data.holdPercentage}</p>
                        <p>{this.state.data.breakPercentage}</p>
                        <p>{this.state.data.huckPercentage}</p>
                        <p>{this.state.data.turnovers}</p>
                        <p>{this.state.data.blocks}</p>
                        <p>{this.state.data.redZonePercentage}</p>
                        <p>{this.state.data.scoresFor}</p>
                        <p>{this.state.data.scoresAgainst}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default PredictionInput;
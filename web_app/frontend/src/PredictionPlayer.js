import { Component } from "react";
import "./PredictionPlayer.css";
const playerImages = require.context("../public/player_images", true);
const playerInfo = require("./playerDictionary.json");

/**
 * Display the input form a player-based prediction - user chooses 2 lines of players
 * for each side (28 total players, 14 a side)
 * 
 * Possible display states:
 * - selections -> Displays the overall selections made so far
 * - add_player -> Displays the split pane
 *      - Left side has search bar, all options
 *      - Right side has current selection, btns to add to team, and stats of player
 * - weather -> Display the weather form
 */
class PredictionPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            temperature: 0,
            humidity: 0,
            precipitation: 0,
            wind: 0,
            team1: [],
            team2: [],
            team1Input: true,
            display_state: "selections",
            player_stat: "",
        };

        this.handleInput = this.handleInput.bind(this);
    }

    /**
     * Input handler passed down to handle adding a 
     * @param player The playerID to add
     */
    handleInput(player) {
        // Check which team is currently being inputted for
        // Check to prevent duplicates in both teams
        let id = player.target.id;
        if (this.state.team1Input && !this.state.team1.includes(id) && !this.state.team2.includes(id)) {
            // Add the player to the first team being made
            this.setState({
                team1: [
                    ...this.state.team1,
                    id
                ]
            })
        } else if (!this.state.team1Input && !this.state.team1.includes(id) && !this.state.team2.includes(id)) {
            // Add player to second team
            this.setState({
                team2: [
                    ...this.state.team2,
                    id
                ]
            })
        }
    }

    /**
     * Input handler passed down to each player image to display a player's stats
     * @param player The playerID to display
     */
    displayPlayerStat(player) {
        this.setState({
            player_stat: player.target.id,
        })
    }

    render() {
        let input_body;
        if (this.state.display_state === "selections") {
            // Show off the current selections for teams
            let team1_selection;
            if (this.state.team1.length > 0) {
                team1_selection = <div>
                    {
                        this.state.team1.map(player => (
                            <p key = {player}>{ playerInfo[player] }</p>
                        ))
                    }
                </div>
            } else {
                team1_selection = <p>No players inputted for team 1</p>
            }
    
            let team2_selection;
            if (this.state.team2.length > 0) {
                team2_selection = <div>
                    {
                        this.state.team2.map(player => (
                            <p key = {player}>{ playerInfo[player] }</p>
                        ))
                    }
                </div>;
            } else {
                team2_selection = <p>No players inputted for team 2</p>
            }
            input_body = <div className="input-selections">
                <div className="input-selection">
                    <h3>Team 1</h3>
                    { team1_selection }
                    <button className="" onClick={() => {
                        this.setState({
                            display_state: "add_player",
                            team1Input: true
                        })
                    }}>Add to Team 1</button>
                </div>
                <div className="input-selection">
                    <h3>Team 2</h3>
                    { team2_selection }
                    <button className="" onClick={() => {
                        this.setState({
                            display_state: "add_player",
                            team1Input: false
                        })
                    }}>Add to Team 2</button>
                </div>
                <button className="continue-button" onClick={() => {
                    this.setState({
                        display_state: "weather"
                    })
                }}>Next</button>
            </div>
        } else if (this.state.display_state === "add_player") {
            // Adding another player to a team
            let player_stat_body;
            if (this.state.player_stat !== "") {
                player_stat_body = <PlayerStatDisplay
                    player = {this.state.player_stat}
                    clickHandler = {this.handleInput}
                />;
            } else {
                player_stat_body = <p>Click a player to view their stats</p>;
            }
            input_body = <div>
                <button onClick={() => {
                    this.setState({
                        display_state: "selections"
                    })
                }}>See Selections</button>
                <div className="add-player-container">
                    <div className="add-player-col picture-players-container">
                        {
                            playerInfo.ids.map(player => (
                                <PredictionOption
                                    key={player}
                                    player={player}
                                    clickHandler = {player=> this.displayPlayerStat(player)}
                                />
                            ))
                        }
                    </div>
                    <div className="add-player-col player-stat-display-container">
                        { player_stat_body }
                    </div>
                </div>
            </div>
        } else {
            // Looking for weather input
            input_body = <div>
                <button className="continue-button" onClick={() => {
                    this.setState({
                        display_state: "selections"
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
                        wind: this.state.wind,
                        team1Players: [
                            ...this.state.team1
                        ],
                        team2Players: [
                            ...this.state.team2
                        ]
                    };
                    this.props.prediction_handler(prediction);
                }}>Predict!</button>
            </div>;
        }

        return (
            <div>
                <h2>Player Prediction Input</h2>
                { input_body }
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
                id = {this.props.player}
                alt = {this.props.player}
                onClick = {this.props.clickHandler}
            />
        } catch {
            try {
                // Try png
                img = <img
                    src = {playerImages("./" + this.props.player + "_profile.png")} 
                    id = {this.props.player}
                    alt = {this.props.player}
                    onClick = {this.props.clickHandler}
                />
            } catch {
                // No picture found
                img = <img
                    src = {playerImages("./noimage_profile.jpg")} 
                    id = {this.props.player}
                    alt = {this.props.player}
                    onClick = {this.props.clickHandler}
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

/**
 * Display the stats of the selected player along with a possible iamge
 */
class PlayerStatDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
    }

    retrieveStats() {
        fetch("http://localhost:8080/api/Player-Stats/" + this.props.player)
        .then(res => res.json())
        .then(res => {
            this.setState({ data: res })
        })
    }

    componentDidMount() {
        this.retrieveStats()
    }

    componentDidUpdate() {
        this.retrieveStats()
    }

    render() {
        return (
            <div>
                <h3>{this.state.data.firstName + " " + this.state.data.lastName}</h3>
                <PredictionOption
                    player = {this.props.player}
                    clickHandler = {() => {}}
                />
                <h4>Stats</h4>
                <div className="stat-summary">
                    <div className="stat-summary-col">
                        <p>Completion Percentage</p>
                        <p>Completions</p>
                        <p>Goals</p>
                        <p>Assists</p>
                        <p>Plus/Minus</p>
                        <p>Games Played</p>
                        <p>Minutes Played</p>
                        <p>Points Played</p>
                        <p>Huck Percentage</p>
                        <p>Drops</p>
                        <p>Throwaways</p>
                        <p>Blocks</p>
                        <p>Yards Thrown</p>
                        <p>Yards Received</p>
                        <p>Offense Efficiency</p>
                    </div>
                    <div className="stat-summary-col">
                        <p>{this.state.data.completionPercentage}%</p>
                        <p>{this.state.data.completions}</p>
                        <p>{this.state.data.goals}</p>
                        <p>{this.state.data.assists}</p>
                        <p>{this.state.data.plusMinus}</p>
                        <p>{this.state.data.gamesPlayed}</p>
                        <p>{this.state.data.minutesPlayed}</p>
                        <p>{this.state.data.pointsPlayed}</p>
                        <p>{this.state.data.huckPercentage}%</p>
                        <p>{this.state.data.drops}</p>
                        <p>{this.state.data.throwaways}</p>
                        <p>{this.state.data.blocks}</p>
                        <p>{this.state.data.yardsThrown}</p>
                        <p>{this.state.data.yardsReceived}</p>
                        <p>{this.state.data.offenseEfficiency}</p>
                    </div>
                </div>
                <button id = {this.props.player} onClick = {this.props.clickHandler}>Add to Team</button>
            </div>
        );
    }
}

export default PredictionPlayer;
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
export class PredictionPlayer extends Component {
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
            searching: "",
            message_body: "",
            team_data1: [],
            team_data2: []
        };

        this.handleInput = this.handleInput.bind(this);
        this.handleTeamStat = this.handleTeamStat.bind(this);
    }

    /**
     * Input handler passed down to the stat display
     * @param data Packet of data entries
     */
    handleTeamStat(team, data) {
        if (team === 1) {
            this.setState({
                team_data1: data
            });
        } else {
            this.setState({
                team_data2: data
            });
        }
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
                ], 
                message_body: "Added " + playerInfo[id] + " to Team 1"
            })
        } else if (!this.state.team1Input && !this.state.team1.includes(id) && !this.state.team2.includes(id)) {
            // Add player to second team
            this.setState({
                team2: [
                    ...this.state.team2,
                    id
                ],
                message_body: "Added " + playerInfo[id] + " to Team 2"
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
        });
    }

    render() {
        let input_body;
        if (this.state.display_state === "selections") {
            // Show off the current selections for teams
            let team1_selection;
            if (this.state.team1.length > 0) {
                team1_selection = <div>
                    {
                        this.state.team1.map((player, index) => (
                            <div className = "selection-summary">
                                <PlayerPredictionOption
                                    key = {player + "img"}
                                    player = {player}
                                />
                                <p key = {player + "name"}>{ playerInfo[player] }</p>
                                <p key = {player + "remove"} className = "remove-btn" onClick={() => {
                                    this.setState({
                                        team1: this.state.team1.filter(member => member !== player),
                                        message_body: "Removed " + playerInfo[player] + " from Team 1"
                                    })
                                }}>✕</p>
                            </div>
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
                        this.state.team2.map((player, index) => (
                            <div className="selection-summary">
                                <PlayerPredictionOption
                                    key = {player + "img"}
                                    player = {player}
                                />
                                <p key = {player + "name"}>{ playerInfo[player] }</p>
                                <p key = {player + "remove"} className = "remove-btn" onClick={() => {
                                    this.setState({
                                        team2: this.state.team2.filter(member => member !== player),
                                        message_body: "Removed " + playerInfo[player] + " from Team 2"
                                    })
                                }}>✕</p>
                            </div>
                        ))
                    }
                </div>;
            } else {
                team2_selection = <p>No players inputted for team 2</p>
            }
            input_body = <div>
                <button className="continue-button" onClick={() => {
                    // Check length constraints
                    if (this.state.team1.length > 14 || this.state.team1.length < 7 || this.state.team2.length < 7 || this.state.team2.length > 14) {
                        this.setState({
                            message_body: "Teams must have 7-14 players"
                        })
                    } else if (this.state.team1.length !== this.state.team2.length) {
                        this.setState({
                            message_body: "Teams must have equal length"
                        })
                    } else {
                        this.setState({
                            display_state: "weather"
                        })
                    }
                }}>Next</button>
                <div className="input-selections">
                    <div className="input-selection">
                        {
                            (this.state.team1.length > 0) ? <TeamPlayerStats playerList = {this.state.team1} teamnum = {1} dataHandler = {this.handleTeamStat} data = {this.state.team_data1}/> : "Add players to View Stats"
                        }
                    </div>
                    <div className="player-choices">
                        <h3>Team 1</h3>
                        { team1_selection }
                        <button className="add-btn" onClick={() => {
                            this.setState({
                                display_state: "add_player",
                                team1Input: true
                            })
                        }}>Add to Team 1</button>
                    </div>
                    <div className="player-choices">
                        <h3>Team 2</h3>
                        { team2_selection }
                        <button className="add-btn" onClick={() => {
                            this.setState({
                                display_state: "add_player",
                                team1Input: false
                            })
                        }}>Add to Team 2</button>
                    </div>
                    <div className="input-selection">
                        {
                            (this.state.team2.length > 0) ? <TeamPlayerStats playerList = {this.state.team2} teamnum = {2} dataHandler = {this.handleTeamStat} data = {this.state.team_data2}/> : "Add players to View Stats"
                        }
                    </div>
                </div>
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
            let players_shown = playerInfo.ids.map(player => (
                <PlayerPredictionOption
                    key={player}
                    player={player}
                    name = {playerInfo[player]}
                    clickHandler = {player=> this.displayPlayerStat(player)}
                />
            ))
            if (this.state.searching !== "") {
                players_shown = players_shown.filter(player => 
                    player.props.name.substring(0, this.state.searching.length).toLowerCase() === this.state.searching.toLowerCase()
                )
            }
            input_body = <div>
                <button onClick={() => {
                    this.setState({
                        display_state: "selections"
                    })
                }}>See Selections</button>
                <div className="add_options">
                        <h3 className="add-option">{ (this.state.team1Input) ? "Adding to Team 1" : "Adding to Team 2"}</h3>
                        <div className="add-option">
                            <input
                                id = "player-search"
                                type = "text"
                                placeholder="Search"
                                onChange={(event) => {
                                    this.setState({
                                        searching: event.target.value
                                    })
                                }}
                                value = {this.state.searching}
                            />
                        </div>
                    <div className="add-player-container">
                        <div className="add-player-col picture-players-container">
                            { players_shown }
                        </div>
                        <div className="add-player-col player-stat-display-container">
                            { player_stat_body }
                        </div>
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
                <div className="weather-form-alt">
                    <div className="weather-form-item">
                        <label htmlFor="wind">Wind<br />
                            <input type = "number" value={this.state.wind} 
                                onChange={(event) => {
                                    this.setState({wind: event.target.value})
                                }} required
                                min={0}    
                                max={30}
                            />mph
                        </label>
                    </div>
                    <div className="weather-form-item">
                        <label htmlFor="precipitation">Precipitation<br />
                            <input type = "decimal" value={this.state.precipitation}
                                onChange={(event) => {
                                    this.setState({precipitation: event.target.value})
                                }} required 
                                min={0}    
                                max={1}
                            />in 
                        </label>
                    </div>
                    <div className="weather-form-item">
                        <label htmlFor="temperature">Temperature<br />
                            <input type = "number" value={this.state.temperature} 
                                onChange={(event) => {
                                    this.setState({temperature: event.target.value})
                                }} required 
                                min={30}
                                max={100}
                            />°F 
                        </label>
                    </div>
                    <div className="weather-form-item">
                        <label htmlFor="humidity">Humidity<br />
                            <input type = "number" value={this.state.humidity} 
                                onChange={(event) => {
                                    this.setState({humidity: event.target.value})
                                }} required 
                                min={1}    
                                max= {100}
                            />% 
                        </label>
                    </div>
                </div>
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
                <p>Rules:<br/>- Choose 7-14 players for each team<br/>- No player can be duplicated on either team<br/>- Both teams must have an equal number of players</p>
                <p>{ this.state.message_body }</p>
                { input_body }
            </div>
        );
    }
}

export class PlayerPredictionOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltipVisible: false,
            tooltipPosiition: {
                x: 0,
                y: 0
            }
        };
    }

    render() {
        let img;
        try {
            // Try jpg
            img = <img
                src = {playerImages("./" + this.props.player + "_profile.jpg")} 
                id = {this.props.player}
                alt = {this.props.player}
                onClick = {this.props.clickHandler}
                onMouseMove={(e) => {
                    this.setState({
                        tooltipVisible: true,
                        tooltipPosiition: {
                            x: e.pageX + 10,
                            y: e.pageY + 10
                        }
                    })
                }}
                onMouseOver={() => {
                    this.setState({
                        tooltipVisible: true
                    })
                }}
                onMouseOut={() => {
                    this.setState({
                        tooltipVisible: false
                    })
                }}
            />
        } catch {
            try {
                // Try png
                img = <img
                    src = {playerImages("./" + this.props.player + "_profile.png")} 
                    id = {this.props.player}
                    alt = {this.props.player}
                    onClick = {this.props.clickHandler}
                    onMouseMove={(e) => {
                        this.setState({
                            tooltipVisible: true,
                            tooltipPosiition: {
                                x: e.pageX + 10,
                                y: e.pageY + 10
                            }
                        })
                    }}
                    onMouseOver={() => {
                        this.setState({
                            tooltipVisible: true
                        })
                    }}
                    onMouseOut={() => {
                        this.setState({
                            tooltipVisible: false
                        })
                    }}
                />
            } catch {
                // No picture found
                img = <img
                    src = {playerImages("./noimage_profile.jpg")} 
                    id = {this.props.player}
                    alt = {this.props.player}
                    onClick = {this.props.clickHandler}
                    onMouseMove={(e) => {
                        this.setState({
                            tooltipVisible: true,
                            tooltipPosiition: {
                                x: e.pageX + 10,
                                y: e.pageY + 10
                            }
                        })
                    }}
                    onMouseOver={() => {
                        this.setState({
                            tooltipVisible: true
                        })
                    }}
                    onMouseOut={() => {
                        this.setState({
                            tooltipVisible: false
                        })
                    }}
                />
            }
        }
        return (
            <div className="picture-player">
                { img } 
                {
                    this.state.tooltipVisible && (
                        <div className="tooltip" style={{
                            left: this.state.tooltipPosiition.x,
                            top: this.state.tooltipPosiition.y
                        }}>{playerInfo[this.props.player]}</div>
                    )
                }
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
        };
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
            <div className="sticky">
                <h3>{this.state.data.firstName + " " + this.state.data.lastName}</h3>
                <PlayerPredictionOption
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
                        <p>{(this.state.data.completionPercentage === null || this.state.data.completionPercentage === 0) ? "---": this.state.data.completionPercentage}%</p>
                        <p>{(this.state.data.completions === null || this.state.data.completions === 0) ? "---": this.state.data.completions}</p>
                        <p>{(this.state.data.goals === null || this.state.data.goals === 0) ? "---": this.state.data.goals}</p>
                        <p>{(this.state.data.assists === null || this.state.data.assists === 0) ? "---": this.state.data.assists}</p>
                        <p>{(this.state.data.plusMinus === null || this.state.data.plusMinus === 0) ? "---": this.state.data.plusMinus}</p>
                        <p>{(this.state.data.gamesPlayed === null || this.state.data.gamesPlayed === 0) ? "---": this.state.data.gamesPlayed}</p>
                        <p>{(this.state.data.minutesPlayed === null || this.state.data.minutesPlayed === 0) ? "---": this.state.data.minutesPlayed}</p>
                        <p>{(this.state.data.pointsPlayed === null || this.state.data.pointsPlayed === 0) ? "---": this.state.data.pointsPlayed}</p>
                        <p>{(this.state.data.huckPercentage === null || this.state.data.huckPercentage === 0) ? "---": this.state.data.huckPercentage}%</p>
                        <p>{(this.state.data.drops === null || this.state.data.drops === 0) ? "---": this.state.data.drops}</p>
                        <p>{(this.state.data.throwaways === null || this.state.data.throwaways === 0) ? "---": this.state.data.throwaways}</p>
                        <p>{(this.state.data.blocks === null || this.state.data.blocks === 0) ? "---": this.state.data.blocks}</p>
                        <p>{(this.state.data.yardsThrown === null || this.state.data.yardsThrown === 0) ? "---": this.state.data.yardsThrown}</p>
                        <p>{(this.state.data.yardsReceived === null || this.state.data.yardsReceived === 0) ? "---": this.state.data.yardsReceived}</p>
                        <p>{(this.state.data.offenseEfficiency === null || this.state.data.offenseEfficiency === 0) ? "---": this.state.data.offenseEfficiency}</p>
                    </div>
                </div>
                <button className="add-btn" id = {this.props.player} onClick = {this.props.clickHandler}>Add to Team</button>
            </div>
        );
    }
}

/**
 * Displays the composite/average stats for a player-made team
 */
class TeamPlayerStats extends Component {

    /**
     * Retrieve all of the stats for the selected players in a custom team
     */
    retrieveStats() {
        this.props.playerList.forEach((player) => {
            fetch("http://localhost:8080/api/Player-Stats/" + player)
            .then(res => res.json())
            .then(res => {
                this.props.dataHandler(this.props.teamnum, [
                    ...this.props.data,
                    res
                ]);
            })
        })
    }

    componentDidMount() {
        this.retrieveStats();
    }

    render() {
        // Get the average for each stat based on the player
        let average_stats = Array(15).fill(0);
        let num_entries = Array(15).fill(0);
        this.props.data.forEach(player => {
            if (player.completionPercentage != null || player.completionPercentage !== 0) {
                average_stats[0] += player.completionPercentage;
                num_entries[0]++;
            }
            if (player.completions != null || player.completions !== 0) {
                average_stats[1] += player.completions;
                num_entries[1]++;
            }
            if (player.goals != null || player.goals !== 0) {
                average_stats[2] += player.goals;
                num_entries[2]++;
            }
            if (player.assists != null || player.assists !== 0) {
                average_stats[3] += player.assists;
                num_entries[3]++;
            }
            if (player.plusMinus != null || player.plusMinus !== 0) {
                average_stats[4] += player.plusMinus;
                num_entries[4]++;
            }
            if (player.gamesPlayed != null || player.gamesPlayed !== 0) {
                average_stats[5] += player.gamesPlayed;
                num_entries[5]++;
            }
            if (player.minutesPlayed != null || player.minutesPlayed !== 0) {
                average_stats[6] += player.minutesPlayed;
                num_entries[6]++;
            }
            if (player.pointsPlayed != null || player.pointsPlayed !== 0) {
                average_stats[7] += player.pointsPlayed;
                num_entries[7]++;
            }
            if (player.huckPercentage != null || player.huckPercentage !== 0) {
                average_stats[8] += player.huckPercentage;
                num_entries[8]++;
            }
            if (player.drops != null || player.drops !== 0) {
                average_stats[9] += player.drops;
                num_entries[9]++;
            }
            if (player.throwaways != null || player.throwaways !== 0) {
                average_stats[10] += player.throwaways;
                num_entries[10]++;
            }
            if (player.blocks != null || player.blocks !== 0) {
                average_stats[11] += player.blocks;
                num_entries[11]++;
            }
            if (player.yardsThrown != null || player.yardsThrown !== 0) {
                average_stats[12] += player.yardsThrown;
                num_entries[12]++;
            }
            if (player.yardsReceived != null || player.yardsReceived !== 0) {
                average_stats[13] += player.yardsReceived;
                num_entries[13]++;
            }
            if (player.offenseEfficiency != null || player.offenseEfficiency !== 0) {
                average_stats[14] += player.offenseEfficiency;
                num_entries[14]++;
            }
        });

        for (let i = 0; i < 15; i++) {
            average_stats[i] /= num_entries[i];   
        }
        return (
            <div>
                <h4>Average Stats for Team {this.props.teamnum}</h4>
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
                        {
                            average_stats.map((stat, index) => (
                                <p key={"stat" + index}>{stat.toFixed(2)}</p>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

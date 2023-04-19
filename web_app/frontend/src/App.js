import './App.css';  
import UpcomingGames from "./UpcomingGames";
import PredictionInput from './PredictionInput';
import GameOutcome from './GameOutcome';
import { PredictionPlayer } from './PredictionPlayer';
import { Component } from 'react';
import PlayerOutcome from './PlayerOutcome';
import WeatherForm from './WeatherForm';
const logos = require.context("../public/logos", true);

const BACKEND_HOST = "http://localhost:8080";

/**
 * Content states:
 * - home -> Displays 3 upcoming games, banner for input
 * - outcome_team -> Displays a predicted outcome of a matchup, using the returned data
 * - outcome_player -> Displays a precited outcome of a player-based matchup, using returned data
 * - input -> Displays the input page for predictions
 * - input_player -> Displays the input page for player-based predictions
 * - upcomingGames -> Shows all available upcoming games currently stored
 */

const MOCK_DATA = {
  message: "Prediction successful",
  team1: "glory",
  team2: "empire",
  winner: "glory",
  percentage: 78.23,
  teamOneStats: [
    [0.94, 0.76, 0.33, '1', '9'],
    [0.87, 0.72, 0.38, '2', '6'], 
    [0.82, 0.74, 0.21, '0', '4'], 
    [0.92, 0.64, 0.0, '1', '0'], 
    [0.91, 0.62, 0.48, '1', '4'], 
    [0.93, 0.67, 0.28, '2', '1'], 
    [0.94, 0.94, 0.42, '2', '7'], 
    [0.93, 0.91, 0.56, '2', '4'], 
    [0.92, 0.67, 0.56, '0', '2'], 
    [0.94, 0.84, 0.21, '0', '8']
  ],
  teamTwoStats: [
    [0.94, 0.76, 0.33, '1', '9'],
    [0.87, 0.72, 0.38, '2', '6'], 
    [0.82, 0.74, 0.21, '0', '4'], 
    [0.92, 0.64, 0.0, '1', '0'], 
    [0.91, 0.62, 0.48, '1', '4'], 
    [0.93, 0.67, 0.28, '2', '1'], 
    [0.94, 0.94, 0.42, '2', '7'], 
    [0.93, 0.91, 0.56, '2', '4'], 
    [0.92, 0.67, 0.56, '0', '2'], 
    [0.94, 0.84, 0.21, '0', '8']
  ],
  statsUsed: [
    "completion percentage", 
    "hold percentage", 
    "break percentage", 
    "wind", 
    "precipitation"
  ],
  wind: 12,
  precipitation: 0.01,
  temperature: 75,
  humidity: 56
};

class App extends Component {

	constructor(props) {
    super(props);
    this.state = {
      outcome_object: MOCK_DATA,
      // {
      //   "winner": "none"
      // },
      content_state: "outcome_team",
      loading_animation: false,
    }; 
  }

  /**
   * Sends a user-created player prediction over to the backend and waits for a response.
   * Upon success, captures teh result and transitions the content state to show the outcome
   * breakdown
   * @param prediction The object containing all of the fields from the prediction input
   */
  sendPredictionPlayers(prediction) {
    this.setState({loading_animation: true});
    fetch(BACKEND_HOST + "/api/Prediction-Form-Player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prediction)
    })
    .then(res => res.json())
    .then(data => {
      data.percentage *= 100;
      this.setState({
        content_state: "outcome_player",
        outcome_object: data,
        loading_animation: false
      })
    })
  }

  /**
   * Sends a user-created team prediction over to the prediction API and waits for 
   * a response. Upon success, captures the result and transitions the content
   * state to show the outcome breakdown
   * @param prediction The object containing all of the fields from the prediction input
   */
  sendPredictionTeam(prediction) {
    this.setState({loading_animation: true});
    fetch(BACKEND_HOST + "/api/Prediction-Form-Team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prediction)
    })
    .then(res => res.json())
    .then(data => { 
      data.percentage *= 100;
      this.setState({
        content_state: "outcome_team", 
        outcome_object: data,
        loading_animation: false
      })
    })
    .catch(error => console.error("Error: ", error));
  }

  /**
   * Retrieves the prediction breakdown for an upcoming game. Transitions the content
   * state to the outcome page to show the prediction breakdopwn
   * @param game The gameID to be retrieved
   */
  displayUpcomingGamePrediction(game) {
    fetch(BACKEND_HOST + "/api/Select-Upcoming-Game/" + game)
		.then(res => res.json())
		.then(data => {
      let outcome_data = {
        team1: data.awayTeam,
        team2: data.homeTeam,
        winner: data.winner,
        percentage: data.winnerPercentage * 100,
        wind: data.forecastedWindSpeed,
        precipitation: data.forecastedPrecipitation,
        temperature: data.forecastedTemp,
        humidity: data.forecastedHumidity
      };
			this.setState({
        content_state: "outcome_team", 
        outcome_object: outcome_data
      })
		})
		.catch(error => console.error("Error: ", error));
  }

  render() {
    let content_body;
    // Render based on the state of the content to be displayed
    if (this.state.content_state === "outcome_team") {
      // Render the outcome of a previous team-based prediction
      content_body= <GameOutcome 
        team1 = {this.state.outcome_object.team1}
        team2 = {this.state.outcome_object.team2}
        winner = {this.state.outcome_object.winner}
        percentage = {this.state.outcome_object.percentage}
        wind = {this.state.outcome_object.wind}
        precipitation = {this.state.outcome_object.precipitation}
        temperature = {this.state.outcome_object.temperature}
        humidity = {this.state.outcome_object.humidity}
        message = {this.state.outcome_object.message}
        teamOneStats = {this.state.outcome_object.teamOneStats}
        teamTwoStats = {this.state.outcome_object.teamTwoStats}
        statsUsed = {this.state.outcome_object.statsUsed}
      /> 
    } else if (this.state.content_state === "input") {
      // Render a team-input form
      content_body = <PredictionInput 
        prediction_handler = {prediction => this.sendPredictionTeam(prediction)} 
      />
    } else if (this.state.content_state === "upcomingGames") {
      // Render a feed of upcoming games
      content_body = <UpcomingGames 
        gameLimit = {0} 
        gameEventClickHandler = {game => this.displayUpcomingGamePrediction(game)}
      />
    } else if (this.state.content_state === "input_player") {
      // Render the input for a player prediction
      content_body = <PredictionPlayer 
        prediction_handler = {prediction => this.sendPredictionPlayers(prediction)}
      />
    } else if (this.state.content_state === "outcome_player") {
      // Render the outcome of a player prediction
      content_body = <PlayerOutcome
        team1 = {this.state.outcome_object.team1}
        team2 = {this.state.outcome_object.team2}
        winner = {this.state.outcome_object.winner}
        percentage = {this.state.outcome_object.percentage}
        wind = {this.state.outcome_object.wind}
        precipitation = {this.state.outcome_object.precipitation}
        temperature = {this.state.outcome_object.temperature}
        humidity = {this.state.outcome_object.humidity}
        message = {this.state.outcome_object.message}
      />
    } else if (this.state.content_state === "weather") {
      content_body = <WeatherForm />
    } else {
      // Render the home page
      content_body = <div>
        <UpcomingGames 
          gameLimit = {3} 
          gameEventClickHandler = {game => this.displayUpcomingGamePrediction(game)} 
        />
        <p className='nav-option' onClick={() => {
          this.setState({
            content_state: "upcomingGames"
          })
        }}>See More</p>
        <div className='prediction-banner-ad'>
          <img src={ logos("./audl.gif") } alt = "audl logo" />
          <div>
            <p>Create your own matchups! Choose from two existing teams and specified weather conditions and we'll tell you who is most likely to win!</p>
            <h4 className="clickable-link" onClick={() => {
              this.setState({
                content_state: "input"
              })
            }}>Lets Go! {">>>"}</h4>
          </div>
        </div>
      </div>;
    }
    if (this.state.loading_animation) {
      content_body = <div>
        <h3>Predicting...</h3>
        <div class="center">
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
        </div>
      </div>;
    }
    return (
      <div className="App">
        <h1>Ultimate Prediction Engine</h1>
        <div className="column-container">
          <div className="sidebar">
            <div className='nav-option' onClick={() => {
                this.setState({
                  content_state: "home"
                })
              }}>
              <p>Home</p>
            </div>
            <div className='nav-option' onClick={() => {
                this.setState({
                  content_state: "upcomingGames"
                })
              }}>
              <p>Upcoming Games</p>
            </div>
            <div className='nav-option' onClick={() => {
                this.setState({
                  content_state: "input"
                })
              }}>
              <p>Prediction Input</p>
            </div>
            <div className='nav-option' onClick={() => {
              this.setState({
                content_state: "input_player"
              })
            }}>
              <p>Player Predictions</p>
            </div>
          </div>
          <div className="main-content">
            { content_body }
          </div>
          <div className="sidebar">
  
          </div>
        </div>
      </div>
    );
  }
}

export default App;

import './App.css';  
import UpcomingGames from "./UpcomingGames";
import PredictionInput from './PredictionInput';
import GameOutcome from './GameOutcome';
import { Component } from 'react';
const logos = require.context("../public/logos", true);

const BACKEND_HOST = "http://localhost:8080";

/**
 * Content states:
 * - home -> Displays 3 upcoming games, banner for input
 * - outcome -> Displays a predicted outcome of a matchup, using the returned data
 * - input -> Displays the input page for predictions
 *    !TODO: Once player inputs added, change this state to team_input
 * - upcomingGames -> Shows all available upcoming games currently stored
 */

class App extends Component {

	constructor(props) {
    super(props);
    this.state = {
      outcome_object: {
        "winner": "none"
      },
      content_state: "home"
    }; 
  }

  /**
   * Sends a user-created team prediction over to the prediction API and waits for 
   * a response. Upon success, captures the result and transitions the content
   * state to show the outcome breakdown
   * @param prediction The object containing all of the fields from the prediction input
   */
  sendPrediction(prediction) {
    fetch(BACKEND_HOST + "/api/Prediction-Form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prediction)
    })
    .then(res => res.json())
    .then(data => {
      data.percentage = data.percentage * 100;
      this.setState({content_state: "outcome", outcome_object: data})
    })
    .catch(error => console.error("Error: ", error));
  }

  /**
   * Retrieves the prediction breakdown for an upcoming game. Transitions the content
   * state to the outcome page to show the prediction breakdopwn
   * @param game The gameID to be retrieved
   */
  displayUpcomingGamePrediction(game) {
    fetch("http://localhost:8080/api/Select-Upcoming-Game/" + game)
		.then(res => res.json())
		.then(data => {
			data.percentage = data.winnerPercentage * 100;
      let outcome_data = {
        team1: data.awayTeam,
        team2: data.homeTeam,
        winner: data.winner,
        percentage: data.winnerPercentage,
        wind: data.forecastedWindSpeed,
        precipitation: data.forecastedPrecipitation,
        temperature: data.forecastedTemp,
        humidity: data.forecastedHumidity
      };
			this.setState({content_state: "outcome", outcome_object: outcome_data})
		})
		.catch(error => console.error("Error: ", error));
  }

  render() {
    let content_body;
    if (this.state.content_state === "outcome") {
      content_body= <GameOutcome 
        team1 = {this.state.outcome_object.team1}
        team2 = {this.state.outcome_object.team2}
        winner = {this.state.outcome_object.winner}
        percentage = {this.state.outcome_object.percentage}
        wind = {this.state.outcome_object.wind}
        precipitation = {this.state.outcome_object.precipitation}
        temperature = {this.state.outcome_object.temperature}
        humidity = {this.state.outcome_object.humidity}
      /> 
    } else if (this.state.content_state === "input") {
      content_body = <PredictionInput 
        prediction_handler = {prediction => this.sendPrediction(prediction)} 
      />
    } else if (this.state.content_state === "upcomingGames") {
      content_body = <UpcomingGames 
        gameLimit = {0} 
        gameEventClickHandler = {game => this.displayUpcomingGamePrediction(game)}
      />
    } else {
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
            <h4 onClick={() => {
              this.setState({
                content_state: "input"
              })
            }}>Lets Go! {">>>"}</h4>
          </div>
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

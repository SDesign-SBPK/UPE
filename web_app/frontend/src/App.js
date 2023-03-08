import './App.css';  
import UpcomingGames from "./UpcomingGames";
import PredictionInput from './PredictionInput';
import GameOutcome from './GameOutcome';
import { Component } from 'react';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      outcome_object: {
        "winner": "none"
      },
      content_state: "input"
    }; 
  }

  sendPrediction(prediction) {
    fetch("http://localhost:8080/api/Prediction-Form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(prediction)
    })
    .then(res => res.json())
    .then(data => {
      console.log("Successful: ", data)
      this.setState({content_state: "outcome", outcome_object: data})
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
        prediction_handler = {prediction => this.sendPrediction(prediction)} />
    } else if (this.state.content_state === "upcomingGames") {
      content_body = <UpcomingGames />
    } else {
      content_body = <PredictionInput 
        prediction_handler = {prediction => this.sendPrediction(prediction)} />
    }
    return (
      <div className="App">
        <h1>Ultimate Prediction Engine</h1>
        <div className="column-container">
          <div className="sidebar">
            <p>Home</p>
            <p>Upcoming Games</p>
            <p>Prediction Input</p>
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

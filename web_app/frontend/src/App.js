import './App.css';  
import UpcomingGames from "./UpcomingGames";
import PredictionInput from './PredictionInput';
import GameOutcomeTemp from './GameOutcome';

function App() {
  return (
    <div className="App">
      <h1>Ultimate Prediction Engine</h1>
      <div className="column-container">
        <div className="sidebar">

        </div>
        <div className="main-content">
          <UpcomingGames />
          <PredictionInput />
          <GameOutcomeTemp />
        </div>
        <div className="sidebar">

        </div>
      </div>
    </div>
  );
}

export default App;

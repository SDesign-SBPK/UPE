import './App.css';  
import UpcomingGames from "./UpcomingGames";
import PredictionInput from './PredictionInput';

function App() {
  return (
    <div className="App">
      <div className="column-container">
        <div className="sidebar">

        </div>
        <div className="main-content">
          <UpcomingGames />
          <PredictionInput />
        </div>
        <div className="sidebar">
          
        </div>
      </div>
    </div>
  );
}

export default App;

import './App.css';
import AddAgent from './composants/Agents/AddAgent';
import Login from './composants/login';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';


function App() {
  return (
     <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/add-agent" element={<AddAgent />} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;

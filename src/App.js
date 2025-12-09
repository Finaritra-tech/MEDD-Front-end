import './App.css';
import AddAgent from './composants/Agents/AddAgent';
import DashboardAgent from './composants/Agents/dashboard-agent';
import DashboardChef from './composants/Direction/dashboard-chef';
import Classique from './composants/Missions/classique';
import Login from './composants/login';
import Missions from './composants/Agents/Missions';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';


function App() {
  return (
     <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/add-agent" element={<AddAgent />} />
          {/* chef */}
          <Route path="/Direction/dashboard-chef" element={<DashboardChef/>} />

          {/* Agent */}
          <Route path="/Agents/dashboard-agent" element={<DashboardAgent/>} />
          <Route path="/Missions/classique" element={<Classique />} />
          <Route path="/Agents/Mission" element={<Missions />} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;

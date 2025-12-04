import './App.css';
import AddAgent from './composants/Agents/AddAgent';
import DashboardAgent from './composants/Agents/dashboard-agent';
// import DashboardChef from './composants/Direction/dashboard-chef';
import Login from './composants/login';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';


function App() {
  return (
     <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/add-agent" element={<AddAgent />} />
          <Route path="/Direction/dashboard-chef" element={<DashboardChef/>} />
          <Route path="/Agents/dashboard-agent" element={<DashboardAgent/>} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;

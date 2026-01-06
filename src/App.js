import './App.css';
import AddAgent from './composants/Agents/AddAgent';
import DashboardAgent from './composants/Agents/dashboard-agent';
import DashboardChef from './composants/Direction/dashboard-chef';
import Classique from './composants/Missions/classique';
import Direct from './composants/Missions/Direct';
import Login from './composants/login';
import Missions from './composants/Agents/Missions';
import EditMission from './composants/Agents/EditMission';
import Missions_destinataire from './composants/Direction/mission_destinataire';
import MissionsApprouvees from './composants/Missions/MissionsApprouvées';
import MissionsRejetees from './composants/Missions/MissionsRejetees';
import MissionsEnAttente from './composants/Missions/MissionsEnAttente';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AgentsEnCours from './composants/Missions/agentEnCours';
import TotalMissions from './composants/Missions/TotalMission';


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
          <Route path="/Missions/direct" element={<Direct />} />
          <Route path="/Agents/Mission" element={<Missions />} />
          <Route path="/missions/destinataire" element={<Missions_destinataire />} />
          <Route path="/missions/:id/edit" element={<EditMission />} />
          <Route path="/missions/approuvees" element={<MissionsApprouvees />} />
          <Route path="/missions/rejetees" element={<MissionsRejetees />} />
          <Route path="/missions/en-attente" element={<MissionsEnAttente />} />
          <Route path="/agentEnCours" element={<AgentsEnCours/>} />
          <Route path="/totalMissions" element={<TotalMissions/>} />

        </Routes>
      </div>
    </Router>
  );
}



export default App;

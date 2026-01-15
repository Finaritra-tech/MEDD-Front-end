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
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AgentsEnCours from './composants/Missions/agentEnCours';
import TotalMissions from './composants/Missions/TotalMission';
import MissionsParDirection from './composants/Missions/missionsParDirection';
import MissionsFilter from './composants/Missions/MissionsFilter';
import MainLayout from './composants/MainLayout';
import UserLayout from './composants/UserLayout';
import PrivateRoute from "./privateRoute";


function App() {
  return (
    <Router>
      <Routes>
   
        {/* Login sans header/sidebar */}
        <Route path="/" element={<Login />} />


     <Route element={<PrivateRoute />}>
        {/* Pages avec header + sidebar */}
        <Route path="/add-agent" element={
          <MainLayout>
            <AddAgent />
          </MainLayout>
        } />

        <Route path="/Direction/dashboard-chef" element={
          <MainLayout>
            <DashboardChef />
          </MainLayout>
        } />


        <Route path="/Missions/direct" element={
          <MainLayout>
            <Direct />
          </MainLayout>
        } />


        <Route path="/missions/destinataire" element={
          <MainLayout>
            <Missions_destinataire />
          </MainLayout>
        } />

        <Route path="/agentEnCours" element={
          <MainLayout>
            <AgentsEnCours />
          </MainLayout>
        } />

        <Route path="/totalMissions" element={
          <MainLayout>
            <TotalMissions />
          </MainLayout>
        } />

        <Route path="/missions/par-direction" element={
          <MainLayout>
            <MissionsParDirection />
          </MainLayout>
        } />

        <Route path="/tri" element={
          <MainLayout>
            < MissionsFilter/>
          </MainLayout>
        } />

        <Route path="/Agents/dashboard-agent" element={
          <UserLayout>
        <DashboardAgent />
        </UserLayout>
        } />

        <Route path="/Missions/classique" element={
          <UserLayout>
            <Classique />
            </UserLayout>
        } />
         <Route path="/missions/:id/edit" element={
          <UserLayout>
            <EditMission />    
          </UserLayout>     
        } />
        <Route path="/Agents/Mission" element={
          <UserLayout>
            <Missions />
            </UserLayout>
        } />
        </Route>
      </Routes>
    </Router>
  );
}



export default App;

import MissionsParDirection from "../Missions/missionsParDirection";
import TotalMissions from "../Missions/TotalMission";
import AgentsEnCours from "../Missions/agentEnCours";
import { useState } from "react";


function DashboardChef({ searchTerm }) {

  return (
    
    <div className="min-h-screen bg-[#EAEAEA] p-6">
      <h2 className="text-2xl font-bold mb-6 text-black-500">
        Tableau de bord
      </h2>

<div className="grid grid-cols-1 lg:grid-cols-[65%,35%] gap-6">

  {/* Colonne gauche : scroll normale */}
  <div
    className="
      bg-[#EAEAEA]
      rounded-2xl
      p-6
      shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff]
    "
  >
    <AgentsEnCours searchTerm={searchTerm} />
  </div>

  {/* Colonne droite : sticky */}
  <div
    className="
      flex flex-col gap-6
      sticky top-40
      self-start
    "
  >
    <div
      className="
     flex items-center justify-center
 
      "
    >
      <TotalMissions />
    </div>

    <div
      className="
        bg-[#EAEAEA]
        rounded-2xl
        p-6
        shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff]
      "
    >
      <MissionsParDirection />
    </div>
  </div>
</div>

    </div>
  );
}

export default DashboardChef;

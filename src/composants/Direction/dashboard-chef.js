import UserInfo from "../UserInfo";
import MissionsParDirection from "../Missions/missionsParDirection";
import TotalMissions from "../Missions/TotalMission";
import AgentsEnCours from "../Missions/agentEnCours";

function DashboardChef() {
  return (
    <div className="min-h-screen bg-[#EAEAEA] p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <UserInfo />
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <a
            href="/Agents/Mission"
            className="px-4 py-2 bg-[#1D91A5] text-white rounded-lg shadow hover:shadow-lg transition"
          >
            Liste des missions
          </a>
          <a
            href="/Missions/direct"
            className="px-4 py-2 bg-[#1E9A30] text-white rounded-lg shadow hover:shadow-lg transition"
          >
            Assigner une mission
          </a>
          <a
            href="/missions/destinataire/"
            className="px-4 py-2 bg-[#dc2626] text-white rounded-lg shadow hover:shadow-lg transition"
          >
            Voir les demandes
          </a>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Tableau de bord Chef
      </h2>

      {/* Grid principale */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Missions par direction */}
        <div className="bg-[#EAEAEA] rounded-2xl p-6 shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff] hover:shadow-[8px_8px_15px_#c5c5c5,-8px_-8px_15px_#ffffff] transition">
          <MissionsParDirection />
        </div>

        {/* Total Missions */}
        <div className="bg-[#EAEAEA] rounded-2xl p-6 shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff] hover:shadow-[8px_8px_15px_#c5c5c5,-8px_-8px_15px_#ffffff] transition">
          <TotalMissions />
        </div>

        {/* Agents en cours */}
        <div className="bg-[#EAEAEA] rounded-2xl p-6 shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff] hover:shadow-[8px_8px_15px_#c5c5c5,-8px_-8px_15px_#ffffff] transition">
          <AgentsEnCours />
        </div>
      </div>
    </div>
  );
}

export default DashboardChef;

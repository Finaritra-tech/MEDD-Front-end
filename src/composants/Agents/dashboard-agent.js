import Missions from "./Missions";
import UmissionsFilter from "../Missions/UmissionFilter";
import UserInfo from "../UserInfo";
import MissionEnCours from "./MissionEnCours";
import { useState, useEffect } from "react";



function DashboardAgent() {
  
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <p>Chargement utilisateur...</p>;

  return (
   <div className="grid grid-cols-2 gap-6 p-4">
    {/* ===== COLONNE GAUCHE ===== */}
    <div className="flex flex-col gap-6">
      <div>
      <UserInfo />
      </div>
      <MissionEnCours searchTerm={user.nom} />
    </div>

    {/* ===== COLONNE DROITE ===== */}
    <div className="flex flex-col gap-6">
      <UmissionsFilter />
    </div>
  </div>
  );
}

export default DashboardAgent;

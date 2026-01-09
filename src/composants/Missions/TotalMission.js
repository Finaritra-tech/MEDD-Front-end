// TotalMissionsEnCours.js
import React, { useEffect, useState } from "react";
import api from "../axiosConfig";


function TotalMissions() {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/missions-en-cours/total/")
      .then(res => {
        setTotal(res.data.total_missions_en_cours);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Erreur lors du chargement");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

 return (
  <div
    className="
      w-44 h-44
      rounded-full
      bg-[#DCE7EA]
      flex flex-col items-center justify-center
      text-center
      shadow-[8px_8px_16px_#b8c4c8,-8px_-8px_16px_#ffffff]
    "
  >
    {/* Cercle intérieur */}
    <div
      className="
        w-32 h-32
        rounded-full
        flex flex-col items-center justify-center
        bg-[#DCE7EA]
        shadow-[inset_5px_5px_10px_#b8c4c8,inset_-5px_-5px_10px_#ffffff]
      "
    >
      <h3 className="text-xs font-semibold text-gray-700 mb-1">
        Missions en cours
      </h3>
      <span className="text-3xl font-bold text-gray-800">
        {total}
      </span>
    </div>
  </div>
);


}

export default TotalMissions;

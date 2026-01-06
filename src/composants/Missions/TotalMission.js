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
    <div className="p-4 bg-green-100 rounded shadow-md w-60 text-center">
      <h3 className="text-lg font-semibold mb-2">Missions en cours</h3>
      <span className="text-3xl font-bold">{total}</span>
    </div>
  );
}

export default TotalMissions;

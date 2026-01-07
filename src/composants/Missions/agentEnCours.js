// AgentsEnCours.js
import React, { useEffect, useState } from 'react';
import api from "../axiosConfig";

function AgentsEnCours() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/agents-en-cours/')
      .then(res => {
        setAgents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-500">Chargement...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Agents avec missions en cours
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map(agent => (
          <div
            key={agent.id}
            className="bg-[#EAEAEA] rounded-2xl p-4 shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff] 
                       hover:shadow-[8px_8px_15px_#c5c5c5,-8px_-8px_15px_#ffffff] transition"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {agent.nom} - <span className="text-sm font-medium text-gray-600">{agent.fonction}</span>
            </h3>
            <p className="text-sm text-gray-600 mb-2">{agent.email}</p>

            <ul className="list-disc list-inside space-y-1">
              {agent.missions_en_cours.map(mission => (
                <li key={mission.id} className="text-gray-700 dark:text-gray-200">
                  <span className="italic">{mission.objet}</span> ({mission.date_depart} → {mission.date_retour})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentsEnCours;

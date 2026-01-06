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

  if (loading) return <p>Chargement...</p>;
//   if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Agents avec missions en cours</h2>
      <ul>
        {agents.map(agent => (
          <li key={agent.id}>
            <strong>{agent.nom}</strong> - {agent.fonction} - {agent.email}
            <ul>
              {agent.missions_en_cours.map(mission => (
                <li key={mission.id}>
                  <em>{mission.objet}</em> ({mission.date_depart} → {mission.date_retour})
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AgentsEnCours;

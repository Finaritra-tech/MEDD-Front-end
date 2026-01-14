import React, { useEffect, useState } from 'react';
import api from "../axiosConfig";
import { PieChart, Pie, Cell } from 'recharts';
import Pagination from '../../UI/pagination';


const COLORS = ["#4ade80", "#e5e7eb"];


function MissionEnCours({ searchTerm = ''}) {
  
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  

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

  const getMissionProgress = (mission) => {
    const start = new Date(mission.date_depart);
    const end = new Date(mission.date_retour);
    const today = new Date();

    if (today <= start) return 0;
    if (today >= end) return 100;

    const total = end - start;
    const elapsed = today - start;
    return Math.round((elapsed / total) * 100);
  }
  const filteredAgents = agents.filter(agent =>
    agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.fonction.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.missions_en_cours.some(mission =>
      mission.objet.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage;
  const paginatedAgents = filteredAgents.slice(start, start + itemsPerPage);

  return (
    <div>
    <div>
      <div className="flex flex-col gap-4">
        {paginatedAgents.map(agent => (
          <div
  key={agent.id}
  className="
    bg-[#EAEAEA]
    rounded-2xl
    p-4
    shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff]
    hover:shadow-[8px_8px_15px_#c5c5c5,-8px_-8px_15px_#ffffff]
    transition
    flex
    gap-4
    items-start
  "
>
  {/* Photo de l'agent */}
  <div className="flex-shrink-0">
    <img
      src={agent.photo ? `http://127.0.0.1:8000${agent.photo}` : "/default.png"}
      className="w-16 h-16 rounded-full object-cover shadow-md"
    />
  </div>

  {/* Contenu */}
  <div className="flex-1 flex flex-col gap-2">
    <h3 className="text-lg font-semibold text-gray-800">
      {agent.nom}{" "}
      <span className="text-sm font-medium text-gray-600">
        – {agent.fonction}
      </span>
    </h3>

    <p className="text-sm text-gray-600">{agent.email}</p>

    <ul className="flex flex-col gap-2">
      {agent.missions_en_cours.map(mission => {
        const progress = getMissionProgress(mission);
        const data = [
          { name: 'Progress', value: progress },
          { name: 'Remaining', value: 100 - progress },
        ];
        return (
         
          <li
            key={mission.id}
            className="flex items-center gap-3 bg-[#F0F0F0] rounded-lg p-2 shadow-inner"
          >
            <div className="flex-1">
              <span className="italic text-gray-700">{mission.objet}</span>{" "}
              ({mission.date_depart} → {mission.date_retour})
            </div>

            {/* Donut chart */}
            <div className="flex flex-col items-center justify-center">
              <PieChart width={50} height={50}>
                <Pie
                  data={data}
                  innerRadius={15}
                  outerRadius={20}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
              <span className="text-xs text-gray-500">{progress}%</span>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
</div>

        ))}
      </div>
    </div>
    <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      </div>
  );
}

export default MissionEnCours;

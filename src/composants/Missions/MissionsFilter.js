import { useState, useEffect } from "react";
import MissionsParStatus from "./MissionParStatus";
import api from "../axiosConfig";


const STATUS = [
  { label: "Approuvées", value: "approuvée", color: "bg-emerald-500" },
  { label: "En attente", value: "en attente", color: "bg-amber-500" },
  { label: "Rejetées", value: "rejetée", color: "bg-rose-500" },
];

const normalize = (str) =>
  str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export default function MissionsFilter() {
  const [missions, setMissions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("approuvée");

  // 🔹 Récupération des missions depuis l'API
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await api.get("missions/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        setMissions(res.data);
      } catch (err) {
        console.error("Erreur récupération missions :", err);
      }
    };
    fetchMissions();
  }, []);


  const counts = STATUS.reduce((acc, s) => {
    acc[s.value] = missions.filter(
      (m) => normalize(m.status) === normalize(s.value)
    ).length;
    return acc;
  }, {});



  return (
    <div className="max-w-5xl mx-auto p-4">

      {/* ===== BOUTONS DE FILTRE ===== */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center relative">
        {STATUS.map((s) => (
          <button
            key={s.value}
            onClick={() => setSelectedStatus(s.value)}
            className={`
              relative
              px-5 py-2 rounded-xl font-medium transition
              ${
                selectedStatus === s.value
                  ? "bg-[#EAEAEA] text-gray-800 shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]"
                  : "bg-[#EAEAEA] text-gray-600 shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff] hover:shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff]"
              }
            `}
          >
            {s.label}
            {/* Badge compteur */}
            <span
              className={`
                absolute -top-2 -right-2
                ${s.color} text-white text-xs font-bold
                px-2 py-0.5 rounded-full
              `}
            >
              {counts[s.value] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* ===== LISTE DES MISSIONS FILTRÉE ===== */}
      <MissionsParStatus
        status={selectedStatus}
        title={`Missions ${STATUS.find(s => s.value === selectedStatus)?.label}`}
      />
    </div>
  );
}

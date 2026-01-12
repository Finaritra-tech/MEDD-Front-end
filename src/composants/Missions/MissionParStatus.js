import { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import Pagination from "../../UI/pagination";

function MissionsParStatus({ status, title }) {
  const [missions, setMissions] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const fetchMissions = async () => {
    if (!user) return;

    try {
      const res = await api.get("missions/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      
   const normalize = (str) =>
  str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const filtered = res.data.filter(
  (m) => normalize(m.status) === normalize(status)
);



setMissions(filtered);
    } catch (error) {
      console.error("Erreur récupération missions :", error);
    }
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(missions.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const filtere = missions.slice(start, start + itemsPerPage);

  useEffect(() => {
    fetchMissions();
  }, [user, status]);

  const generateePdf = async (mission) => {
  try {
    const response = await api.post(
      "om-pdf/",
      {
        id: mission.id,
        objet: mission.objet,
        lieu: mission.lieu,
        date_depart: mission.date_depart,
        date_retour: mission.date_retour,
        description: mission.description,
        agent: mission.agent,
        cree_par: mission.cree_par,
        destinatairee: mission.destinatairee,
      },
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );

    // Télécharger le PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ordre_mission.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();


  } catch (error) {
    console.error("Erreur génération PDF :", error);
  }
};


  return (
    <div>
   <div className="max-w-4xl mx-auto p-4">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>

  {!filtere.length && (
    <p className="text-gray-500 text-center">Aucune mission trouvée.</p>
  )}

  <ul className="flex flex-col gap-4">
    {filtere.map((m) => (
      <li
        key={m.id}
        className="bg-[#EAEAEA] rounded-2xl p-4 shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff] hover:shadow-[8px_8px_15px_#c5c5c5,-8px_-8px_15px_#ffffff] transition"
      >
        <div className="flex justify-between items-start flex-wrap gap-2">
          {/* Infos mission */}
          <div className="flex-1">
            <p className="text-gray-800 font-semibold mb-1">
              {m.objet}
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Lieu :</strong> {m.lieu} <br />
              <strong>Date :</strong> {m.date_depart} → {m.date_retour} <br />
              <strong>Créée par :</strong> {m.cree_par_nom || "Inconnu"}
            </p>
          </div>

          {/* Statut */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              m.status?.toLowerCase() === "approuvée"
                ? "bg-emerald-500 text-white"
                : m.status?.toLowerCase() === "en attente"
                ? "bg-amber-500 text-white"
                : "bg-rose-500 text-white"
            }`}
          >
            {m.status}
          </span>
        </div>

        {/* Progression et bouton PDF si approuvée */}
        {m.status?.toLowerCase() === "approuvée" && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => generateePdf(m)}
              className="px-4 py-2 rounded-xl bg-emerald-500 shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff] hover:shadow-[8px_8px_12px_#c5c5c5,-8px_-8px_12px_#ffffff] transition font-medium text-white"
            >
              Voir l'ordre de mission
            </button>

            <p className="text-sm font-semibold">
              <strong>Progression :</strong>{" "}
              <span
                className={`font-bold ${
                  m.progression === "Terminée" ? "text-green-600" : "text-orange-500"
                }`}
              >
                {m.progression}
              </span>
            </p>
          </div>
        )}
      </li>
    ))}
  </ul>
   </div>

     <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
      />
      </div>
  );
}

export default MissionsParStatus;

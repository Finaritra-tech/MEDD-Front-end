import { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import Pagination from "../../UI/pagination";
import Button from "../../UI/button";


function UmissionsParStatus({ status, title }) {
  const [missions, setMissions] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [rejectingId, setRejectingId] = useState(null);
  const [motifRejet, setMotifRejet] = useState("");

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
  const itemsPerPage = 3;
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

const fetchMissionsDestinataire = async () => {
    if (!user) return;

    try {
      const res = await api.get("missions/?type=destinataire/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      setMissions(res.data);
    } catch (error) {
      console.error("Erreur récupération missions :", error);
    }
  };
const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette mission ?")) {
      try {
        await api.delete(`missions/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        fetchMissionsDestinataire(); // rafraîchir la liste après suppression
      } catch (error) {
        console.error("Erreur suppression :", error);
      }
    }
  };

  const generateMissionPdf = async (missionId) => {
  try {
    const response = await api.get(`missions/${missionId}/pdf/`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `mission_${missionId}.pdf`);
    document.body.appendChild(link);
    link.click();
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
  {filtere.map((m) => {
    const isPending = m.status?.toLowerCase() === "en attente";

    return (
      <li
        key={m.id}
        className="bg-[#EAEAEA] rounded-2xl p-4
                   shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff]
                   transition"
      >
        {/* ===== INFOS ===== */}
        <div className="flex justify-between items-start gap-3">
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {m.objet}
            </p>

            <p className="text-sm text-gray-600">
              <strong>Lieu :</strong> {m.lieu}<br />
              <strong>Date :</strong> {m.date_depart} → {m.date_retour}<br />
              <strong>Créée par :</strong> {m.cree_par_nom || "Inconnu"}
            </p>
          </div>

          {/* ===== BADGE STATUS ===== */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold
              ${
                isPending
                  ? "bg-amber-500 text-white"
                  : m.status?.toLowerCase() === "approuvée"
                  ? "bg-emerald-500 text-white"
                  : "bg-rose-500 text-white"
              }
            `}
          >
            {m.status}
          </span>
           <button onClick={() => generateMissionPdf(m.id)}>Voir détails (PDF)</button>   
        </div>

        {/* ===== ACTIONS POUR EN ATTENTE ===== */}
        {isPending && (
          <div className="mt-4 flex flex-col gap-3">

            {/* Boutons principaux */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleDelete(m.id)}
                className="px-4 py-2 rounded-xl text-sm font-medium
                           bg-rose-500 text-white
                           shadow hover:opacity-90 transition"
              >
                Supprimer
              </button>   
              <button onClick={() => navigate(`/missions/${m.id}/edit`)}  className="px-4 py-2 rounded-xl text-sm font-medium
                           bg-green-500 text-white
                           shadow hover:opacity-90 transition">Modifier</button> 
       
            </div>
          </div>
        )}
      </li>
    );
  })}
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

export default UmissionsParStatus;

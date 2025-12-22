import { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";

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

      // 🔹 Filtrage par status
      const filtered = res.data.filter(
        (m) => m.status?.toLowerCase() === status.toLowerCase()
      );

      setMissions(filtered);
    } catch (error) {
      console.error("Erreur récupération missions :", error);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [user]);

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
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2>{title}</h2>

      {!missions.length && <p>Aucune mission trouvée.</p>}

      <ul>
        {missions.map((m) => (
          <li
            key={m.id}
            style={{
              marginBottom: "15px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          >
            <p>
              <strong>Objet :</strong> {m.objet} <br />
              <strong>Lieu :</strong> {m.lieu} <br />
              <strong>Date :</strong> {m.date_depart} → {m.date_retour} <br />
              <strong>Status :</strong> {m.status} <br />
              <strong>Créée par :</strong> {m.cree_par_nom || "Inconnu"} <br />
            </p>

            {m.status?.toLowerCase() === "approuvée" && (
            <div>
             <button onClick={() => generateePdf(m)} >Voir l'ordre de mission</button>
             
             <p>
              <strong>Progression :</strong>{" "}
              <span style={{color: m.progression === "Terminée" ? "green" : "orange",fontWeight: "bold",}}>
              {m.progression}
              </span>
            </p>
            </div>
          )}

          </li>
        ))}
      </ul>
    </div>
  );
}

export default MissionsParStatus;

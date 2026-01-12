import { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";

function Missions_destinataire() {
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

  useEffect(() => {
    fetchMissionsDestinataire();
  }, [user]);


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

  const updateStatus = async (missionId, action, motif = "") => {
  try {
    await api.post(
      `missions/${missionId}/${action}/`,
      action === "rejeter" ? { motif_rejet: motif } : {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );

    fetchMissionsDestinataire();
  } catch (error) {
    console.error("Erreur mise à jour statut :", error);
  }
};
  const rejectMission = async (missionId) => {
    try {
      await api.post(
        `missions/${missionId}/rejeter/`,
        { motif_rejet: motifRejet },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      setRejectingId(null);
      setMotifRejet("");
      fetchMissionsDestinataire();
    } catch (error) {
      console.error("Erreur rejet mission :", error);
    }
  };


  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2>Mes Missions</h2>
      {!missions.length && <p>Aucune mission trouvée.</p>}
      <ul>
        {missions.map((m) => (
          <li key={m.id} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}>
            <p> 
              <strong>Objet :</strong> {m.objet} <br />
              <strong>Lieu :</strong> {m.lieu} <br />
              <strong>Date :</strong> {m.date_depart} → {m.date_retour} <br />
              <strong>Status :</strong> {m.status} <br />
              <strong>Créée par :</strong> {m.cree_par_nom|| "Inconnu"} <br/>
              <strong>Destinataire :</strong> 
                { m.destinataire && m.destinataire !== "" 
                    ? m.destinataire 
                    : (m.destinatairee && m.destinatairee !== "" 
                      ? m.destinatairee 
                        : "Non défini"
                    )
         }
            </p>            
            <button onClick={() => handleDelete(m.id)} style={{ marginRight: "10px" }}>Supprimer</button>
            <button onClick={() => updateStatus(m.id, "approuver")} disabled={m.status !== "En attente"}>Approuver</button>
            <button onClick={() => setRejectingId(m.id)} disabled={m.status !== "En attente"}>Rejeter</button>
            {rejectingId === m.id && (
   <div>
    <textarea
      placeholder="Motif du rejet (optionnel)"
      value={motifRejet}
      onChange={(e) => setMotifRejet(e.target.value)}
      rows={3}
      style={{ width: "100%", marginBottom: "5px" }}
    />

    <button
      onClick={() => rejectMission(m.id)}
      style={{ marginRight: "10px" }}
    >
      Confirmer le rejet
    </button>

    <button
      onClick={() => {
        setRejectingId(null);
        setMotifRejet("");
      }}
    >
      Annuler
    </button>
  </div>
)}


            <strong>Status :</strong>{" "}
            <span style={{
                color:
                  m.status === "Approuvée"
                    ? "green"
                    : m.status === "Rejetée"
                    ? "red"
                    : "orange",
              }}
            >
              {m.status}
            </span>
                                  

            <button onClick={() => generateMissionPdf(m.id)}>Voir détails (PDF)</button>    
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Missions_destinataire;

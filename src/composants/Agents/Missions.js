import { useEffect, useState } from "react";
import api from "../axiosConfig";

function Missions() {
  const [missions, setMissions] = useState([]);
  const [user, setUser] = useState(null);

  // Récupération de l'utilisateur connecté depuis le localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Récupération des missions liées à l'utilisateur
  const fetchMissions = async () => {
    if (!user) return;

    try {
      const res = await api.get("missions/", {
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
    fetchMissions();
  }, [user]);

  // Supprimer une mission
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette mission ?")) {
      try {
        await api.delete(`missions/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        fetchMissions(); // rafraîchir la liste après suppression
      } catch (error) {
        console.error("Erreur suppression :", error);
      }
    }
  };

  // Affichage
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
              <strong>Créée par :</strong> {user.nom || "Inconnu"}

            </p>
            <button onClick={() => handleDelete(m.id)} style={{ marginRight: "10px" }}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Missions;

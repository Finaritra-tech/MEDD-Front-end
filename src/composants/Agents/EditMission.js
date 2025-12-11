import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // ton axios configuré

function EditMission() {
  const { id } = useParams(); // Récupère l'id de la mission depuis l'URL
  const navigate = useNavigate();

  const [mission, setMission] = useState(null);
  const [responsables, setResponsables] = useState([]);
  const [selectedResponsable, setSelectedResponsable] = useState("");

  useEffect(() => {
    // 1️⃣ Charger la mission à modifier
    api.get(`/missions/${id}/`)
      .then(res => {
        setMission(res.data);
        setSelectedResponsable(res.data.destinataire ? res.data.destinataire.id : "");
      })
      .catch(err => console.error(err));

    // 2️⃣ Charger la liste des agents is_staff = true
    api.get("/agents/")
        .then(res => {
             const responsables = res.data.filter(r => r.is_staff);
             setResponsables(responsables);
      })
    .catch(err => console.error(err));
  }, [id]);

  // 3️⃣ Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    api.put(`/missions/${id}/`, {
      ...mission,
      destinataire: selectedResponsable || null
    })
    .then(() => navigate("/missions")) // Retour à la liste
    .catch(err => console.error(err));
  };

  if (!mission) return <p>Chargement de la mission...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Modifier la mission</h2>

      <form onSubmit={handleSubmit}>
        <label>Choisir un destinataire :</label>
        <select
          value={selectedResponsable}
          onChange={(e) => setSelectedResponsable(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
        >
          <option value="">— Aucun pour l'instant —</option>
          {responsables.map(r => (
            <option key={r.id} value={r.id}>
              {r.nom} — {r.fonction}
            </option>
          ))}
        </select>

        <button type="submit" style={{ padding: "8px 12px" }}>Enregistrer</button>
      </form>
    </div>
  );
}

export default EditMission;

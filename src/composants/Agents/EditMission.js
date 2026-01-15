import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // ton axios configuré
import { FaSave } from "react-icons/fa";

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
 <div className="max-w-md mx-auto p-6 rounded-[30px_10px_30px_10px] 
                bg-[#EAEAEA] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]">
  <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center flex items-center justify-center gap-2">
    <FaSave className="text-gray-700" /> Modifier la mission
  </h2>

  <form onSubmit={handleSubmit} className="space-y-4">
    {/* Destinataire */}
    <div className="flex flex-col">
      <label className="text-gray-600 mb-2">Choisir un destinataire :</label>
      <select
        value={selectedResponsable}
        onChange={(e) => setSelectedResponsable(e.target.value)}
        className="p-3 rounded-xl bg-[#EAEAEA] 
                   shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]
                   focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
      >
        <option value="">Aucun pour l'instant</option>
        {responsables.map((r) => (
          <option key={r.id} value={r.id}>
            {r.nom} — {r.fonction}
          </option>
        ))}
      </select>
    </div>

    {/* Bouton */}
    <button
      type="submit"
      className="flex items-center justify-center gap-2 w-full 
                 bg-blue-400 text-gray-700 
                 shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] 
                 hover:shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] 
                 transition-all px-4 py-2 rounded-xl font-medium"
    >
      <FaSave /> Enregistrer
    </button>
  </form>
</div>
  );
}

export default EditMission;

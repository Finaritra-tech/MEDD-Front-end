import { useEffect, useState } from "react";
import api from "../axiosConfig";

function Classique() {
  const [agents, setAgents] = useState([]);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    agent: "",
    cree_par: "",
    cree_par_nom: "",
    objet: "",
    lieu: "",
    date_depart: "",
    date_retour: "",
    status: "En attente",
    description: "",
  });

  const [error, setError] = useState("");
  const [nbrJours, setNbrJours] = useState(0);

  // Récupération de l'utilisateur connecté depuis le localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setForm((prev) => ({
        ...prev,
        cree_par: u.id,
        cree_par_nom: u.nom,
      }));
    }
  }, []);

  // Récupération des agents pour le select
useEffect(() => {
  api.get("agents/")
    .then((res) => setAgents(res.data))
    .catch((err) => console.error(err));
}, []);

  // Gestion changement formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "date_depart" || name === "date_retour") {
      const d1 = new Date(name === "date_depart" ? value : form.date_depart);
      const d2 = new Date(name === "date_retour" ? value : form.date_retour);

      if (form.date_depart && form.date_retour) {
        const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
        setNbrJours(diff > 0 ? diff : 0);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agent) {
      setError("Veuillez sélectionner un agent.");
      return;
    }
    if (form.date_retour < form.date_depart) {
      setError("La date de retour doit être ≥ à la date de départ.");
      return;
    }

    try {
      const response = await api.post("missions/", form);
      alert("Mission ajoutée !");
      console.log("Mission créée :", response.data);

      setError("");
      // Reset formulaire tout en conservant le créateur
      setForm({
        agent: "",
        cree_par: user?.id || "",
        cree_par_nom: user?.nom || "",
        objet: "",
        lieu: "",
        date_depart: "",
        date_retour: "",
        status: "En attente",
        description: "",
      });
      setNbrJours(0);

    } catch (error) {
      console.error(error);
      alert("Erreur lors de l’ajout !");
    }
  };

  // Génération PDF
  const generatePdf = async () => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        cree_par: user.id,
        cree_par_nom: user.nom,
      }));
    }

    try {
      const response = await api.post(
      "generate-mission-pdf/",
      form,
        { responseType: "blob" });

    
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "mission.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Erreur PDF :", error);
    }
  };

  return (
    <div style={{ maxWidth: "650px", margin: "auto" }}>
      <h2>Créer une mission</h2>

      <form onSubmit={handleSubmit}>
        <select name="agent" onChange={handleChange} value={form.agent} required>
          <option value="">-- Sélectionner l'agent concerné --</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nom} ({a.fonction})
            </option>
          ))}
        </select>

        {user && (
          <p style={{ background: "#eee", padding: "10px", borderRadius: "6px" }}>
            Créée par : <strong>{user.nom}</strong> ({user.email})
          </p>
        )}

        <input
          type="text"
          name="objet"
          placeholder="Objet de la mission"
          value={form.objet}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lieu"
          placeholder="Lieu"
          value={form.lieu}
          onChange={handleChange}
          required
        />

        <label>Date de départ :</label>
        <input
          type="date"
          name="date_depart"
          value={form.date_depart}
          onChange={handleChange}
          required
        />

        <label>Date de retour :</label>
        <input
          type="date"
          name="date_retour"
          value={form.date_retour}
          onChange={handleChange}
          required
        />

        {nbrJours > 0 && <p><strong>Nombre de jours estimé :</strong> {nbrJours}</p>}

        <select name="status" onChange={handleChange} value={form.status} disabled>
          <option value="En attente">En attente</option>
          <option value="Approuvée">Approuvée</option>
          <option value="Rejetée">Rejetée</option>
        </select>

        <textarea
          name="description"
          placeholder="Description (optionnel)"
          value={form.description}
          onChange={handleChange}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Enregistrer</button>
      </form>

      <button onClick={generatePdf}>Générer PDF</button>
    </div>
  );
}

export default Classique;

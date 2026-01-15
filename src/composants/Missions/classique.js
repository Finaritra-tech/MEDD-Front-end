import { useEffect, useState } from "react";
import api from "../axiosConfig";
import Button from "../../UI/button";
import Input from "../../UI/input";
import { FaClipboardList, FaSave, FaPrint } from "react-icons/fa";

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

<div className="max-w-3xl mx-auto p-6 bg-[#EAEAEA] rounded-[30px_10px_30px_10px] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]">
<h2 className="text-2xl font-bold mb-6 text-gray-700 text-center flex items-center justify-center gap-2">
  <FaClipboardList className="text-gray-500" />
  Créer une mission
</h2>

  <form onSubmit={handleSubmit} className="space-y-6">
    {/* ===== GRID 2 COLONNES ===== */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Agent */}
      <select
        name="agent"
        onChange={handleChange}
        value={form.agent}
        required
        className="p-3 rounded-xl bg-[#EAEAEA] 
                   shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]
                   focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
      >
        <option value="">-- Sélectionner l'agent --</option>
        {agents.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nom} ({a.fonction})
          </option>
        ))}
      </select>

      {/* Créée par */}
      {user && (
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 ">Créée par</label>
          <Input
            type="text"
            value={form.cree_par_nom}
            readOnly
          />
          <Input type="text" value={form.cree_par} readOnly hidden />
        </div>
      )}
    </div>

    {/* Objet et Lieu */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        type="text"
        name="objet"
        placeholder="Objet de la mission"
        value={form.objet}
        onChange={handleChange}
        required
      />

      <Input
        type="text"
        name="lieu"
        placeholder="Lieu"
        value={form.lieu}
        onChange={handleChange}
        required
      />
    </div>

    {/* Dates */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">Date de départ</label>
        <Input
          type="date"
          name="date_depart"
          value={form.date_depart}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 ">Date de retour</label>
        <Input
          type="date"
          name="date_retour"
          value={form.date_retour}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    {nbrJours > 0 && (
      <p className="text-sm font-semibold text-gray-600 text-center">
        Nombre de jours estimé : {nbrJours}
      </p>
    )}

    {/* Status */}
    <select
      name="status"
      onChange={handleChange}
      value={form.status}
         className="p-3 rounded-xl bg-[#EAEAEA] 
                   shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]
                   focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
      disabled
    >
      <option value="En attente">En attente</option>
      <option value="Approuvée">Approuvée</option>
      <option value="Rejetée">Rejetée</option>
    </select>

    {/* Description */}
    <textarea
      name="description"
      placeholder="Description (optionnel)"
      value={form.description}
      onChange={handleChange}
      className="w-full min-h-[50px] p-3 rounded-xl bg-[#EAEAEA] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] text-gray-700"
    />

    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

    {/* Buttons */}
    <div className="flex flex-wrap justify-center gap-4">
      <Button
        type="submit"
        className="bg-[#EAEAEA] text-gray-700 shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] hover:shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] transition-all">
          Enregistrer <FaSave className="inline-block ml-2" />
      </Button>

      <Button
        type="button"
        onClick={generatePdf}
        className="bg-[#EAEAEA] text-gray-700 shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] hover:shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] transition-all"
      >
        Générer PDF <FaPrint className="inline-block ml-2" />
      </Button>
    </div>
  </form>
</div>
  );
}

export default Classique;

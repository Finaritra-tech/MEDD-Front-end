import { useEffect, useState } from "react";
import api from "../axiosConfig";
import Input from "../../UI/input";
import Button from "../../UI/button";  
import Title from "../../UI/title"; 

function Direct() {
  const [agents, setAgents] = useState([]);
  const [user, setUser] = useState(null);
  const [agentsDisponibles, setAgentsDisponibles] = useState([]);

useEffect(() => {
  api.get("agents/").then((res) => {
    const disponibles = res.data.filter(agent => !agent.missions_en_cours || agent.missions_en_cours.length === 0);
    setAgentsDisponibles(disponibles);
  }).catch((err) => console.error(err));
}, []);


  const [form, setForm] = useState({
    agent: "",
    cree_par: "",
    cree_par_nom: "",
    objet: "",
    lieu: "",
    date_depart: "",
    date_retour: "",
    status: "Approuvée",
    description: "",
    destinatairee:""

  });
 const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const tomorrowDate = getTomorrow();
  const [error, setError] = useState("");
  const [nbrJours, setNbrJours] = useState(0);

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

useEffect(() => {
  api.get("agents/")
    .then((res) => setAgents(res.data))
    .catch((err) => console.error(err));
}, []);

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
        // cree_par: "",
        // cree_par_nom:"",
        objet: "",
        lieu: "",
        date_depart: "",
        date_retour: "",
        status: "En attente",
        description: "",
        destinatairee:""
      });
      setNbrJours(0);
      console.log(form)

    } catch (error) {
      console.error(error);
      alert("Erreur lors de l’ajout !");
    }
  };

  const generateePdf = async () => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        cree_par: user.id,
        cree_par_nom: user.nom,
      }));
    }

    try {
      const response = await api.post(
      "om-pdf/",
      form,
        { responseType: "blob" });

    
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "om.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Erreur PDF :", error);
    }
  };

  return (
 <div className="flex justify-center py-6">
  <div
    className="
      w-full max-w-4xl
      bg-[#EAEAEA] rounded-2xl p-6
      shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff]
    "
  >
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
      Créer une mission
    </h2>

    {/* GRID PRINCIPALE */}
    <div className="flex justify-center items-start w-full py-6">

      <form onSubmit={handleSubmit} className="w-full">

        {/* Agent + Créateur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <select name="agent" onChange={handleChange} value={form.agent} required className="w-full p-3 rounded-xl bg-[#EAEAEA] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]">
          <option value="">-- Sélectionner l'agent concerné --</option>
  {agentsDisponibles.map(a => (
    <option key={a.id} value={a.id}>
      {a.nom} ({a.fonction})
    </option>
  ))}
</select>
          {user && (
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Créée par</label>
              <Input type="text" value={form.cree_par_nom} readOnly className="mb-1" />
              <Input type="text" value={form.cree_par} readOnly hidden />
            </div>
          )}
        </div>

        {/* Objet + Lieu */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Date de départ</label>
            <Input
              type="date"
              name="date_depart"
              value={form.date_depart}
              onChange={handleChange}
              min={tomorrowDate}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Date de retour</label>
            <Input
              type="date"
              name="date_retour"
              value={form.date_retour}
              onChange={handleChange}
              required
              min={tomorrowDate}
            />
          </div>
        </div>

        {nbrJours > 0 && (
          <p className="text-sm font-semibold text-gray-600 text-center">
            Nombre de jours estimé : {nbrJours}
          </p>
        )}

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description (optionnel)"
          value={form.description}
          onChange={handleChange}
          className="w-full min-h-[100px] p-3 rounded-xl bg-[#EAEAEA]
                     shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]"
        />

        {/* Destinataire */}
        <select
          name="destinatairee"
          onChange={handleChange}
          value={form.destinatairee}
          required
           className="p-3 rounded-xl bg-[#EAEAEA] 
                   shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]
                   focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
        >
          <option value="">-- Choisir le destinataire --</option>
          {agents.map(a => (
            <option key={a.id} value={a.id}>
              {a.nom} ({a.fonction})
            </option>
          ))}
        </select>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button type="submit">Envoyer</Button>
          <a onClick={generateePdf}>Générer l'ordre de mission</a>
        </div>
      </form>
    </div>
  </div>
</div>

  );
}

export default Direct;

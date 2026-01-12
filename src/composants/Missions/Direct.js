import { useEffect, useState } from "react";
import api from "../axiosConfig";
import Input from "../../UI/input";
import Button from "../../UI/button";  
import Title from "../../UI/title"; 

function Direct() {
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
    status: "Approuvée",
    description: "",
    destinatairee:""

  });

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
    <div
      className="
        bg-[#EAEAEA] rounded-2xl p-6
        shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff]
      "
    >
      <h2 className="text-xl font-bold mb-6 text-gray-700">
        Créer une mission
      </h2>

      {/* GRID PRINCIPALE */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%,30%] gap-6">

        {/* ===== FORMULAIRE ===== */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Agent + Créateur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="agent"
              onChange={handleChange}
              value={form.agent}
              required
              className="w-full p-3 rounded-xl bg-[#EAEAEA]
                         shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]"
            >
              <option value="">-- Sélectionner l'agent concerné --</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nom} ({a.fonction})
                </option>
              ))}
            </select>

            {user && (
              <div>
                <label className="text-sm text-gray-600">Créée par</label>
                <Input type="text" value={form.cree_par_nom} readOnly />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Date de départ</label>
              <Input
                type="date"
                name="date_depart"
                value={form.date_depart}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Date de retour</label>
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
            <p className="text-sm font-semibold text-gray-600">
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
            className="w-full p-3 rounded-xl bg-[#EAEAEA]
                       shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]"
          >
            <option value="">-- Choisir le destinataire --</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>
                {a.nom} ({a.fonction})
              </option>
            ))}
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Button type="submit">Envoyer</Button>
            <Button onClick={generateePdf}>
              Générer l'ordre de mission
            </Button>
          </div>
        </form>

        {/* ===== ZONE QR CODE ===== */}
        <div
          className="
            flex flex-col items-center justify-center
            bg-[#EAEAEA] rounded-2xl p-4
            shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]
          "
        >
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            QR Code de la mission
          </h3>

          <div
            className="
              w-40 h-40 flex items-center justify-center
              rounded-xl bg-[#EAEAEA]
              shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff]
            "
          >
            <span className="text-xs text-gray-500 text-center">
              QR Code<br />à générer
            </span>
          </div>
        </div>

      </div>
    </div>
 
  // <div
  //   className="bg-[#EAEAEA] rounded-2xl p-6
  //              shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff]"
  // >
  //   <h2 className="text-xl font-bold mb-6 text-gray-700">
  //     Créer une mission
  //   </h2>

  //   <form onSubmit={handleSubmit} className="space-y-4">

  //     <select
  //       name="agent"
  //       onChange={handleChange}
  //       value={form.agent}
  //       required
  //       className="w-full p-3 rounded-xl bg-[#EAEAEA]
  //                  shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]"
  //     >
  //       <option value="">-- Sélectionner l'agent concerné --</option>
  //       {agents.map((a) => (
  //         <option key={a.id} value={a.id}>
  //           {a.nom} ({a.fonction})
  //         </option>
  //       ))}
  //     </select>

  //     {user && (
  //       <div
  //         className=""
  //       >
  //         <Input type="text" value={form.cree_par} readOnly hidden />
  //         Créée par :
  //         <Input type="text" value={form.cree_par_nom} readOnly />
  //       </div>
  //     )}

  //     <Input
  //       type="text"
  //       name="objet"
  //       placeholder="Objet de la mission"
  //       value={form.objet}
  //       onChange={handleChange}
  //       required
  //     />

  //     <Input
  //       type="text"
  //       name="lieu"
  //       placeholder="Lieu"
  //       value={form.lieu}
  //       onChange={handleChange}
  //       required
  //     />

  //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //       <div>
  //         <label className="text-sm text-gray-600">Date de départ</label>
  //         <Input
  //           type="date"
  //           name="date_depart"
  //           value={form.date_depart}
  //           onChange={handleChange}
  //           required
  //         />
  //       </div>

  //       <div>
  //         <label className="text-sm text-gray-600">Date de retour</label>
  //         <Input
  //           type="date"
  //           name="date_retour"
  //           value={form.date_retour}
  //           onChange={handleChange}
  //           required
  //         />
  //       </div>
  //     </div>

  //     {nbrJours > 0 && (
  //       <p className="text-sm font-semibold text-gray-600">
  //         Nombre de jours estimé : {nbrJours}
  //       </p>
  //     )}

  //     <select name="status" onChange={handleChange} value={form.status} hidden>
  //       <option value="Approuvée">Approuvée</option>
  //       <option value="En attente">En attente</option>
  //       <option value="Rejetée">Rejetée</option>
  //     </select>

  //     <textarea
  //       name="description"
  //       placeholder="Description (optionnel)"
  //       value={form.description}
  //       onChange={handleChange}
  //       className="w-full min-h-[100px] p-3 rounded-xl bg-[#EAEAEA]
  //                  shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]"
  //     />

  //     <select
  //       name="destinatairee"
  //       onChange={handleChange}
  //       value={form.destinatairee}
  //       required
  //       className="w-full p-3 rounded-xl bg-[#EAEAEA]
  //                  shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]"
  //     >
  //       <option value="">-- Choisir le destinataire --</option>
  //       {agents.map((a) => (
  //         <option key={a.id} value={a.id}>
  //           {a.nom} ({a.fonction})
  //         </option>
  //       ))}
  //     </select>

  //     {error && <p className="text-red-500 text-sm">{error}</p>}

  //     <div className="flex flex-wrap gap-4 pt-2">
  //       <Button type="submit">Envoyer</Button>
  //       <Button onClick={generateePdf}>Générer l'ordre de mission</Button>
  //     </div>
  //   </form>
  // </div>

  );
}

export default Direct;

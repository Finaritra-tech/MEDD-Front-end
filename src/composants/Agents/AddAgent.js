import { useState } from "react";
import api from "../axiosConfig";
import Input from "../../UI/input";
import Button from "../../UI/button";


const SUPERIEUR_BY_DIRECTION = {
  MINISTRE: [
    "OC-DVOR", "Cabinet", "SG", "ULC", "PRMP", "DGGE", "DGDD", "DREDD"
  ],
  "SECRETARIAT GENERAL": [
    "DCSI", "DAF", "DPSE", "DAJC", "DRH"
  ],
  "Organe de Coordination des actions stratégiques pour la Diplomatie Verte et des Organismes Rattachés": [
    "DDVP", "UCOR", "UCREF"
  ],
  "Direction Générale du Développement Durable": [
    "DMFD", "DEVB", "DPRIDDD"
  ],
  "Direction Générale de la Gouvernance Environnementale": [
    "DAPRNE", "DRGPF", "DPDIDE"
  ],
};


function AddAgent() {
  const [form, setForm] = useState({
    matricule: "",
    nom: "",
    fonction: "",
    telephone: "",
    email: "",
    password: "",
    direction: "DCSI",
    superieur_hierarchique: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

 const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "direction") {
    const superieur = getSuperieurHierarchique(value);

    setForm((prev) => ({
      ...prev,
      direction: value,
      superieur_hierarchique: superieur,
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};


  const handlePhoto = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  // Masque pour le téléphone : +261 XX XXX XXX
  const handlePhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // supprime tout sauf chiffres
    if (value.startsWith("261")) value = value.slice(3); // si utilisateur tape 261
    if (value.length > 9) value = value.slice(0, 9);

    let formatted = "+261 ";
    if (value.length > 0) formatted += value.slice(0, 2); // XX
    if (value.length > 2) formatted += " " + value.slice(2, 5); // XXX
    if (value.length > 5) formatted += " " + value.slice(5, 7); // XXX

    e.target.value = formatted;
    handleChange(e); // met à jour le state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (photo) formData.append("photo", photo);

    try {
      const response = await api.post("agents/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Agent ajouté !");
    } catch (error) {
      console.error(error);
      if (error.response) alert(JSON.stringify(error.response.data, null, 2));
      else alert("Erreur réseau");
    }
  };

  const getSuperieurHierarchique = (direction) => {
  for (const [superieur, directions] of Object.entries(SUPERIEUR_BY_DIRECTION)) {
    if (directions.includes(direction)) {
      return superieur;
    }
  }
  return "";
};


  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-[#EAEAEA] p-6 rounded-2xl
                      shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff]">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Ajouter un agent</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input type="text" name="matricule" placeholder="Matricule" onChange={handleChange} required />
          <Input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
          <Input type="text" name="fonction" placeholder="Fonction" onChange={handleChange} required />

          <Input
            type="text"
            name="telephone"
            placeholder="+261 XX XXX XX"
            onChange={handlePhoneInput}
            required
          />

          <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />

          <Input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="confirmMdp"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <select
            name="direction"
            onChange={handleChange}
              className="p-3 rounded-xl bg-[#EAEAEA] 
                   shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]
                   focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          >
            <option value="">-- Sélectionner la direction --</option>
            <option value="SG">Secrétariat Général</option>
            <option value="Cabinet">Cabinet</option>
            <option value="OC-DVOR">OC-DVOR</option>
            <option value="PRMP">PRMP</option>
            <option value="DGGE">DGGE</option>
            <option value="DGDD">DGDD</option>
            <option value="DREDD">DREDD</option>
            <option value="DCSI">DCSI</option>
            <option value="DAF">DAF</option>
            <option value="DPSE">DPSE</option>
            <option value="DAJC">DAJC</option>
            <option value="DRH">DRH</option>
            <option value="DDVP">DDVP</option>
            <option value="UCREF">UCREF</option>
            <option value="UCOR">UCOR</option>
            <option value="DAPRNE">DAPRNE</option>
            <option value="DPDIDE">DPDIDE</option>
            <option value="DRGPF">DRGPF</option>
            <option value="DMFD">DMFD</option>
            <option value="DEVD">DEVD</option>
            <option value="DPRIDDD">DPRIDDD</option>
            <option value="ULC">ULC</option>







          </select>

         <Input type="text" name="superieur_hierarchique" placeholder="Supérieur Hiérarchique" value={form.superieur_hierarchique} readOnly />


          <Input type="file" accept="image/*" onChange={handlePhoto} className="col-span-1 sm:col-span-2" />


          {preview && (
            <div className="col-span-1 sm:col-span-2">
              <h4 className="font-semibold mb-2">Aperçu :</h4>
              <img src={preview} alt="preview" width={150} className="rounded-xl" />
            </div>
          )}

          {error && <p className="col-span-1 sm:col-span-2 text-red-500">{error}</p>}

          <Button type="submit" className="col-span-1 sm:col-span-2">Enregistrer</Button>
        </form>
      </div>
    </div>
  );
}

export default AddAgent;

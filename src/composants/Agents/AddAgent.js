import { useState } from "react";
import axios from "axios";

function AddAgent() {
  const [form, setForm] = useState({
    nom: "",
    fonction: "",
    telephone: "",
    email: "",
    mdp: "",
    direction: "DCSI",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    if (photo) {
      formData.append("photo", photo);
    }

    if (form.mdp !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/agents/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Agent ajouté !");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Erreur !");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Ajouter un agent</h2>

      <form onSubmit={handleSubmit}>
        
 
        <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
        <input type="text" name="fonction" placeholder="Fonction" onChange={handleChange} required />
        <input type="text" name="telephone" placeholder="+261 32 05 558 78" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="mdp" placeholder="Mot de passe" value={form.mdp} onChange={handleChange} required />
        <input type="password" name="confirmMdp" placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>

        <select name="direction" onChange={handleChange}>
          <option value="DCSI">DCSI</option>
          <option value="DAF">DAF</option>
          <option value="DPSE">DPSE</option>
          <option value="DAJC">DAJC</option>
          <option value="DRH">DRH</option>
          <option value="DGGE">DGGE</option>
          <option value="DGDD">DGDD</option>
          <option value="ULC">ULC</option>
        </select>



        <input type="file" accept="image/*" onChange={handlePhoto} />

        {preview && (
          <div>
            <h4>Aperçu :</h4>
            <img src={preview} alt="preview" width={150} style={{ borderRadius: "8px" }} />
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}

export default AddAgent;

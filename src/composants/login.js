import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        form
      );

      const { access, refresh, user } = response.data;

      // Stockage JWT dans localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirection selon is_staff
      if (user.is_staff) {
        navigate("/Direction/dashboard-chef");
      } else {
        navigate("/Agents/dashboard-agent");
      }

    } catch (err) {
      console.error(err);
      setError(
        err.response && err.response.data.detail
          ? err.response.data.detail
          : "Erreur lors de la connexion"
      );
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;

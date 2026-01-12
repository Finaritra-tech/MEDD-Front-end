import { useState } from "react";
import api from "./axiosConfig";
import { useNavigate } from "react-router-dom";
import Button from "../UI/button";  
import Title from "../UI/title";  
import Input from "../UI/input";


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
    const response = await api.post("login/", form);

    // Déstructurer AVANT de loguer
    const { access, refresh, user } = response.data;
    console.log(access, refresh);
    console.log(user);

    // Stockage JWT dans localStorage
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
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
  <div 
    className="flex justify-center items-center min-h-screen bg-[#EAEAEA]"
  >
    <div 
      className="bg-[#EAEAEA] 
                 rounded-2xl 
                 p-8 
                 flex flex-col items-center 
                 shadow-[8px_8px_15px_#c5c5c5,-8px_-8px_15px_#ffffff] 
                 w-full max-w-md"
    >
      <img src="/repoblika.png" alt="Logo" className="mb-6 w-32 h-auto" />

      <h1 className="text-2xl font-bold mb-6">Connexion</h1>

      <form className="w-full" onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="mb-4"
        />
        <Input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
          className="mb-4"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <Button type="submit" className="">Se connecter</Button>
      </form>
    </div>
  </div>
);


}

export default Login;

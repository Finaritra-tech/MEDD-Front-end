// services/auth.js
import api from "./axiosConfig";

export const logout = async () => {
  try {
    // Rappel : on peut envoyer le refresh token si on utilise le blacklist
    const refresh = localStorage.getItem("refresh");

    await api.post("logout/", { refresh });

    // Supprimer les tokens côté client
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    console.log("Déconnexion réussie !");
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};

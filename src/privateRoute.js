// PrivateRoute.js
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const token = localStorage.getItem("access"); // Vérifie le token

  if (!token) {
    // Si pas de token, redirige vers login
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Sinon, affiche la page demandée
}

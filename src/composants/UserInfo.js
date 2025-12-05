import React, { useEffect, useState } from "react";

function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupération du user dans le localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p>Aucun utilisateur connecté.</p>;
  }

  return (
    <div style={{
      padding: "10px",
      backgroundColor: "#f5f5f5",
      borderRadius: "8px",
      marginBottom: "20px"
    }}>
      <h3>Bienvenue, {user.nom} 👋</h3>
      <p>Email : {user.email}</p>
      <p>Rôle : {user.is_staff ? "Chef / Directeur" : "Agent"}</p>
      <p>Direction : {user.direction}</p>



    </div>
  );
}

export default UserInfo;

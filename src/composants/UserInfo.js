import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaUserTie,
  FaBuilding,
  FaBriefcase,
} from "react-icons/fa";

function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <p className="text-center text-gray-500">
        Aucun utilisateur connecté.
      </p>
    );
  }

  return (
    <div
      className="
        max-w-md mx-auto mb-6 p-6
        bg-[#EAEAEA]
        rounded-[30px_10px_30px_10px]
        shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]
      "
    >
      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-4 mb-4">
        <div
  className="
    w-[60px] h-[60px]
    flex items-center justify-center
    rounded-full
    bg-[#EAEAEA]
    shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]
    overflow-hidden
  "
>
  <img
    src={user.photo ? `http://127.0.0.1:8000${user.photo}` : "/default.png"}
    alt="Photo utilisateur"
    className="w-[50px] h-[50px] object-cover rounded-full"
  />
</div>

        <div>
          <h3 className="text-lg font-bold text-gray-700">
            {user.nom}
          </h3>
          <span className="text-sm text-gray-500">
            {user.is_staff ? "Chef / Directeur" : "Agent"}
          </span>
        </div>
      </div>

      {/* ===== INFOS ===== */}
      <div className="space-y-3 text-gray-600 text-sm">

        <div className="flex items-center gap-3">
          <FaEnvelope className="text-gray-500" />
          <span>{user.email}</span>
        </div>

        <div className="flex items-center gap-3">
          <FaUserTie className="text-gray-500" />
          <span>
            {user.is_staff ? "Chef / Directeur" : "Agent"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <FaBuilding className="text-gray-500" />
          <span>{user.direction}</span>
        </div>

        <div className="flex items-center gap-3">
          <FaBriefcase className="text-gray-500" />
          <span>{user.fonction}</span>
        </div>

      </div>
    </div>
  );
}

export default UserInfo;
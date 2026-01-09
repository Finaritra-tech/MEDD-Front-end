// src/components/Header.jsx
import React from "react";
import { useEffect, useState } from "react";


export default function Header({ onSearch }) {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // remonte la valeur au layout
  };

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
    <header className="m-4 h-16 bg-[#EAEAEA] px-6 py-4 flex items-center justify-between
      shadow-[6px_6px_10px_#c5c5c5,-6px_-6px_10px_#ffffff] rounded-xl sticky top-0 z-50">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/MEDD.png" 
          alt="Logo"
          className="w-14 h-auto"
        />
      </div>

      {/* Barre de recherche */}
      <div className="mx-6 hidden md:flex justify-center flex-1">
       <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={handleChange}
        className="
          w-full max-w-md
          px-4 py-2 rounded-2xl
          bg-[#EAEAEA]
          text-black placeholder-black
          shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]
          hover:shadow-[inset_6px_6px_10px_#c5c5c5,inset_-6px_-6px_10px_#ffffff]
          focus:shadow-[inset_6px_6px_10px_#c5c5c5,inset_-6px_-6px_10px_#ffffff]
          focus:outline-none
          transition-shadow duration-200
        "
        />
      </div>

      {/* Nom utilisateur */}
      <div className="text-gray-800 font-semibold text-lg whitespace-nowrap">
        {user.nom}
      </div>
    </header>
  );
}

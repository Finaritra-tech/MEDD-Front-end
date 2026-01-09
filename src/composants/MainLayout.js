import { useState } from "react";
import Header from "../UI/header";
import Sidebar from "../UI/sidebar";
import React from "react";

export default function MainLayout({ children }) {
  const [searchTerm, setSearchTerm] = useState(""); // state global pour recherche

  return (
    <>
      {/* Header reçoit la fonction pour mettre à jour le searchTerm */}
      <Header onSearch={setSearchTerm} />

      <div className="flex">
        <Sidebar />

        {/* Passe searchTerm aux enfants */}
        <main className="flex-1 lg:ml-64 p-6 bg-[#EAEAEA] min-h-screen">
          {React.cloneElement(children, { searchTerm })}
        </main>
      </div>
    </>
  );
}

import { useEffect, useState, useRef } from "react";
import api from "../axiosConfig";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../MEDD.png";
import { FaFilter, FaFilePdf } from "react-icons/fa";




export default function MissionsParMois() {
  const [mois, setMois] = useState("");
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [missions, setMissions] = useState([]);

  const printRef = useRef();

  const fetchMissions = async () => {
    try {
      const response = await api.get(
        `/missions-par-mois/?mois=${mois}&annee=${annee}`
      );
      setMissions(response.data);
    } catch (error) {
      console.error("Erreur chargement missions", error);
    }
  };

const exportPDF = () => {
  const doc = new jsPDF("p", "mm", "a4");

  // ======================
  // LOGO + EN-TÊTE
  // ======================
  doc.addImage(logo, "PNG", 14, 10, 25, 25);

  doc.setFontSize(12);
  doc.text("MINISTÈRE DE L’ENVIRONNEMENT ET DU DEVELOPPEMENT DURABLE", 50, 18);
  doc.setFontSize(10);
  doc.text("Liste des missions approuvées", 50, 24);
  doc.text(`Mois : ${mois} / ${annee}`, 50, 30);

  // ======================
  // TABLEAU AVEC SIGNATURE
  // ======================
  autoTable(doc, {
    startY: 40,
    head: [[
      "Objet",
      "Agent",
      "Lieu",
      "Date départ",
      "Date retour",
      "Jours",
      "Signature"
    ]],
    body: missions.map((m) => [
      m.objet,
      m.agent_nom,
      m.lieu,
      m.date_depart,
      m.date_retour,
      m.nbr_jours,
      "" // Signature vide
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: "middle",
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
    columnStyles: {
      6: { cellWidth: 30 }, // colonne Signature
    },
    didDrawCell: (data) => {
      // Dessiner le rectangle signature dans chaque ligne
      if (data.section === "body" && data.column.index === 6) {
        doc.rect(
          data.cell.x + 1,
          data.cell.y + 2,
          data.cell.width - 2,
          data.cell.height - 4
        );
      }
    },
  });

  // ======================
  // ZONE DATE / CACHET
  // ======================
  const finalY = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(10);
  doc.text(
    `Fait le : ${new Date().toLocaleDateString("fr-FR")}`,
    14,
    finalY
  );

  doc.text("Cachet :", 140, finalY);
  doc.rect(135, finalY + 4, 50, 25);

  doc.save(`missions_${mois}_${annee}.pdf`);
};


//   const handlePrint = () => {
//     const content = printRef.current.innerHTML;
//     const win = window.open("", "", "width=900,height=650");
//     win.document.write(`
//       <html>
//         <head>
//           <title>Missions mensuelles</title>
//           <style>
//             table { width: 100%; border-collapse: collapse; }
//             th, td { border: 1px solid #000; padding: 8px; }
//             th { background: #f0f0f0; }
//           </style>
//         </head>
//         <body>
//           ${content}
//         </body>
//       </html>
//     `);
//     win.document.close();
//     win.print();
//   };


return (
  <div
    className="
      max-w-6xl mx-auto p-6
      bg-[#EAEAEA]
      rounded-[30px_10px_30px_10px]
      shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]
    "
  >
    {/* ===== TITRE ===== */}
    <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center flex items-center justify-center gap-2">
      <FaFilter /> Missions approuvées par mois
    </h2>

    {/* ===== FILTRES ===== */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-end">
      {/* Mois */}
      <select
        value={mois}
        onChange={(e) => setMois(e.target.value)}
        className="
          p-3 rounded-xl bg-[#EAEAEA]
          shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]
          focus:outline-none
        "
      >
        <option value="">-- Mois --</option>
        {[
          "Janvier","Février","Mars","Avril","Mai","Juin",
          "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
        ].map((m, i) => (
          <option key={i} value={i + 1}>{m}</option>
        ))}
      </select>

      {/* Année */}
      <input
        type="number"
        value={annee}
        onChange={(e) => setAnnee(e.target.value)}
        placeholder="Année"
        className="
          p-3 rounded-xl bg-[#EAEAEA]
          shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]
          focus:outline-none
        "
      />

      {/* Bouton afficher */}
      <button
        onClick={fetchMissions}
        className="
          bg-[#EAEAEA] text-gray-700
          rounded-xl px-4 py-3 font-medium
          shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff]
          hover:shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]
          transition-all
        "
      >
        Afficher
      </button>

      {/* Export PDF */}
      <button
        onClick={exportPDF}
        className="
          flex items-center justify-center gap-2
          bg-[#EAEAEA] text-red-600
          rounded-xl px-4 py-3 font-medium
          shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff]
          hover:shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]
          transition-all
        "
      >
        <FaFilePdf /> Exporter le PDF
      </button>
    </div>

    {/* ===== TABLE ===== */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm text-gray-700">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Objet</th>
            <th className="p-3 text-left">Agent</th>
            <th className="p-3 text-left">Lieu</th>
            <th className="p-3">Départ</th>
            <th className="p-3">Retour</th>
            <th className="p-3 text-center">Jours</th>
          </tr>
        </thead>
        <tbody>
          {missions.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500">
                Aucune mission trouvée
              </td>
            </tr>
          ) : (
            missions.map((m) => (
              <tr
                key={m.id}
                className="hover:bg-gray-100 transition-all"
              >
                <td className="p-3">{m.objet}</td>
                <td className="p-3">{m.agent_nom}</td>
                <td className="p-3">{m.lieu}</td>
                <td className="p-3">{m.date_depart}</td>
                <td className="p-3">{m.date_retour}</td>
                <td className="p-3 text-center font-semibold">
                  {m.nbr_jours}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

}

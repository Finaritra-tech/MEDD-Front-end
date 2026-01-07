import { useEffect, useState } from "react";
import api from "../axiosConfig";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// 🔹 REGISTER LES COMPOSANTS DE CHART.JS
ChartJS.register(
  CategoryScale, // Axe X catégoriel
  LinearScale,   // Axe Y linéaire
  BarElement,    // Bar chart
  Title,
  Tooltip,
  Legend
);

function MissionsParDirection() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api.get("/directionss/")  // Assure-toi que c'est le bon endpoint
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats.length) return <p>Chargement...</p>;

  const labels = stats.map(item => item.agent__direction);
  const values = stats.map(item => item.total);

  const data = {
    labels,
    datasets: [
      {
        label: "Nombre de missions",
        data: values,
        backgroundColor: "#1D91A5",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Missions par direction" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} />;
}

export default MissionsParDirection;

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

// 🔹 REGISTER
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/* ===== Plugin ombre 3D ===== */
const barShadowPlugin = {
  id: "barShadow",
  beforeDatasetsDraw(chart) {
    const { ctx } = chart;
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
  },
  afterDatasetsDraw(chart) {
    chart.ctx.restore();
  },
};

/* ===== Gradient 3D ===== */
const gradient = (ctx) => {
  const g = ctx.createLinearGradient(0, 0, 0, 300);
  g.addColorStop(0, "#3bb6c9");
  g.addColorStop(1, "#1D91A5");
  return g;
};

function MissionsParDirection() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api
      .get("/directionss/")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats.length) return <p>Chargement...</p>;

  const labels = stats.map((item) => item.agent__direction);
  const values = stats.map((item) => item.total);

  const data = {
    labels,
    datasets: [
      {
        label: "Nombre de missions",
        data: values,
        backgroundColor: (context) => {
          const { ctx } = context.chart;
          return gradient(ctx);
        },
        borderRadius: 10,
        barThickness: 38,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Missions par direction",
        color: "#2b2b2b",
        font: { size: 18, weight: "bold" },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#555" },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#d6d6d6",
          borderDash: [4, 4],
        },
        ticks: { color: "#555" },
      },
    },
  };

  return (
    <Bar
      data={data}
      options={options}
      plugins={[barShadowPlugin]}
    />
  );
}

export default MissionsParDirection;

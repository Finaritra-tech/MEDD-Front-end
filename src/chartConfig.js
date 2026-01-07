// chartSetup.js ou directement dans ton composant
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,  // pour l'axe X catégoriel
  LinearScale,    // pour l'axe Y linéaire
  BarElement,     // pour Bar chart
  PointElement,   // pour Line chart
  LineElement,    // pour Line chart
  Title,
  Tooltip,
  Legend
);

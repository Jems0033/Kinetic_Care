import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function DashboardCharts({ dashboard }) {

  const pieData = {
    labels: ["Residents", "Staff", "Rooms"],

    datasets: [
      {
        data: [
          dashboard.totalResidents,
          dashboard.totalStaff,
          dashboard.totalRooms,
        ],

        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FF9800",
        ],
      },
    ],
  };

  const barData = {
    labels: ["Residents", "Staff", "Rooms"],

    datasets: [
      {
        label: "Total",

        data: [
          dashboard.totalResidents,
          dashboard.totalStaff,
          dashboard.totalRooms,
        ],

        backgroundColor: "#4CAF50",
      },
    ],
  };

  return (
    <div className="charts">

      <div className="chart-card">
        <h3>Overview</h3>

        <Pie data={pieData} />
      </div>

      <div className="chart-card">
        <h3>Statistics</h3>

        <Bar data={barData} />
      </div>

    </div>
  );
}

export default DashboardCharts;
import Sidebar from "../components/Sidebar";
import "../css/Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardCharts from "../components/DashboardCharts";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [dashboard, setDashboard] = useState({
    totalResidents: 0,
    totalStaff: 0,
    totalRooms: 0,
    pendingPayments: 0,
  });

  const [recentResidents, setRecentResidents] = useState([]);


  useEffect(() => {
    getDashboard();
    getRecentResidents();
  }, []);

  const getDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      setDashboard(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecentResidents = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
            "http://localhost:5000/api/residents/recent",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setRecentResidents(res.data);

    } catch (error) {

        console.log(error);

    }

};

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Welcome {user?.name}</h1>

            <p>Kinetic Care Dashboard</p>
          </div>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h2>{dashboard.totalResidents}</h2>
            <p>Total Residents</p>
          </div>

          <div className="dashboard-card">
            <h2>{dashboard.totalStaff}</h2>

            <p>Total Staff</p>
          </div>

          <div className="dashboard-card">
            <h2>{dashboard.totalRooms}</h2>

            <p>Available Rooms</p>
          </div>

          <div className="dashboard-card">
            <h2>{dashboard.pendingPayments}</h2>

            <p>Pending Payments</p>
          </div>
        </div>
        <DashboardCharts dashboard={dashboard} />
        <div className="recent-section">
          <h2>Recent Residents</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>

                <th>Age</th>

                <th>Room</th>

                <th>medicalCondition</th>

                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentResidents.slice(0, 5).map((resident) => (
                <tr key={resident._id}>
                  <td>{resident.name}</td>

                  <td>{resident.age}</td>

                  <td>{resident.room}</td>

                  <td>{resident.medicalCondition}</td>

                  <td>{resident.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

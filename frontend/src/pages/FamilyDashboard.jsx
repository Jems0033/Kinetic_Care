import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/FamilyDashboard.css";

import {
  FaUserAlt,
  FaBed,
  FaHeartbeat,
  FaCalendarAlt,
  FaDonate,
} from "react-icons/fa";

function FamilyDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    resident: {},

    medicalCount: 0,

    eventCount: 0,

    latestMedical: {},
  });

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/family/dashboard",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDashboard(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="family-dashboard">
      <div className="welcome-section">
        <h1>Welcome Family 👋</h1>

        <p>Stay connected with your loved one anytime.</p>
      </div>

      <div className="family-dashboard-cards">
        <div className="family-dashboard-card">
          <FaUserAlt className="card-icon" />

          <h3>Resident</h3>

          <h2>{dashboard.resident.name || "-"}</h2>
        </div>

        <div className="family-dashboard-card">
          <FaBed className="card-icon" />

          <h3>Room</h3>

          <h2>{dashboard.resident.room || "-"}</h2>
        </div>

        <div className="family-dashboard-card">
          <FaHeartbeat className="card-icon" />

          <h3>Medical</h3>

          <h2>{dashboard.medicalCount}</h2>
        </div>

        <div className="family-dashboard-card">
          <FaCalendarAlt className="card-icon" />

          <h3>Events</h3>

          <h2>{dashboard.eventCount}</h2>
        </div>
      </div>
      <div className="family-dashboard-content">
        {/* Resident Profile */}

        <div className="family-dashboard-box">
          <div className="family-box-header">
            <h2>👴 Resident Profile</h2>
          </div>

          <div className="resident-profile">
            <div className="resident-image">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Resident"
              />
            </div>

            <div className="resident-details">
              <p>
                <strong>Name :</strong> {dashboard.resident.name}
              </p>

              <p>
                <strong>Age :</strong> {dashboard.resident.age}
              </p>

              <p>
                <strong>Gender :</strong> {dashboard.resident.gender}
              </p>

              <p>
                <strong>Room :</strong> {dashboard.resident.room}
              </p>
            </div>
          </div>
        </div>

        {/* Latest Medical */}

        <div className="family-dashboard-box">
          <div className="family-box-header">
            <h2>💊 Latest Medical Record</h2>
          </div>

          <div className="medical-details">
            <p>
              <strong>Doctor :</strong>
              {dashboard.latestMedical?.staffId?.name || "-"}
            </p>

            <p>
              <strong>Problem :</strong>

              {dashboard.latestMedical?.problem || "-"}
            </p>

            <p>
              <strong>Medicine :</strong>

              {dashboard.latestMedical?.medicine || "-"}
            </p>

            <p>
              <strong>Date :</strong>

              {dashboard.latestMedical?.date
                ? new Date(dashboard.latestMedical.date).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        {/* Upcoming Events */}

        <div className="family-dashboard-box">
          <div className="family-box-header">
            <h2>🎉 Upcoming Events</h2>
          </div>

          <div className="family-event-box">
            <h3>Total Upcoming Events</h3>

            <span>{dashboard.eventCount}</span>
          </div>
        </div>

        {/* Quick Actions */}

        <div className="family-dashboard-box">
          <div className="family-box-header">
            <h2>⚡ Quick Actions</h2>
          </div>

          <div className="quick-actions">
            <button onClick={() => navigate("/family/book-visit")}>
              <FaCalendarAlt />
              Book Visit
            </button>

            <button onClick={() => navigate("/family/donate")}>
    <FaDonate />
    Donate
</button>

            <button onClick={() => navigate("/family/medical-history")}>
  <FaHeartbeat />
  Medical History
</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FamilyDashboard;

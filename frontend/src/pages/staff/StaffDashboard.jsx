import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserNurse,
  FaClock,
  FaSignOutAlt,
  FaUserCircle,
  FaClipboardList,
  FaHeartbeat,
} from "react-icons/fa";
import "../../css/staff/StaffDashboard.css";

function StaffDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/staff/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="staff-dashboard">

      {/* Header */}

      <div className="staff-header">

        <div>

          <h2>Welcome, {dashboard.name}</h2>

          <p>
            {dashboard.role} | Shift : {dashboard.shift}
          </p>

        </div>

        <button onClick={logout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>

      </div>

      {/* Cards */}

      <div className="staff-cards">

        <div className="staff-card">

          <FaUsers className="staff-icon" />

          <h3>{dashboard.totalResidents}</h3>

          <p>Total Residents</p>

        </div>

        <div className="staff-card">

          <FaUserNurse className="staff-icon" />

          <h3>{dashboard.assignedResidents}</h3>

          <p>Assigned Residents</p>

        </div>

        <div className="staff-card">

          <FaClock className="staff-icon" />

          <h3>{dashboard.shift}</h3>

          <p>Current Shift</p>

        </div>

      </div>

      {/* Quick Actions */}

      <h3 className="section-title">Quick Actions</h3>

      <div className="quick-actions">

        <div
          className="action-card"
          onClick={() => navigate("/staff/residents")}
        >
          <FaUsers />
          <span>Residents</span>
        </div>

        <div className="action-card">
          <FaHeartbeat />
          <span>Today's Tasks</span>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/staff/profile")}
        >
          <FaUserCircle />
          <span>My Profile</span>
        </div>

        <div className="action-card">
          <FaClipboardList />
          <span>Reports</span>
        </div>

      </div>

      {/* Activity */}

      <h3 className="section-title">Recent Activity</h3>

      <div className="activity-box">

        <div className="activity-item">
          <strong>Resident Updated</strong>
          <p>Vitals updated successfully.</p>
        </div>

        <div className="activity-item">
          <strong>Medicine Given</strong>
          <p>Today's medicine completed.</p>
        </div>

        <div className="activity-item">
          <strong>Daily Care</strong>
          <p>Resident daily care marked complete.</p>
        </div>

      </div>

    </div>
  );
}

export default StaffDashboard;
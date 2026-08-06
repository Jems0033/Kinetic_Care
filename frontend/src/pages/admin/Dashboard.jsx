import Sidebar from "../../components/Sidebar";
import "../../css/admin/Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaUserFriends,
  FaUsers,
  FaBed,
  FaSun,
  FaUserPlus,
  FaUserNurse,
  FaDoorOpen,
  FaCalendarPlus,
} from "react-icons/fa";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalResidents: 0,
    totalStaff: 0,
    totalRooms: 0,
  });

  const [recentResidents, setRecentResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard();
    getRecentResidents();
  }, []);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
const [leaveRequests, setLeaveRequests] = useState([]);
const [leaveLoading, setLeaveLoading] = useState(false);
const [leaveMessage, setLeaveMessage] = useState("");

  const getDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboard(res.data);
    } catch (err) {
      console.log("Dashboard Error:", err);
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
        },
      );

      setRecentResidents(res.data);
    } catch (err) {
      console.log("Recent Residents Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good day";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  const chartData = {
    labels: ["Residents", "Staff", "Rooms"],

    datasets: [
      {
        label: "Dashboard Data",

        data: [
          Number(dashboard.totalResidents) || 0,
          Number(dashboard.totalStaff) || 0,
          Number(dashboard.totalRooms) || 0,
        ],

        backgroundColor: ["#1f9d74", "#4f7cff", "#ff9f43", "#9b59b6"],

        borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],

        borderWidth: 4,
        hoverOffset: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 18,

          font: {
            size: 13,
            weight: "600",
          },

          color: "#4b5563",
        },
      },

      tooltip: {
        backgroundColor: "#1f2937",
        padding: 12,
        cornerRadius: 8,

        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;

            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  const getLeaveRequests = async () => {
  try {
    setLeaveLoading(true);
    setLeaveMessage("");

    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/dashboard/leave-requests",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setLeaveRequests(res.data);
  } catch (error) {
    setLeaveMessage(
      error.response?.data?.message ||
        "Unable to load leave requests",
    );
  } finally {
    setLeaveLoading(false);
  }
};

const openLeaveModal = () => {
  setShowLeaveModal(true);
  getLeaveRequests();
};

const approveLeave = async (leaveId) => {
  try {
    setLeaveMessage("");

    const token = localStorage.getItem("token");

    const res = await axios.put(
      `http://localhost:5000/api/dashboard/leave-requests/${leaveId}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setLeaveMessage(
      res.data.message || "Leave approved successfully",
    );

    getLeaveRequests();
  } catch (error) {
    setLeaveMessage(
      error.response?.data?.message ||
        "Unable to approve leave",
    );
  }
};

const rejectLeave = async (leaveId) => {
  try {
    setLeaveMessage("");

    const token = localStorage.getItem("token");

    const res = await axios.put(
      `http://localhost:5000/api/dashboard/leave-requests/${leaveId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setLeaveMessage(
      res.data.message || "Leave rejected successfully",
    );

    getLeaveRequests();
  } catch (error) {
    setLeaveMessage(
      error.response?.data?.message ||
        "Unable to reject leave",
    );
  }
};
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        {/* HEADER */}

        <header className="dashboard-header">
          <div className="header-text">
            <h1>
              <FaSun className="sun-icon" />
              {greeting}, {user?.name || "Admin"}
            </h1>

            <p className="welcome-text">
              Monitor residents, rooms, staff and payments from one place.
            </p>
          </div>
        </header>

        {/* STAT CARDS */}

        <section className="stats-grid">
          <div className="stat-card green">
            <div className="stat-icon">
              <FaUserFriends />
            </div>

            <div className="stat-information">
              <span>Total Residents</span>

              <h2>{dashboard.totalResidents}</h2>

              <p>Currently registered</p>
            </div>
          </div>

          <div className="stat-card blue">
            <div className="stat-icon">
              <FaUsers />
            </div>

            <div className="stat-information">
              <span>Total Staff</span>

              <h2>{dashboard.totalStaff}</h2>

              <p>Active team members</p>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">
              <FaBed />
            </div>

            <div className="stat-information">
              <span>Total Rooms</span>

              <h2>{dashboard.totalRooms}</h2>

              <p>Ready for allocation</p>
            </div>
          </div>
        </section>

        {/* CHART AND QUICK ACTIONS */}

        <section className="dashboard-middle-grid">
          <div className="chart-card">
            <div className="section-heading">
              <div>
                <p className="section-label">Overview</p>

                <h2>Dashboard Distribution</h2>
              </div>

              <span className="live-badge">
                <span></span>
                Live Data
              </span>
            </div>

            <div className="pie-chart-container">
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="quick-box">
            <div className="section-heading">
              <div>
                <p className="section-label">Manage</p>

                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="quick-grid">
              <button
                type="button"
                onClick={() =>
                  navigate("/residents", {
                    state: { openModal: "addResident" },
                  })
                }
              >
                <span className="quick-icon resident-action">
                  <FaUserPlus />
                </span>

                <span>
                  <strong>Add Resident</strong>
                  <small>Register a new resident</small>
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/staff", {
                    state: { openModal: "addStaff" },
                  })
                }
              >
                <span className="quick-icon staff-action">
                  <FaUserNurse />
                </span>

                <span>
                  <strong>Add Staff</strong>
                  <small>Create staff profile</small>
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/rooms", {
                    state: { openModal: "addRoom" },
                  })
                }
              >
                <span className="quick-icon room-action">
                  <FaDoorOpen />
                </span>

                <span>
                  <strong>Add Room</strong>
                  <small>Create a new room</small>
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/events", {
                    state: { openModal: "addEvent" },
                  })
                }
              >
                <span className="quick-icon event-action">
                  <FaCalendarPlus />
                </span>

                <span>
                  <strong>Add Event</strong>
                  <small>Create a new event</small>
                </span>
              </button>

              <button
  type="button"
  className="admin-leave-btn"
  onClick={openLeaveModal}
>
  Leave Requests
</button>
            </div>
          </div>
        </section>

        {/* RECENT RESIDENTS */}

        <section className="resident-card-box">
          <div className="resident-box-header">
            <div>
              <p className="section-label">Latest Entries</p>
              <h2>Recent Residents</h2>
            </div>

            <span className="resident-count">
              {recentResidents.length} Residents
            </span>
          </div>

          {loading ? (
            <div className="resident-message">Loading residents...</div>
          ) : recentResidents.length === 0 ? (
            <div className="resident-message">No recent residents found.</div>
          ) : (
            <div className="resident-profile-grid">
              {recentResidents.slice(0, 6).map((resident) => (
                <div className="resident-profile-card" key={resident._id}>
                  <div className="resident-card-top">
                    <div className="resident-large-avatar">
                      {resident.gender?.toLowerCase() === "male" ? "👴" : "👵"}
                    </div>

                    <span
                      className={`resident-card-status ${
                        resident.status?.toLowerCase() === "active"
                          ? "active"
                          : "temporary"
                      }`}
                    >
                      {resident.status || "Not Found"}
                    </span>
                  </div>

                  <div className="resident-profile-info">
                    <h3>{resident.name}</h3>

                    <p className="resident-condition">
                      {resident.medicalCondition ||
                        "No medical condition added"}
                    </p>
                  </div>

                  <div className="resident-information-grid">
                    <div className="resident-info-item">
                      <span>Age</span>

                      <strong>{resident.age || "N/A"}</strong>
                    </div>

                    <div className="resident-info-item">
                      <span>Gender</span>

                      <strong>{resident.gender || "N/A"}</strong>
                    </div>

                    <div className="resident-info-item">
                      <span>Room</span>

                      <strong>
                        {resident.room?.roomNumber ||
                          resident.room ||
                          "Not Assigned"}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="resident-view-button"
                    onClick={() =>
                      navigate("/residents", {
                        state: {
                          searchResident: resident.name,
                        },
                      })
                    }
                  >
                    View Resident
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      {showLeaveModal && (
  <div
    className="admin-leave-overlay"
    onMouseDown={() => setShowLeaveModal(false)}
  >
    <div
      className="admin-leave-modal"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="admin-leave-header">
        <div>
          <p>Staff Management</p>
          <h2>Caretaker Leave Requests</h2>
        </div>

        <button
          type="button"
          onClick={() => setShowLeaveModal(false)}
        >
          ✕
        </button>
      </div>

      {leaveMessage && (
        <div className="admin-leave-message">
          {leaveMessage}
        </div>
      )}

      {leaveLoading ? (
        <div className="admin-leave-empty">
          Loading leave requests...
        </div>
      ) : leaveRequests.length === 0 ? (
        <div className="admin-leave-empty">
          No leave requests available.
        </div>
      ) : (
        <div className="admin-leave-list">
          {leaveRequests.map((leave) => (
            <div
              className="admin-leave-card"
              key={leave._id}
            >
              <div className="admin-leave-person">
                <div className="admin-leave-avatar">
                  {leave.caretakerId?.name
                    ?.charAt(0)
                    .toUpperCase() || "C"}
                </div>

                <div>
                  <h3>
                    {leave.caretakerId?.name ||
                      "Caretaker"}
                  </h3>

                  <span>
                    {leave.caretakerId?.shift || "-"} Shift
                  </span>
                </div>
              </div>

              <div className="admin-leave-details">
                <div>
                  <span>From</span>
                  <strong>
                    {new Date(
                      leave.fromDate,
                    ).toLocaleDateString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>To</span>
                  <strong>
                    {new Date(
                      leave.toDate,
                    ).toLocaleDateString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong
                    className={`leave-status ${leave.status.toLowerCase()}`}
                  >
                    {leave.status}
                  </strong>
                </div>
              </div>

              <div className="admin-leave-reason">
                <span>Reason</span>
                <p>{leave.reason}</p>
              </div>

              {leave.status === "Pending" && (
                <div className="admin-leave-actions">
                  <button
                    type="button"
                    className="leave-reject-btn"
                    onClick={() =>
                      rejectLeave(leave._id)
                    }
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    className="leave-approve-btn"
                    onClick={() =>
                      approveLeave(leave._id)
                    }
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
}

export default Dashboard;

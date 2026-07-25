import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaDoorOpen,
  FaHeartbeat,
  FaArrowLeft,
  FaEye,
  FaUsers,
} from "react-icons/fa";

import "../../css/staff/StaffResidents.css";

function StaffResidents() {
  const navigate = useNavigate();

  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/staff/residents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResidents(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Residents load thai shakya nahi."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredResidents = residents.filter((resident) => {
    const value = search.toLowerCase();

    return (
      resident.name?.toLowerCase().includes(value) ||
      resident.room?.toString().toLowerCase().includes(value) ||
      resident.gender?.toLowerCase().includes(value) ||
      resident.medicalCondition?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="staff-residents-page">
      <div className="residents-topbar">
        <button
          className="residents-back-btn"
          onClick={() => navigate("/staff-dashboard")}
        >
          <FaArrowLeft />
          Back
        </button>

        <div>
          <h1>Residents</h1>
          <p>View and manage old age home residents</p>
        </div>

        <div className="resident-total-box">
          <FaUsers />
          <div>
            <span>Total Residents</span>
            <strong>{residents.length}</strong>
          </div>
        </div>
      </div>

      <div className="resident-search-section">
        <div className="resident-search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search by name, room, gender or condition..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <p>
          Showing <strong>{filteredResidents.length}</strong> residents
        </p>
      </div>

      {loading && (
        <div className="resident-status-box">
          <div className="resident-loader"></div>
          <p>Residents loading...</p>
        </div>
      )}

      {!loading && error && (
        <div className="resident-error-box">
          <p>{error}</p>

          <button onClick={fetchResidents}>Try Again</button>
        </div>
      )}

      {!loading && !error && filteredResidents.length === 0 && (
        <div className="resident-empty-box">
          <FaUser />

          <h3>No residents found</h3>

          <p>Search value change kari ne fari try karo.</p>
        </div>
      )}

      {!loading && !error && filteredResidents.length > 0 && (
        <div className="resident-card-grid">
          {filteredResidents.map((resident) => (
            <div className="resident-profile-card" key={resident._id}>
              <div className="resident-card-header">
                <div className="resident-avatar">
                  {resident.name
                    ? resident.name.charAt(0).toUpperCase()
                    : "R"}
                </div>

                <div className="resident-basic-info">
                  <h3>{resident.name}</h3>

                  <span className="resident-gender-badge">
                    {resident.gender || "Not specified"}
                  </span>
                </div>
              </div>

              <div className="resident-card-body">
                <div className="resident-info-row">
                  <div className="resident-info-icon">
                    <FaUser />
                  </div>

                  <div>
                    <span>Age</span>
                    <strong>
                      {resident.age ? `${resident.age} Years` : "N/A"}
                    </strong>
                  </div>
                </div>

                <div className="resident-info-row">
                  <div className="resident-info-icon">
                    <FaDoorOpen />
                  </div>

                  <div>
                    <span>Room Number</span>
                    <strong>{resident.room || "Not Assigned"}</strong>
                  </div>
                </div>

                <div className="resident-info-row">
                  <div className="resident-info-icon">
                    <FaHeartbeat />
                  </div>

                  <div>
                    <span>Medical Condition</span>
                    <strong>
                      {resident.medicalCondition || "No condition recorded"}
                    </strong>
                  </div>
                </div>
              </div>

              <button
                className="resident-view-btn"
                onClick={() =>
                  navigate(`/staff/resident/${resident._id}`)
                }
              >
                <FaEye />
                View Resident
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StaffResidents;
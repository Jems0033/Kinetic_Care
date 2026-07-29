import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/caretaker/CaretakerDashboard.css";
import { useNavigate } from "react-router-dom";

function CaretakerDashboard() {
  const [data, setData] = useState({
    caretaker: {},
    totalResidents: 0,
    residents: [],
  });
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/caretaker/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (error) {
      console.log("Caretaker Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 className="caretaker-loading">Loading...</h2>;
  }

  return (
    <div className="caretaker-dashboard">
      <div className="caretaker-header">
        <div>
          <p className="welcome-text">Welcome Back 👋</p>
          <h1>{data.caretaker?.name || "Caretaker"}</h1>
          <p>
            Manage and monitor the daily care of your assigned residents.
          </p>
        </div>

        <div className="header-actions">
  <div className="shift-badge">
    {data.caretaker?.shift} Shift
  </div>

  <button
    className="profile-btn"
    onClick={() => navigate("/caretaker/profile")}
  >
    👤 Profile
  </button>
</div>
      </div>

      <div className="caretaker-stats">
        <div className="stat-card">
          <div className="stat-icon">👴</div>

          <div>
            <p>Assigned Residents</p>
            <h2>{data.totalResidents}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🕐</div>

          <div>
            <p>Current Shift</p>
            <h2>{data.caretaker?.shift}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💼</div>

          <div>
            <p>Role</p>
            <h2>{data.caretaker?.role}</h2>
          </div>
        </div>
      </div>

      <div className="resident-section">
        <div className="section-title">
          <div>
            <h2>My Residents</h2>
            <p>Residents assigned to your current shift</p>
          </div>
        </div>

        {data.residents.length === 0 ? (
          <div className="no-residents">
            <h3>No Residents Assigned</h3>
            <p>No residents are currently assigned to your shift.</p>
          </div>
        ) : (
          <div className="resident-grid">
            {data.residents.map((resident) => {
              const doctor =
                data.caretaker?.shift === "Morning"
                  ? resident.morningDoctor
                  : resident.nightDoctor;

              return (
                <div className="resident-card" key={resident._id}>
                  <div className="resident-top">
                    <div className="resident-avatar">
                      {resident.gender === "Female" ? "👵" : "👴"}
                    </div>

                    <div>
                      <h3>{resident.name}</h3>
                      <p>{resident.age} Years</p>
                    </div>
                  </div>

                  <div className="resident-info">
                    <div className="info-row">
                      <span>Gender</span>
                      <strong>{resident.gender}</strong>
                    </div>

                    <div className="info-row">
                      <span>Room</span>
                      <strong>
                        {resident.room?.roomNumber || "Not Assigned"}
                      </strong>
                    </div>

                    <div className="info-row">
                      <span>Condition</span>
                      <strong>
                        {resident.medicalCondition || "Normal"}
                      </strong>
                    </div>

                    <div className="info-row">
                      <span>Doctor</span>
                      <strong>{doctor?.name || "Not Assigned"}</strong>
                    </div>
                  </div>

                  <button
  className="care-btn"
  onClick={() =>
    navigate(`/caretaker/resident/${resident._id}`)
  }
>
  View Resident Care
</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CaretakerDashboard;
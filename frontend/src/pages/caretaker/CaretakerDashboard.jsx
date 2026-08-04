import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaArrowRight,
  FaBed,
  FaHeartbeat,
  FaSearch,
  FaUser,
  FaUserMd,
} from "react-icons/fa";

import "../../css/caretaker/CaretakerDashboard.css";

function CaretakerDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    caretaker: {},
    totalResidents: 0,
    residents: [],
  });

  const [search, setSearch] = useState("");
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
        },
      );

      setData(res.data);
    } catch (error) {
      console.log("Caretaker Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResidents = data.residents.filter((resident) =>
    resident.name?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="caretaker-loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="caretaker-dashboard">
      {/* HEADER */}

      <header className="caretaker-header">
        <div className="caretaker-welcome">
          <p className="caretaker-label">Caretaker Portal</p>

          <h1>Welcome Back, {data.caretaker?.name || "Caretaker"}</h1>

          <span>
            Manage your assigned residents and daily care responsibilities from
            one place.
          </span>
        </div>

        <div className="caretaker-header-actions">
          <button
            type="button"
            className="caretaker-profile-btn"
            onClick={() => navigate("/caretaker/profile")}
          >
            <div className="caretaker-avatar">
              <FaUser />
            </div>

            <div>
              <span>Caretaker Profile</span>

              <strong>{data.caretaker?.name || "Caretaker"}</strong>
            </div>
          </button>
        </div>
      </header>

      {/* RESIDENT LIST */}

      <section className="caretaker-recent-section">
        {/* TOOLBAR */}

        <section className="caretaker-toolbar">
          <div className="caretaker-count-box">
            <span>Total Assigned</span>

            <strong>{data.totalResidents}</strong>

            <small>Residents</small>
          </div>

          <div className="caretaker-search">
            <FaSearch />

            <input
              type="text"
              placeholder="Search resident by name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </section>

        {/* RESIDENT GRID */}

        <section className="caretaker-grid">
          {filteredResidents.length === 0 ? (
            <div className="caretaker-empty">
              <div className="caretaker-empty-icon">
                <FaUserMd />
              </div>

              <h3>No Residents Found</h3>

              <p>
                {search
                  ? "No resident matches your search."
                  : "Assigned residents will appear here."}
              </p>
            </div>
          ) : (
            filteredResidents.map((resident) => {
              const doctor =
                data.caretaker?.shift === "Morning"
                  ? resident.morningDoctor
                  : resident.nightDoctor;

              return (
                <article className="caretaker-card" key={resident._id}>
                  {/* CARD HEADER */}

                  <div className="caretaker-card-header">
                    <div className="caretaker-profile">
                      <div className="caretaker-resident-avatar">
                        {resident.gender?.toLowerCase() === "female"
                          ? "👵"
                          : "👴"}
                      </div>

                      <div>
                        <span>Resident</span>

                        <h3>{resident.name}</h3>

                        <p>
                          {resident.age} years
                          {" • "}
                          {resident.gender}
                        </p>
                      </div>
                    </div>

                    <span className="caretaker-status">Active</span>
                  </div>

                  {/* DETAILS */}

                  <div className="caretaker-card-details">
                    <div className="caretaker-detail">
                      <div className="caretaker-detail-icon caretaker-room-icon">
                        <FaBed />
                      </div>

                      <div>
                        <span>Room</span>

                        <strong>
                          {resident.room?.roomNumber || "Not Assigned"}
                        </strong>
                      </div>
                    </div>

                    <div className="caretaker-detail">
                      <div className="caretaker-detail-icon caretaker-problem-icon">
                        <FaHeartbeat />
                      </div>

                      <div>
                        <span>Medical Condition</span>

                        <strong>{resident.medicalCondition || "Normal"}</strong>
                      </div>
                    </div>

                    <div className="caretaker-detail">
                      <div className="caretaker-detail-icon caretaker-doctor-icon">
                        <FaUserMd />
                      </div>

                      <div>
                        <span>Assigned Doctor</span>

                        <strong>{doctor?.name || "Not Assigned"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* VIEW BUTTON */}

                  <button
                    type="button"
                    className="caretaker-view-btn"
                    onClick={() =>
                      navigate(`/caretaker/resident/${resident._id}`)
                    }
                  >
                    View Resident Care
                    <FaArrowRight />
                  </button>
                </article>
              );
            })
          )}
        </section>
      </section>
    </div>
  );
}

export default CaretakerDashboard;

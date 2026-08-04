import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaNotesMedical,
  FaArrowRight,
  FaUserMd,
  FaSearch,
  FaBed,
} from "react-icons/fa";

import "../../css/doctor/DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getPatients();
  }, []);

  const getPatients = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/doctor/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatients(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="doctor-dashboard">
      {/* HEADER */}

      <header className="doctor-header">
        <div className="doctor-welcome">
          <p className="doctor-label">Doctor Portal</p>

          <h1>Welcome Back, Dr. {user?.name || "Doctor"}</h1>

          <span>Manage your patients and medical records from one place.</span>
        </div>

        <div className="doctor-header-actions">
          <button
            className="doctor-profile-btn"
            onClick={() => navigate("/doctor/profile")}
          >
            <div className="doctor-avatar">
              <FaUserMd />
            </div>

            <div>
              <span>Doctor Profile</span>

              <strong>Dr. {user?.name || "Doctor"}</strong>
            </div>
          </button>
        </div>
      </header>

      {/* PATIENTS LIST */}

      <section
        className="recent-section"
        style={{
          background: "transparent",
          border: "none",
          boxShadow: "none",
          padding: 0,
        }}
      >
        {/* SEARCH / SUMMARY TOOLBAR */}
        <section className="patients-toolbar" style={{ margin: "0 0 20px 0" }}>
          <div className="patient-count-box">
            <span>Total Assigned</span>
            <strong>{patients.length}</strong>
            <small>Patients</small>
          </div>
          <div className="patient-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search patient by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {/* PATIENT GRID */}
        <section className="patient-grid">
          {filteredPatients.length === 0 ? (
            <div className="patients-empty">
              <div className="patients-empty-icon">
                <FaUserMd />
              </div>
              <h3>No Patients Found</h3>
              <p>Assigned patients will appear here.</p>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <article className="patient-card" key={patient._id}>
                <div className="patient-card-header">
                  <div className="patient-profile">
                    <div className="patient-avatar">
                      {patient.gender?.toLowerCase() === "male" ? "👴" : "👵"}
                    </div>
                    <div>
                      <span>Patient</span>
                      <h3>{patient.name}</h3>
                      <p>
                        {patient.age} years • {patient.gender}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`patient-status ${
                      patient.status === "Active" ? "active" : "temporary"
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>

                <div className="patient-card-details">
                  <div className="patient-detail">
                    <div className="patient-detail-icon room-icon">
                      <FaBed />
                    </div>
                    <div>
                      <span>Room</span>
                      <strong>{patient.room || "Not Assigned"}</strong>
                    </div>
                  </div>

                  <div className="patient-detail">
                    <div className="patient-detail-icon problem-icon">
                      <FaNotesMedical />
                    </div>
                    <div>
                      <span>Latest Problem</span>
                      <strong>
                        {patient.latestProblem || "No medical problem"}
                      </strong>
                    </div>
                  </div>
                </div>

                <button
                  className="view-patient-btn"
                  onClick={() => navigate(`/doctor/patient/${patient._id}`)}
                >
                  View Patient Details
                  <FaArrowRight />
                </button>
              </article>
            ))
          )}
        </section>
      </section>
    </div>
  );
}

export default DoctorDashboard;

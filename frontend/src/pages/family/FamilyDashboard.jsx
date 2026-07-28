import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/family/FamilyDashboard.css";

import {
  FaUserAlt,
  FaBed,
  FaHeartbeat,
  FaCalendarAlt,
  FaDonate,
  FaArrowRight,
  FaUserFriends,
  FaNotesMedical,
} from "react-icons/fa";

function FamilyDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

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
        }
      );

      setDashboard(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="family-dashboard">

      {/* HERO */}

      <section className="family-hero">

        <div>

          <p className="family-label">
            Family Portal
          </p>

          <h1>
            Welcome, {user?.name || "Family Member"} 👋
          </h1>

          <span>
            Stay connected with your loved one and keep track
            of their care, health and daily activities.
          </span>

        </div>

        <div className="family-hero-icon">
          <FaUserFriends />
        </div>

      </section>


      {/* SUMMARY CARDS */}

      <section className="family-dashboard-cards">

        <div className="family-dashboard-card resident-card">

          <div className="family-card-icon">
            <FaUserAlt />
          </div>

          <div>
            <span>Resident</span>

            <h2>
              {dashboard.resident.name || "-"}
            </h2>

            <p>Your loved one</p>
          </div>

        </div>


        <div className="family-dashboard-card room-card">

          <div className="family-card-icon">
            <FaBed />
          </div>

          <div>
            <span>Room</span>

            <h2>
              {dashboard.resident.room || "-"}
            </h2>

            <p>Assigned room</p>
          </div>

        </div>


        <div className="family-dashboard-card medical-card">

          <div className="family-card-icon">
            <FaHeartbeat />
          </div>

          <div>
            <span>Medical Records</span>

            <h2>
              {dashboard.medicalCount}
            </h2>

            <p>Total health records</p>
          </div>

        </div>


        <div className="family-dashboard-card event-card">

          <div className="family-card-icon">
            <FaCalendarAlt />
          </div>

          <div>
            <span>Upcoming Events</span>

            <h2>
              {dashboard.eventCount}
            </h2>

            <p>Activities scheduled</p>
          </div>

        </div>

      </section>


      {/* MAIN GRID */}

      <section className="family-main-grid">

        {/* RESIDENT PROFILE */}

        <div className="family-panel resident-panel">

          <div className="family-panel-header">

            <div>

              <p>Resident Overview</p>

              <h2>Resident Profile</h2>

            </div>

            <FaUserAlt />

          </div>


          <div className="resident-profile-modern">

            <div className="resident-avatar-large">
              {dashboard.resident.gender?.toLowerCase() === "male"
                ? "👴"
                : "👵"}
            </div>

            <div className="resident-primary-info">

              <h3>
                {dashboard.resident.name || "Resident"}
              </h3>

              <span>
                Kinetic Care Resident
              </span>

            </div>

          </div>


          <div className="resident-info-grid">

            <div>
              <span>Age</span>
              <strong>
                {dashboard.resident.age || "-"}
              </strong>
            </div>

            <div>
              <span>Gender</span>
              <strong>
                {dashboard.resident.gender || "-"}
              </strong>
            </div>

            <div>
              <span>Room</span>
              <strong>
                {dashboard.resident.room || "-"}
              </strong>
            </div>

          </div>

        </div>


        {/* LATEST MEDICAL */}

        <div className="family-panel medical-panel">

          <div className="family-panel-header">

            <div>

              <p>Latest Health Update</p>

              <h2>Medical Record</h2>

            </div>

            <FaNotesMedical />

          </div>


          {dashboard.latestMedical?.problem ? (

            <div className="latest-medical-card">

              <div className="medical-doctor-row">

                <div className="medical-doctor-avatar">
                  🩺
                </div>

                <div>
                  <span>Doctor</span>

                  <strong>
                    Dr.{" "}
                    {dashboard.latestMedical?.staffId?.name ||
                      "Not Assigned"}
                  </strong>
                </div>

              </div>


              <div className="medical-mini-grid">

                <div>
                  <span>Problem</span>

                  <strong>
                    {dashboard.latestMedical.problem || "-"}
                  </strong>
                </div>

                <div>
                  <span>Medicine</span>

                  <strong>
                    {dashboard.latestMedical.medicine || "-"}
                  </strong>
                </div>

              </div>


              <div className="medical-date">

                <span>Last Updated</span>

                <strong>
                  {dashboard.latestMedical?.date
                    ? new Date(
                        dashboard.latestMedical.date
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </strong>

              </div>

            </div>

          ) : (

            <div className="family-empty-state">
              No medical record available
            </div>

          )}

        </div>


        {/* EVENT SUMMARY */}

        <div className="family-panel event-panel">

          <div className="family-panel-header">

            <div>

              <p>Community Activities</p>

              <h2>Upcoming Events</h2>

            </div>

            <FaCalendarAlt />

          </div>


          <div className="event-summary">

            <div className="event-summary-number">
              {dashboard.eventCount}
            </div>

            <div>
              <h3>
                Upcoming Events
              </h3>

              <p>
                Activities and celebrations scheduled
                for residents.
              </p>
            </div>

          </div>

        </div>


        {/* QUICK ACTIONS */}

        <div className="family-panel quick-panel">

          <div className="family-panel-header">

            <div>

              <p>Quick Access</p>

              <h2>Quick Actions</h2>

            </div>

          </div>


          <div className="family-quick-actions">

            <button
              onClick={() =>
                navigate("/family/book-visit")
              }
            >

              <span className="quick-action-icon visit-action">
                <FaCalendarAlt />
              </span>

              <div>
                <strong>Book Visit</strong>
                <small>
                  Schedule a visit with your loved one
                </small>
              </div>

              <FaArrowRight className="quick-arrow" />

            </button>


            <button
              onClick={() =>
                navigate("/family/donate")
              }
            >

              <span className="quick-action-icon donate-action">
                <FaDonate />
              </span>

              <div>
                <strong>Donate</strong>
                <small>
                  Support Kinetic Care residents
                </small>
              </div>

              <FaArrowRight className="quick-arrow" />

            </button>


            <button
              onClick={() =>
                navigate("/family/medical-history")
              }
            >

              <span className="quick-action-icon history-action">
                <FaHeartbeat />
              </span>

              <div>
                <strong>Medical History</strong>
                <small>
                  View complete health records
                </small>
              </div>

              <FaArrowRight className="quick-arrow" />

            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default FamilyDashboard;
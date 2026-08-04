import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/caretaker/Profile.css";
import { useNavigate } from "react-router-dom";

import {
  FaUserNurse,
  FaEnvelope,
  FaPhoneAlt,
  FaBriefcaseMedical,
  FaClock,
  FaArrowLeft,
  FaSignOutAlt,
} from "react-icons/fa";

function Profile() {
  const [caretaker, setCaretaker] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/caretaker/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCaretaker(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="caretaker-profile-page">
      {/* TOP BAR */}

      <div className="profile-topbar">
        <button
          className="caretaker-back-btn"
          onClick={() => navigate("/caretaker/dashboard")}
        >
          <FaArrowLeft />
          Dashboard
        </button>

        {/* HEADER */}

        <div className="profile-heading">
          <p>Caretaker Portal</p>

          <h1>My Profile</h1>

          <span>View your personal and professional information</span>
        </div>

        <button className="profile-logout-btn" onClick={logout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* MAIN PROFILE */}

      <div className="caretaker-profile-container">
        {/* PROFILE SUMMARY */}

        <div className="caretaker-profile-summary">
          <div className="profile-avatar-large">
            <FaUserNurse />
          </div>

          <h2>{caretaker.name || "CareTaker"}</h2>

          <span className="caretaker-role">
            {caretaker.role || "CareTaker"}
          </span>

          <span className="caretaker-role">{caretaker.gender || "Gender"}</span>
        </div>

        {/* DETAILS */}

        <div className="caretaker-profile-details">
          <div className="details-header">
            <div>
              <p>Personal Information</p>

              <h2>Profile Details</h2>
            </div>

            <span className="verified-badge">Verified Profile</span>
          </div>

          <div className="profile-details-grid">
            <div className="profile-detail-card">
              <div className="detail-icon">
                <FaUserNurse />
              </div>

              <div>
                <span>Full Name</span>

                <strong>{caretaker.name || "Not Available"}</strong>
              </div>
            </div>

            <div className="profile-detail-card">
              <div className="detail-icon email-icon">
                <FaEnvelope />
              </div>

              <div>
                <span>Email Address</span>

                <strong>{caretaker.email || "Not Available"}</strong>
              </div>
            </div>

            <div className="profile-detail-card">
              <div className="detail-icon phone-icon">
                <FaPhoneAlt />
              </div>

              <div>
                <span>Phone Number</span>

                <strong>{caretaker.phone || "Not Available"}</strong>
              </div>
            </div>

            <div className="profile-detail-card">
              <div className="detail-icon role-icon">
                <FaBriefcaseMedical />
              </div>

              <div>
                <span>Role</span>

                <strong>{caretaker.role || "CareTaker"}</strong>
              </div>
            </div>

            <div className="profile-detail-card full-detail-card">
              <div className="detail-icon shift-icon">
                <FaClock />
              </div>

              <div>
                <span>Assigned Shift</span>

                <strong>{caretaker.shift || "Not Assigned"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

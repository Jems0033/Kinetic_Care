import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaUsers,
  FaSignOutAlt,
  FaArrowLeft
} from "react-icons/fa";

import "../../css/family/FamilyProfile.css";

function FamilyProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    relation: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/family/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  if (loading) {
    return <div className="family-profile-loading">Loading profile...</div>;
  }

  return (
    <div className="family-profile-page">
      <div className="family-profile-container">
        <div className="family-profile-header">
          <button
            className="family-back-btn"
            onClick={() => navigate("/family/dashboard")}
          >
            <FaArrowLeft />
            Dashboard
          </button>
          <div className="family-detail-header">
            <p>Family Portal</p>
            <h1>My Profile</h1>
            <span>View and manage your personal information.</span>
          </div>

          <button className="family-logout-btn" onClick={logout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {message && <div className="family-profile-message">{message}</div>}

        <div className="family-profile-card">
          <div className="family-profile-avatar">
            {profile.name?.charAt(0).toUpperCase() || "F"}
          </div>

          <div className="family-profile-name">
            <h2>{profile.name || "Family Member"}</h2>
            <p>Kinetic Care Family Member</p>
          </div>

          <div className="family-profile-details">
            <div className="family-profile-field">
              <div className="profile-field-icon">
                <FaUserCircle />
              </div>

              <div>
                <span>Full Name</span>
                <strong>{profile.name || "-"}</strong>
              </div>
            </div>

            <div className="family-profile-field">
              <div className="profile-field-icon">
                <FaEnvelope />
              </div>

              <div>
                <span>Email Address</span>
                <strong>{profile.email || "-"}</strong>
              </div>
            </div>

            <div className="family-profile-field">
              <div className="profile-field-icon">
                <FaPhone />
              </div>

              <div>
                <span>Phone Number</span>
                <strong>{profile.phone || "-"}</strong>
              </div>
            </div>

            <div className="family-profile-field">
              <div className="profile-field-icon">
                <FaUsers />
              </div>

              <div>
                <span>Relation With Resident</span>
                <strong>{profile.relation || "-"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FamilyProfile;

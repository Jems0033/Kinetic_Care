import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/doctor/DoctorProfile.css";
import { useNavigate } from "react-router-dom";

import {
  FaUserMd,
  FaEnvelope,
  FaPhoneAlt,
  FaBriefcaseMedical,
  FaClock,
  FaArrowLeft,
  FaSignOutAlt,
} from "react-icons/fa";

function DoctorProfile() {
  const [doctor, setDoctor] = useState({});
  const [showLeaveModal, setShowLeaveModal] = useState(false);

const [leaveForm, setLeaveForm] = useState({
  fromDate: "",
  toDate: "",
  reason: "",
});

const [leaveMessage, setLeaveMessage] = useState("");
const [leaveLoading, setLeaveLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/doctor/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDoctor(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveChange = (event) => {
  const { name, value } = event.target;

  setLeaveForm((previous) => ({
    ...previous,
    [name]: value,
  }));
};

  const submitLeaveRequest = async (event) => {
    event.preventDefault();

    try {
      setLeaveLoading(true);
      setLeaveMessage("");

      const token = localStorage.getItem("token");

      const res = await axios.post(
  "http://localhost:5000/api/doctor/leave/apply",
  leaveForm,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      setLeaveMessage(
        res.data.message || "Leave request submitted successfully",
      );

      setLeaveForm({
        fromDate: "",
        toDate: "",
        reason: "",
      });

      setTimeout(() => {
        setShowLeaveModal(false);
        setLeaveMessage("");
      }, 1200);
    } catch (error) {
      setLeaveMessage(
        error.response?.data?.message ||
        "Unable to submit leave request",
      );
    } finally {
      setLeaveLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="doctor-profile-page">
      {/* TOP BAR */}

      <div className="doctor-profile-topbar">
        <button
          className="doctor-back-btn"
          onClick={() => navigate("/doctor/dashboard")}
        >
          <FaArrowLeft />
          Dashboard
        </button>

        <div className="doctor-profile-heading">
          <p>Doctor Portal</p>

          <h1>My Profile</h1>

          <span>View your personal and professional information</span>
        </div>

        <button className="doctor-profile-logout-btn" onClick={logout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* MAIN PROFILE */}

      <div className="doctor-profile-container">
        {/* PROFILE SUMMARY */}

        <div className="doctor-profile-summary">
          <div className="profile-avatar-large">
            <FaUserMd />
          </div>

          <h2>Dr. {doctor.name || "Doctor"}</h2>

          <span className="doctor-role">{doctor.role || "Doctor"}</span>

          <p>Kinetic Care Medical Team</p>

          <div className="profile-status">
            <span></span>
            Active
          </div>
          <button
  type="button"
  className="doctor-leave-btn"
  onClick={() => setShowLeaveModal(true)}
>
  Apply for Leave
</button>
        </div>

        {/* DETAILS */}

        <div className="doctor-profile-details">
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
                <FaUserMd />
              </div>

              <div>
                <span>Full Name</span>

                <strong>Dr. {doctor.name || "Not Available"}</strong>
              </div>
            </div>

            <div className="profile-detail-card">
              <div className="detail-icon email-icon">
                <FaEnvelope />
              </div>

              <div>
                <span>Email Address</span>

                <strong>{doctor.email || "Not Available"}</strong>
              </div>
            </div>

            <div className="profile-detail-card">
              <div className="detail-icon phone-icon">
                <FaPhoneAlt />
              </div>

              <div>
                <span>Phone Number</span>

                <strong>{doctor.phone || "Not Available"}</strong>
              </div>
            </div>

            <div className="profile-detail-card">
              <div className="detail-icon role-icon">
                <FaBriefcaseMedical />
              </div>

              <div>
                <span>Role</span>

                <strong>{doctor.role || "Doctor"}</strong>
              </div>
            </div>

            <div className="profile-detail-card full-detail-card">
              <div className="detail-icon shift-icon">
                <FaClock />
              </div>

              <div>
                <span>Assigned Shift</span>

                <strong>{doctor.shift || "Not Assigned"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLeaveModal && (
        <div
          className="leave-modal-overlay"
          onMouseDown={() => setShowLeaveModal(false)}
        >
          <div
            className="leave-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="leave-modal-header">
              <div>
                <p>Leave Management</p>
                <h2>Apply for Leave</h2>
              </div>

              <button type="button" onClick={() => setShowLeaveModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={submitLeaveRequest}>
              <div className="leave-date-grid">
                <div className="leave-field">
                  <label htmlFor="fromDate">From Date</label>

                  <input
                    id="fromDate"
                    type="date"
                    name="fromDate"
                    value={leaveForm.fromDate}
                    onChange={handleLeaveChange}
                    required
                  />
                </div>

                <div className="leave-field">
                  <label htmlFor="toDate">To Date</label>

                  <input
                    id="toDate"
                    type="date"
                    name="toDate"
                    value={leaveForm.toDate}
                    onChange={handleLeaveChange}
                    // min={leaveForm.fromDate || minimumLeaveDate}
                    required
                  />
                </div>
              </div>

              <div className="leave-field">
                <label htmlFor="reason">Reason</label>

                <textarea
                  id="reason"
                  name="reason"
                  value={leaveForm.reason}
                  onChange={handleLeaveChange}
                  placeholder="Enter your leave reason"
                  maxLength={300}
                  rows={4}
                  required
                />
              </div>

              {leaveMessage && (
                <div className="leave-message">{leaveMessage}</div>
              )}

              <div className="leave-modal-actions">
                <button
                  type="button"
                  className="leave-cancel-btn"
                  onClick={() => setShowLeaveModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="leave-submit-btn"
                  disabled={leaveLoading}
                >
                  {leaveLoading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorProfile;

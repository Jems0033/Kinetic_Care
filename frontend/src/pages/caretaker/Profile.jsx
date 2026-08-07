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

  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const [leaveForm, setLeaveForm] = useState({
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [leaveMessage, setLeaveMessage] = useState("");
  const [leaveLoading, setLeaveLoading] = useState(false);

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
        "http://localhost:5000/api/caretaker/leave/apply",
        leaveForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
  const tomorrowDate = new Date();

tomorrowDate.setDate(tomorrowDate.getDate() + 1);

const minimumLeaveDate = tomorrowDate
  .toISOString()
  .split("T")[0];
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

          <button
            type="button"
            className="caretaker-leave-btn"
            onClick={() => setShowLeaveModal(true)}
          >
            Apply for Leave
          </button>
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

              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
              >
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
                <div className="leave-message">
                  {leaveMessage}
                </div>
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

export default Profile;

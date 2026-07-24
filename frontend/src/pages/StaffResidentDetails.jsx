import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaUser,
  FaBirthdayCake,
  FaVenusMars,
  FaTint,
  FaDoorOpen,
  FaHeartbeat,
  FaPhoneAlt,
  FaPills,
  FaNotesMedical,
  FaUtensils,
  FaBath,
  FaWalking,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaHistory,
} from "react-icons/fa";

import "../css/StaffResidentDetails.css";

function StaffResidentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [resident, setResident] = useState(null);
  const [staffRole, setStaffRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResidentDetails();
    getLoggedInStaffRole();
  }, [id]);

  const getLoggedInStaffRole = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/staff/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStaffRole(response.data.role);
    } catch (error) {
      console.log("Staff role error:", error);
    }
  };

  const fetchResidentDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/staff/resident/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResident(response.data.resident);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Resident details load thai shaki nahi."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRoomNumber = () => {
    if (!resident?.room) {
      return "Not Assigned";
    }

    if (typeof resident.room === "object") {
      return resident.room.roomNumber || "Not Assigned";
    }

    return resident.room;
  };

  const getRoomType = () => {
    if (
      resident?.room &&
      typeof resident.room === "object"
    ) {
      return resident.room.roomType || "N/A";
    }

    return "N/A";
  };

  const renderRoleActions = () => {
    switch (staffRole?.toLowerCase()) {
      case "nurse":
        return (
          <>
            <button className="staff-action-card nurse-action"  onClick={() => navigate(`/staff/resident/${id}/vitals`)}>
              <FaHeartbeat />

              <div>
                <h3>Update Vitals</h3>
                <p>Update BP, sugar, pulse and temperature.</p>
              </div>
            </button>

            <button className="staff-action-card nurse-action" onClick={() => navigate(`/staff/resident/${id}/medicine`)}>
              <FaPills />

              <div>
                <h3>Medicine Given</h3>
                <p>Mark resident medicine as completed.</p>
              </div>
            </button>

            <button className="staff-action-card nurse-action" onClick={() => navigate(`/staff/resident/${id}/history`)}>
              <FaNotesMedical />

              <div>
                <h3>Medical History</h3>
                <p>View previous medical records.</p>
              </div>
            </button>
          </>
        );

      case "caretaker":
        return (
          <>
            <button className="staff-action-card caretaker-action">
              <FaUtensils />

              <div>
                <h3>Meal Status</h3>
                <p>Update breakfast, lunch and dinner status.</p>
              </div>
            </button>

            <button className="staff-action-card caretaker-action">
              <FaBath />

              <div>
                <h3>Daily Care</h3>
                <p>Update bath and personal care status.</p>
              </div>
            </button>

            <button className="staff-action-card caretaker-action">
              <FaWalking />

              <div>
                <h3>Exercise</h3>
                <p>Mark daily walking or exercise completed.</p>
              </div>
            </button>
          </>
        );

      case "receptionist":
        return (
          <>
            <button className="staff-action-card receptionist-action">
              <FaUsers />

              <div>
                <h3>Visitor Details</h3>
                <p>View visitors registered for this resident.</p>
              </div>
            </button>

            <button className="staff-action-card receptionist-action">
              <FaCalendarAlt />

              <div>
                <h3>Upcoming Visits</h3>
                <p>Check upcoming family visit requests.</p>
              </div>
            </button>
          </>
        );

      case "manager":
        return (
          <>
            <button className="staff-action-card manager-action">
              <FaChartBar />

              <div>
                <h3>Resident Report</h3>
                <p>View resident health and care report.</p>
              </div>
            </button>

            <button className="staff-action-card manager-action">
              <FaHistory />

              <div>
                <h3>Resident History</h3>
                <p>View complete resident activity history.</p>
              </div>
            </button>
          </>
        );

      default:
        return (
          <div className="no-actions-message">
            Tamara role mate koi action available nathi.
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="staff-details-status">
        <div className="staff-details-loader"></div>
        <p>Resident details loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-details-status">
        <h3>{error}</h3>

        <button onClick={() => navigate("/staff/residents")}>
          Back to Residents
        </button>
      </div>
    );
  }

  if (!resident) {
    return null;
  }

  return (
    <div className="staff-resident-details-page">
      <div className="staff-resident-details-header">
        <button
          className="staff-details-back-btn"
          onClick={() => navigate("/staff/residents")}
        >
          <FaArrowLeft />
          Back
        </button>

        <div>
          <h1>Resident Details</h1>
          <p>View resident profile and perform assigned actions</p>
        </div>

        <div className="staff-role-display">
          <span>Logged in as</span>
          <strong>{staffRole || "Staff"}</strong>
        </div>
      </div>

      <section className="staff-resident-profile">
        <div className="staff-resident-avatar">
          {resident.name
            ? resident.name.charAt(0).toUpperCase()
            : "R"}
        </div>

        <div className="staff-resident-profile-content">
          <div>
            <h2>{resident.name}</h2>

            <p>
              Room {getRoomNumber()} •{" "}
              {resident.status || "Active"}
            </p>
          </div>

          <span className="resident-active-badge">
            {resident.status || "Active"}
          </span>
        </div>
      </section>

      <div className="staff-resident-information-grid">
        <div className="staff-information-card">
          <div className="staff-info-heading">
            <FaUser />
            <h3>Personal Information</h3>
          </div>

          <div className="staff-info-list">
            <div className="staff-info-item">
              <FaBirthdayCake />

              <div>
                <span>Age</span>
                <strong>
                  {resident.age
                    ? `${resident.age} Years`
                    : "N/A"}
                </strong>
              </div>
            </div>

            <div className="staff-info-item">
              <FaVenusMars />

              <div>
                <span>Gender</span>
                <strong>{resident.gender || "N/A"}</strong>
              </div>
            </div>

            <div className="staff-info-item">
              <FaTint />

              <div>
                <span>Blood Group</span>
                <strong>{resident.bloodGroup || "N/A"}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="staff-information-card">
          <div className="staff-info-heading">
            <FaDoorOpen />
            <h3>Room Information</h3>
          </div>

          <div className="staff-info-list">
            <div className="staff-info-item">
              <FaDoorOpen />

              <div>
                <span>Room Number</span>
                <strong>{getRoomNumber()}</strong>
              </div>
            </div>

            <div className="staff-info-item">
              <FaDoorOpen />

              <div>
                <span>Room Type</span>
                <strong>{getRoomType()}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="staff-information-card">
          <div className="staff-info-heading">
            <FaHeartbeat />
            <h3>Health Information</h3>
          </div>

          <div className="staff-info-list">
            <div className="staff-info-item">
              <FaHeartbeat />

              <div>
                <span>Medical Condition</span>
                <strong>
                  {resident.medicalCondition ||
                    "No condition recorded"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="staff-information-card">
          <div className="staff-info-heading">
            <FaPhoneAlt />
            <h3>Emergency Contact</h3>
          </div>

          <div className="staff-info-list">
            <div className="staff-info-item">
              <FaUser />

              <div>
                <span>Contact Person</span>
                <strong>
                  {resident.emergencyContactName ||
                    resident.guardianName ||
                    "N/A"}
                </strong>
              </div>
            </div>

            <div className="staff-info-item">
              <FaPhoneAlt />

              <div>
                <span>Phone Number</span>
                <strong>
                  {resident.emergencyContact ||
                    resident.phone ||
                    "N/A"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="staff-role-actions-section">
        <div className="staff-section-heading">
          <div>
            <h2>{staffRole || "Staff"} Actions</h2>
            <p>
              Tamara role pramane available operations
            </p>
          </div>
        </div>

        <div className="staff-role-actions-grid">
          {renderRoleActions()}
        </div>
      </section>
    </div>
  );
}

export default StaffResidentDetails;
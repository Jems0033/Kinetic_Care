import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/family/BookVisit.css";

import {
  FaArrowLeft,
  FaUserFriends,
  FaPhoneAlt,
  FaHeart,
  FaCalendarAlt,
  FaCommentDots,
  FaCheckCircle,
} from "react-icons/fa";

const BookVisit = () => {
  const navigate = useNavigate();

  // =========================
  // FORM DATA
  // =========================

  const [formData, setFormData] = useState({
    visitorName: "",
    phone: "",
    relation: "",
    purpose: "",
    visitDate: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // CUSTOM ALERT
  // =========================

  const [alertBox, setAlertBox] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showAlert = (message, type = "success") => {
    setAlertBox({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setAlertBox({
        show: false,
        message: "",
        type: "",
      });
    }, 3000);
  };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone ma only numbers allow
    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");

      setFormData({
        ...formData,
        phone: onlyNumbers,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =========================
  // VALIDATION
  // =========================

  const validateVisit = () => {
    // Visitor Name
    if (!formData.visitorName.trim()) {
      return "Visitor name is required.";
    }

    if (formData.visitorName.trim().length < 3) {
      return "Visitor name must be at least 3 characters.";
    }

    if (!/^[a-zA-Z\s]+$/.test(formData.visitorName.trim())) {
      return "Visitor name should contain only letters.";
    }

    // Phone
    if (!formData.phone.trim()) {
      return "Phone number is required.";
    }

    if (!/^[6-9][0-9]{9}$/.test(formData.phone.trim())) {
      return "Please enter a valid 10-digit phone number.";
    }

    // Relation
    if (!formData.relation.trim()) {
      return "Relation is required.";
    }

    if (formData.relation.trim().length < 2) {
      return "Please enter a valid relation.";
    }

    if (!/^[a-zA-Z\s]+$/.test(formData.relation.trim())) {
      return "Relation should contain only letters.";
    }

    // Visit Date
    if (!formData.visitDate) {
      return "Visit date is required.";
    }

    const selectedDate = new Date(`${formData.visitDate}T00:00:00`);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "Visit date cannot be in the past.";
    }

    // Purpose
    if (!formData.purpose.trim()) {
      return "Purpose of visit is required.";
    }

    if (formData.purpose.trim().length < 10) {
      return "Purpose must be at least 10 characters.";
    }

    if (formData.purpose.trim().length > 500) {
      return "Purpose cannot exceed 500 characters.";
    }

    return null;
  };

  // =========================
  // BACKEND ERROR MESSAGE
  // =========================

  const getErrorMessage = (error) => {
    const msg = error.response?.data?.message || "";

    switch (msg) {
      case "Resident Not Found":
        return "Resident information was not found.";

      case "Family Member Not Found":
        return "Family member account was not found.";

      case "Visit Already Booked":
        return "A visit is already booked for this date.";

      case "Unable to Book Visit":
        return "Unable to book the visit.";

      default:
        return msg || "Something went wrong. Please try again.";
    }
  };

  // =========================
  // SUBMIT VISIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Validation
    const validationError = validateVisit();

    if (validationError) {
      return showAlert(validationError, "error");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        visitorName: formData.visitorName.trim(),
        phone: formData.phone.trim(),
        relation: formData.relation.trim(),
        purpose: formData.purpose.trim(),
        visitDate: formData.visitDate,
      };

      const res = await axios.post(
        "http://localhost:5000/api/visitors/book",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Success Alert
      showAlert(res.data.message || "Visit booked successfully.", "success");

      // Clear Form
      setFormData({
        visitorName: "",
        phone: "",
        relation: "",
        purpose: "",
        visitDate: "",
      });

      // Navigate after success message
      setTimeout(() => {
        navigate("/family-dashboard");
      }, 1200);
    } catch (error) {
      console.log("Book Visit Error:", error.response?.data);

      showAlert(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TODAY DATE
  // =========================

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <div className="book-visit-page">
      {/* =========================
          CUSTOM ALERT
      ========================= */}

      {alertBox.show && (
        <div className={`order-banner ${alertBox.type} show`}>
          <div className="order-banner-icon">
            {alertBox.type === "success" ? "✔" : "✖"}
          </div>

          <div>
            <div className="order-banner-title">
              {alertBox.type === "success" ? "Success" : "Error"}
            </div>

            <div className="order-banner-detail">{alertBox.message}</div>
          </div>

          <button
            type="button"
            className="order-banner-close"
            onClick={() =>
              setAlertBox({
                show: false,
                message: "",
                type: "",
              })
            }
          >
            ×
          </button>
        </div>
      )}

      <div className="book-visit-container">
        {/* =========================
            LEFT INFO
        ========================= */}

        <div className="visit-info-panel">
          <button
            type="button"
            className="visit-back-btn"
            onClick={() => navigate("/family-dashboard")}
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="visit-info-content">
            <div className="visit-main-icon">
              <FaUserFriends />
            </div>

            <p className="visit-label">Family Visit</p>

            <h1>Spend meaningful time with your loved one.</h1>

            <p className="visit-description">
              Schedule your visit in advance and help us provide a comfortable
              experience for residents and their families.
            </p>

            <div className="visit-guidelines">
              <div>
                <FaCheckCircle />

                <span>Enter accurate visitor information</span>
              </div>

              <div>
                <FaCheckCircle />

                <span>Select your preferred visit date</span>
              </div>

              <div>
                <FaCheckCircle />

                <span>Mention the purpose of your visit</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            FORM
        ========================= */}

        <div className="visit-form-panel">
          <div className="visit-form-header">
            <p>Visit Scheduling</p>

            <h2>Book a Visit</h2>

            <span>Fill in the details below to schedule your visit.</span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="visit-form-grid">
              {/* VISITOR NAME */}

              <div className="visit-form-group">
                <label>Visitor Name</label>

                <div className="visit-input-box">
                  <FaUserFriends />

                  <input
                    type="text"
                    name="visitorName"
                    placeholder="Enter visitor name"
                    value={formData.visitorName}
                    onChange={handleChange}
                    maxLength={50}
                  />
                </div>
              </div>

              {/* PHONE */}

              <div className="visit-form-group">
                <label>Phone Number</label>

                <div className="visit-input-box">
                  <FaPhoneAlt />

                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    inputMode="numeric"
                  />
                </div>
              </div>

              {/* RELATION */}

              <div className="visit-form-group">
                <label>Relation</label>

                <div className="visit-input-box">
                  <FaHeart />

                  <input
                    type="text"
                    name="relation"
                    placeholder="Example: Son, Daughter"
                    value={formData.relation}
                    onChange={handleChange}
                    maxLength={30}
                  />
                </div>
              </div>

              {/* VISIT DATE */}

              <div className="visit-form-group">
                <label>Visit Date</label>

                <div className="visit-input-box">
                  <FaCalendarAlt />

                  <input
                    type="date"
                    name="visitDate"
                    value={formData.visitDate}
                    onChange={handleChange}
                    min={todayDate}
                  />
                </div>
              </div>

              {/* PURPOSE */}

              <div className="visit-form-group full-width">
                <label>Purpose of Visit</label>

                <div className="visit-textarea-box">
                  <FaCommentDots />

                  <textarea
                    name="purpose"
                    rows="5"
                    placeholder="Tell us the purpose of your visit..."
                    value={formData.purpose}
                    onChange={handleChange}
                    maxLength={500}
                  />
                </div>
              </div>
            </div>

            {/* =========================
                ACTION BUTTONS
            ========================= */}

            <div className="visit-form-actions">
              <button
                type="button"
                className="visit-cancel-btn"
                onClick={() => navigate("/family-dashboard")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="visit-submit-btn"
                disabled={loading}
              >
                {loading ? "Booking Visit..." : "Book Visit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookVisit;

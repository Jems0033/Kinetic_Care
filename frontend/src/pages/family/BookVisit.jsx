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

  const [formData, setFormData] = useState({
    visitorName: "",
    phone: "",
    relation: "",
    purpose: "",
    visitDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/visitors/book",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      setFormData({
        visitorName: "",
        phone: "",
        relation: "",
        purpose: "",
        visitDate: "",
      });

      navigate("/family-dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-visit-page">

      <div className="book-visit-container">

        {/* LEFT INFO */}

        <div className="visit-info-panel">

          <button
            className="visit-back-btn"
            onClick={() => navigate("/family-dashboard")}
          >
            <FaArrowLeft />
            Dashboard
          </button>

          <div className="visit-info-content">

            <div className="visit-main-icon">
              <FaUserFriends />
            </div>

            <p className="visit-label">
              Family Visit
            </p>

            <h1>
              Spend meaningful time with your loved one.
            </h1>

            <p className="visit-description">
              Schedule your visit in advance and help us
              provide a comfortable experience for residents
              and their families.
            </p>

            <div className="visit-guidelines">

              <div>
                <FaCheckCircle />

                <span>
                  Enter accurate visitor information
                </span>
              </div>

              <div>
                <FaCheckCircle />

                <span>
                  Select your preferred visit date
                </span>
              </div>

              <div>
                <FaCheckCircle />

                <span>
                  Mention the purpose of your visit
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* FORM */}

        <div className="visit-form-panel">

          <div className="visit-form-header">

            <p>Visit Scheduling</p>

            <h2>Book a Visit</h2>

            <span>
              Fill in the details below to schedule your visit.
            </span>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="visit-form-grid">

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
                    required
                  />

                </div>

              </div>


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
                    required
                  />

                </div>

              </div>


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
                    required
                  />

                </div>

              </div>


              <div className="visit-form-group">

                <label>Visit Date</label>

                <div className="visit-input-box">

                  <FaCalendarAlt />

                  <input
                    type="date"
                    name="visitDate"
                    value={formData.visitDate}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


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
                    required
                  />

                </div>

              </div>

            </div>


            <div className="visit-form-actions">

              <button
                type="button"
                className="visit-cancel-btn"
                onClick={() =>
                  navigate("/family-dashboard")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="visit-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Booking Visit..."
                  : "Book Visit"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default BookVisit;
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/family/FamilyDonate.css";

import {
  FaArrowLeft,
  FaHeart,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaHandHoldingHeart,
} from "react-icons/fa";

function FamilyDonate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    amount: "",
    donationType: "",
    address: "",
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

      await axios.post(
        "http://localhost:5000/api/donors",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Thank You For Your Donation ❤️");

      setFormData({
        name: "",
        phone: "",
        email: "",
        amount: "",
        donationType: "",
        address: "",
      });
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to process donation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="family-donate-page">

      <div className="donation-container">

        {/* LEFT SIDE */}

        <div className="donation-info-panel">

          <button
            className="donation-back-btn"
            onClick={() => navigate("/family-dashboard")}
          >
            <FaArrowLeft />
            Dashboard
          </button>

          <div className="donation-info-content">

            <div className="donation-main-icon">
              <FaHandHoldingHeart />
            </div>

            <p className="donation-label">
              Make a Difference
            </p>

            <h1>
              Your kindness can bring comfort and happiness.
            </h1>

            <p className="donation-description">
              Every contribution helps us provide better care,
              healthy meals, medicines and meaningful activities
              for our residents.
            </p>

            <div className="donation-points">

              <div>
                <FaHeart />
                <span>Support elderly care</span>
              </div>

              <div>
                <FaHeart />
                <span>Help with food and medicines</span>
              </div>

              <div>
                <FaHeart />
                <span>Improve quality of life</span>
              </div>

            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="donation-form-panel">

          <div className="donation-form-header">

            <p>Donation Form</p>

            <h2>Support Kinetic Care</h2>

            <span>
              Fill in your details and make a contribution.
            </span>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="donation-form-grid">

              <div className="donation-form-group">

                <label>Full Name</label>

                <div className="donation-input-box">

                  <FaUser />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="donation-form-group">

                <label>Email Address</label>

                <div className="donation-input-box">

                  <FaEnvelope />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="donation-form-group">

                <label>Phone Number</label>

                <div className="donation-input-box">

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


              <div className="donation-form-group">

                <label>Amount</label>

                <div className="donation-input-box">

                  <FaRupeeSign />

                  <input
                    type="number"
                    name="amount"
                    min="1"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="donation-form-group full-width">

                <label>Donation Type</label>

                <select
                  name="donationType"
                  value={formData.donationType}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Donation Type
                  </option>

                  <option value="Money">
                    Money
                  </option>

                  <option value="Food">
                    Food
                  </option>

                  <option value="Medicine">
                    Medicine
                  </option>

                  <option value="Clothes">
                    Clothes
                  </option>
                </select>

              </div>


              <div className="donation-form-group full-width">

                <label>Address</label>

                <div className="donation-textarea-box">

                  <FaMapMarkerAlt />

                  <textarea
                    name="address"
                    rows="4"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>


            <div className="donation-actions">

              <button
                type="button"
                className="donation-cancel-btn"
                onClick={() => navigate("/family-dashboard")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="donation-submit-btn"
                disabled={loading}
              >
                <FaHeart />

                {loading
                  ? "Processing..."
                  : "Donate Now"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default FamilyDonate;
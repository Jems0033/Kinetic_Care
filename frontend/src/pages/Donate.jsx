import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Donate.css";

import {
  FaArrowLeft,
  FaHeart,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaHandHoldingHeart,
  FaUtensils,
  FaPills,
  FaTshirt,
} from "react-icons/fa";

function Donate() {
  const navigate = useNavigate();
  const location = useLocation();

  const fromFamilyDashboard = location.state?.from === "family/dashboard";

  const redirectPath = fromFamilyDashboard ? "/family/dashboard" : "/";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    amount: "",
    donationType: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");

      setFormData((previousData) => ({
        ...previousData,
        phone: onlyNumbers,
      }));

      return;
    }

    if (name === "amount") {
      const onlyNumbers = value.replace(/\D/g, "");

      setFormData((previousData) => ({
        ...previousData,
        amount: onlyNumbers,
      }));

      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const validateDonation = () => {
    if (!formData.name.trim()) {
      return "Full name is required.";
    }

    if (formData.name.trim().length < 3) {
      return "Full name must contain at least 3 characters.";
    }

    if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      return "Full name should contain only letters.";
    }

    if (!formData.phone.trim()) {
      return "Phone number is required.";
    }

    if (!/^[6-9][0-9]{9}$/.test(formData.phone.trim())) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!formData.amount) {
      return formData.donationType === "Money"
        ? "Donation amount is required."
        : "Donation quantity is required.";
    }

    const donationAmount = Number(formData.amount);

    if (Number.isNaN(donationAmount) || donationAmount <= 0) {
      return "Please enter a valid donation amount.";
    }

    if (donationAmount < 1) {
      return "Donation amount must be at least ₹1.";
    }

    if (!formData.donationType) {
      return "Please select a donation type.";
    }

    const value = Number(formData.amount);

    if (Number.isNaN(value) || value <= 0) {
      return formData.donationType === "Money"
        ? "Please enter a valid donation amount."
        : "Please enter a valid donation quantity.";
    }

    return null;
  };

  const getErrorMessage = (error) => {
    const message = error.response?.data?.message || "";

    switch (message) {
      case "Unable to Add Donor":
        return "Unable to process the donation.";

      case "Invalid Donation Amount":
        return "Please enter a valid donation amount.";

      case "User Not Found":
        return "Your account information was not found.";

      default:
        return message || "Something went wrong. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateDonation();

    if (validationError) {
      return showAlert(validationError, "error");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        amount: Number(formData.amount),
        donationType: formData.donationType,
        address: formData.address.trim(),
      };

      const response = await axios.post(
        "http://localhost:5000/api/donors",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      showAlert(
        response.data?.message || "Thank you for your donation ❤️",
        "success",
      );

      setFormData({
        name: "",
        phone: "",
        amount: "",
        donationType: "",
        address: "",
      });

      setTimeout(() => {
        navigate(redirectPath);
      }, 1200);
    } catch (error) {
      console.log("Donation Error:", error.response?.data || error);

      showAlert(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-page">
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

      <div className="donation-container">
        {/* LEFT SIDE */}

        <div className="donation-info-panel">
          {fromFamilyDashboard && (
            <button
              type="button"
              className="donation-back-btn"
              onClick={() => navigate("/family/dashboard")}
            >
              <FaArrowLeft />
              Dashboard
            </button>
          )}

          <div className="donation-info-content">
            <div className="donation-main-icon">
              <FaHandHoldingHeart />
            </div>

            <p className="donation-label">Make a Difference</p>

            <h1>Your kindness can bring comfort and happiness.</h1>

            <p className="donation-description">
              Every contribution helps us provide better care, healthy meals,
              medicines and meaningful activities for our residents.
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

            <span>Fill in your details and make a contribution.</span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
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
                    maxLength={50}
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
                    maxLength={10}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="donation-form-group">
                <label>
                  {formData.donationType === "Money" ? "Amount" : "Quantity"}
                </label>

                <div className="donation-input-box">
                  {formData.donationType === "Money" && <FaRupeeSign />}

                  {formData.donationType === "Food" && <FaUtensils />}

                  {formData.donationType === "Medicine" && <FaPills />}

                  {formData.donationType === "Clothes" && <FaTshirt />}

                  {!formData.donationType && <FaHandHoldingHeart />}

                  <input
                    type="text"
                    name="amount"
                    placeholder={
                      !formData.donationType
                        ? "Select donation type first"
                        : formData.donationType === "Money"
                          ? "Enter your amount"
                          : "Enter your quantity"
                    }
                    value={formData.amount}
                    onChange={handleChange}
                    maxLength={7}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="donation-form-group full-width">
                <label>Donation Type</label>

                <select
                  name="donationType"
                  value={formData.donationType}
                  onChange={handleChange}
                >
                  <option value="">Select Donation Type</option>

                  <option value="Money">Money</option>

                  <option value="Food">Food</option>

                  <option value="Medicine">Medicine</option>

                  <option value="Clothes">Clothes</option>
                </select>
              </div>

              <div className="donation-form-group full-width">
                <label>Address</label>

                <div className="donation-textarea-box">
                  <FaMapMarkerAlt />

                  <textarea
                    name="address"
                    rows="1"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    maxLength={200}
                  />
                </div>
              </div>
            </div>

            <div className="donation-actions">
              <button
                type="button"
                className="donation-cancel-btn"
                onClick={() => navigate(redirectPath)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="donation-submit-btn"
                disabled={loading}
              >
                <FaHeart />

                {loading ? "Processing..." : "Donate Now"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Donate;

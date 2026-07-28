import { useState } from "react";
import axios from "axios";
import "../css/PublicDonate.css";

import {
  FaHandHoldingHeart,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

function PublicDonate() {
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

      await axios.post(
        "http://localhost:5000/api/donors",
        formData
      );

      alert("Thank you for your generous donation ❤️");

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
          "Donation Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-donate-page">

      <div className="public-donate-wrapper">

        {/* LEFT SIDE */}

        <section className="public-donate-info">

          <div className="public-brand">

            <img
              src="/logo.png"
              alt="Kinetic Care"
            />

            <h2>
              Kinetic<span>Care</span>
            </h2>

          </div>

          <div className="public-donate-content">

            <div className="public-donate-icon">
              <FaHandHoldingHeart />
            </div>

            <p className="public-donate-label">
              Give With Love
            </p>

            <h1>
              A small contribution can make a big difference.
            </h1>

            <p className="public-donate-description">
              Your support helps us provide nutritious food,
              medicines, comfortable accommodation and better
              care for elderly residents.
            </p>

            <div className="public-benefits">

              <div>
                <FaHeart />
                <span>Support elderly healthcare</span>
              </div>

              <div>
                <FaHeart />
                <span>Provide healthy meals</span>
              </div>

              <div>
                <FaHeart />
                <span>Improve resident comfort</span>
              </div>

            </div>

          </div>

          <div className="public-trust-box">
            <strong>Thank you for supporting Kinetic Care.</strong>
            <span>Every contribution matters.</span>
          </div>

        </section>


        {/* RIGHT SIDE */}

        <section className="public-donate-form-section">

          <div className="public-form-header">

            <p>Donation Form</p>

            <h2>Make a Contribution</h2>

            <span>
              Complete the form below to support our residents.
            </span>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="public-form-grid">

              <div className="public-form-group">

                <label>Full Name</label>

                <div className="public-input-box">

                  <FaUser />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="public-form-group">

                <label>Email Address</label>

                <div className="public-input-box">

                  <FaEnvelope />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="public-form-group">

                <label>Phone Number</label>

                <div className="public-input-box">

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


              <div className="public-form-group">

                <label>Donation Amount</label>

                <div className="public-input-box">

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


              <div className="public-form-group full-width">

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


              <div className="public-form-group full-width">

                <label>Address</label>

                <div className="public-textarea-box">

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


            <button
              type="submit"
              className="public-donate-btn"
              disabled={loading}
            >
              <FaHeart />

              {loading
                ? "Processing..."
                : "Donate Now"}
            </button>

          </form>

        </section>

      </div>

    </div>
  );
}

export default PublicDonate;
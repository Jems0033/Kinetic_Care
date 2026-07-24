import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/auth/Login.css";

import {
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      if (res.data.user.role === "admin") {
        navigate("/dashboard");
      } else if (res.data.user.role === "family") {
        navigate("/family-dashboard");
      } else if (res.data.user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (res.data.user.role === "staff") {
        navigate("/staff-dashboard");
      } else {
        setError("Unauthorized User");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* LEFT SIDE */}

        <div className="login-brand-section">

          <div className="brand-decoration circle-one"></div>
          <div className="brand-decoration circle-two"></div>

          <div className="brand-content">

            <img
              src="/logo.png"
              alt="Kinetic Care"
              className="login-logo"
            />

            <p className="brand-label">
              Elderly Care Management
            </p>

            <h1>
              Care that feels
              <span> like family.</span>
            </h1>

            <p className="brand-description">
              Manage residents, healthcare, staff,
              visitors and daily activities from one
              secure platform.
            </p>

            <div className="brand-feature">

              <div className="feature-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>Secure & Reliable</strong>
                <span>
                  Your care management data stays protected
                </span>
              </div>

            </div>

          </div>

          <p className="brand-footer">
            Kinetic Care © 2026
          </p>

        </div>


        {/* RIGHT SIDE */}

        <div className="login-form-section">

          <div className="login-form-wrapper">

            <div className="mobile-logo">
              <img
                src="/logo.png"
                alt="Kinetic Care"
              />
            </div>

            <div className="login-heading">

              <p>Welcome Back</p>

              <h2>Login to Kinetic Care</h2>

              <span>
                Enter your credentials to access your account
              </span>

            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="input-group">

                <label>Email Address</label>

                <div className="modern-input">

                  <input
                    type="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <span>Email Address</span>

                </div>

              </div>


              <div className="input-group">

                <label>Password</label>

                <div className="modern-input password-modern">

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder=" "
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <span>Password</span>

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>


                <div className="forgot-row">

                  <button
                    type="button"
                    className="forgot-btn"
                    onClick={() =>
                      navigate("/forgot-password")
                    }
                  >
                    Forgot Password?
                  </button>

                </div>

              </div>


              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >

                <span>
                  {loading
                    ? "Signing In..."
                    : "Sign In"}
                </span>

                {!loading && <FaArrowRight />}

              </button>

            </form>


            <div className="login-security">

              <FaShieldAlt />

              <span>
                Secure access to Kinetic Care Management System
              </span>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
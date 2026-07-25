import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/auth/ForgotPassword.css";

function ForgotPassword() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        {
          email: formData.email,
          newPassword: formData.newPassword,
        }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Unable to reset password"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="forgot-page">

      <div className="forgot-card">

        <img
          src="/logo.png"
          alt="Kinetic Care"
          className="forgot-logo"
        />

        <p className="forgot-label">
          Account Recovery
        </p>

        <h1>Reset Password</h1>

        <span className="forgot-description">
          Enter your registered email and create a new password.
        </span>

        {error && (
          <div className="forgot-error">
            {error}
          </div>
        )}

        {message && (
          <div className="forgot-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="forgot-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter registered email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="forgot-group">
            <label>New Password</label>

            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="forgot-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="reset-btn"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Reset Password"}
          </button>

        </form>

        <button
          className="back-login"
          onClick={() => navigate("/login")}
        >
          ← Back to Login
        </button>

      </div>

    </div>
  );
}

export default ForgotPassword;
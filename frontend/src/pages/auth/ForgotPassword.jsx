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

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Send OTP
  // =========================

  const sendOTP = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await axios.post(
        "http://localhost:5000/api/users/send-reset-otp",
        {
          email: formData.email,
        },
      );

      setMessage(res.data.message);
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Verify OTP
  // =========================

  const verifyOTP = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await axios.post(
        "http://localhost:5000/api/users/verify-reset-otp",
        {
          email: formData.email,
          otp,
        },
      );

      setMessage(res.data.message);

      setStep(3);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Reset Password
  // =========================

  const resetPassword = async () => {
    setError("");
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/users/reset-password",
        {
          email: formData.email,
          otp,
          newPassword: formData.newPassword,
        },
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <img src="/logo.png" alt="Kinetic Care" className="forgot-logo" />

        <p className="forgot-label">Account Recovery</p>

        <h1>Forgot Password</h1>

        <span className="forgot-description">
          Reset your password securely using OTP verification.
        </span>

        {error && <div className="forgot-error">{error}</div>}

        {message && <div className="forgot-success">{message}</div>}

        {/* STEP 1 */}

        {step === 1 && (
          <>
            <div className="forgot-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter registered email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <button className="reset-btn" onClick={sendOTP} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <>
            <div className="forgot-group">
              <label>OTP</label>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              className="reset-btn"
              onClick={verifyOTP}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <>
            <div className="forgot-group">
              <label>New Password</label>

              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="forgot-group">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              className="reset-btn"
              onClick={resetPassword}
              disabled={loading}
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

        <button className="back-login" onClick={() => navigate("/login")}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../css/UpdateVitals.css";

function UpdateVitals() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    temperature: "",
    bloodPressure: "",
    pulse: "",
    sugarLevel: "",
    weight: "",
    notes: "",
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
        `http://localhost:5000/api/staff/resident/${id}/vitals`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      navigate(`/staff/resident/${id}`);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update vitals."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-vitals-page">
      <div className="vitals-card">

        <h1>❤️ Update Resident Vitals</h1>

        <p>
          Enter today's health details of the resident.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Temperature (°C)</label>

            <input
              type="number"
              step="0.1"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Blood Pressure</label>

            <input
              type="text"
              name="bloodPressure"
              placeholder="120/80"
              value={formData.bloodPressure}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Pulse</label>

            <input
              type="number"
              name="pulse"
              value={formData.pulse}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Sugar Level</label>

            <input
              type="number"
              name="sugarLevel"
              value={formData.sugarLevel}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Weight (Kg)</label>

            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Notes</label>

            <textarea
              rows="4"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Vitals"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default UpdateVitals;
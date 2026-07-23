import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../css/GiveMedicine.css";

function GiveMedicine() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    medicineName: "",
    dosage: "",
    time: "",
    status: "Given",
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
        `http://localhost:5000/api/staff/resident/${id}/medicine`,
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
          "Unable to save medicine record."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medicine-page">
      <div className="medicine-card">

        <h1>💊 Give Medicine</h1>

        <p>Record medicine details for the resident.</p>

        <form onSubmit={handleSubmit}>

          <div className="medicine-group">
            <label>Medicine Name</label>

            <input
              type="text"
              name="medicineName"
              value={formData.medicineName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="medicine-group">
            <label>Dosage</label>

            <input
              type="text"
              name="dosage"
              placeholder="500 mg"
              value={formData.dosage}
              onChange={handleChange}
              required
            />
          </div>

          <div className="medicine-group">
            <label>Time</label>

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="medicine-group">
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Given</option>
              <option>Pending</option>
            </select>
          </div>

          <div className="medicine-group">
            <label>Notes</label>

            <textarea
              rows="4"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="medicine-buttons">

            <button
              type="button"
              className="cancel-medicine-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-medicine-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Record"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default GiveMedicine;
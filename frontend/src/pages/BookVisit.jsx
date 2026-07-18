import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/BookVisit.css";

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
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-visit-page">
      <div className="book-visit-card">
        <h2>Book a Visit</h2>
        <p>
          Fill in the details below to schedule your visit with your family
          member.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Visitor Name</label>
            <input
              type="text"
              name="visitorName"
              value={formData.visitorName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Relation</label>
            <input
              type="text"
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Purpose</label>
            <textarea
              name="purpose"
              rows="4"
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Visit Date</label>
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Visit"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default BookVisit;
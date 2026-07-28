import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../css/caretaker/ResidentCare.css";

function ResidentCare() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resident, setResident] = useState(null);
  const [caretaker, setCaretaker] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [careData, setCareData] = useState({
    medicine: false,
    meal: false,
    bath: false,
    walking: false,
    water: false,
    rest: false,
    notes: "",
  });

  useEffect(() => {
    getResidentCare();
  }, [id]);

  const getResidentCare = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/caretaker/resident/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResident(res.data.resident);
      setCaretaker(res.data.caretaker || {});

      if (res.data.todayCare) {
        setCareData({
          medicine: res.data.todayCare.medicine || false,
          meal: res.data.todayCare.meal || false,
          bath: res.data.todayCare.bath || false,
          walking: res.data.todayCare.walking || false,
          water: res.data.todayCare.water || false,
          rest: res.data.todayCare.rest || false,
          notes: res.data.todayCare.notes || "",
        });
      }
    } catch (error) {
      console.log("Resident Care Error:", error);

      setMessage(
        error.response?.data?.message || "Unable to load resident details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;

    setCareData({
      ...careData,
      [name]: checked,
    });
  };

  const handleNotes = (e) => {
    setCareData({
      ...careData,
      notes: e.target.value,
    });
  };

  const saveCare = async () => {
    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/api/caretaker/resident/${id}`,
        careData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "Daily care saved successfully");
    } catch (error) {
      console.log("Save Care Error:", error);

      setMessage(
        error.response?.data?.message || "Unable to save daily care"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="resident-care-loading">
        Loading resident care...
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="resident-care-error">
        <h2>{message || "Resident not found"}</h2>

        <button onClick={() => navigate("/caretaker/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const doctor =
    caretaker.shift === "Morning"
      ? resident.morningDoctor
      : resident.nightDoctor;

  const completedTasks = [
    careData.medicine,
    careData.meal,
    careData.bath,
    careData.walking,
    careData.water,
    careData.rest,
  ].filter(Boolean).length;

  const progress = Math.round((completedTasks / 6) * 100);

  return (
    <div className="resident-care-page">

      {/* ================= HEADER ================= */}

      <div className="care-page-header">
        <button
          className="back-btn"
          onClick={() => navigate("/caretaker/dashboard")}
        >
          ← Back
        </button>

        <div>
          <p>Daily Care Management</p>
          <h1>{resident.name}</h1>
        </div>

        <div className="care-shift">
          {caretaker.shift} Shift
        </div>
      </div>

      {/* ================= RESIDENT DETAILS ================= */}

      <div className="resident-summary-card">
        <div className="resident-profile">

          <div className="resident-big-avatar">
            {resident.gender === "Female" ? "👵" : "👴"}
          </div>

          <div>
            <h2>{resident.name}</h2>

            <p>
              {resident.age} Years • {resident.gender}
            </p>
          </div>

        </div>

        <div className="summary-details">

          <div className="summary-item">
            <span>Room</span>

            <strong>
              {resident.room?.roomNumber || "Not Assigned"}
            </strong>
          </div>

          <div className="summary-item">
            <span>Room Type</span>

            <strong>
              {resident.room?.roomType || "-"}
            </strong>
          </div>

          <div className="summary-item">
            <span>Medical Condition</span>

            <strong>
              {resident.medicalCondition || "Normal"}
            </strong>
          </div>

          <div className="summary-item">
            <span>Assigned Doctor</span>

            <strong>
              {doctor?.name || "Not Assigned"}
            </strong>
          </div>

        </div>
      </div>

      {/* ================= PROGRESS ================= */}

      <div className="care-progress-card">

        <div className="progress-heading">
          <div>
            <h3>Today's Care Progress</h3>
            <p>
              {completedTasks} of 6 activities completed
            </p>
          </div>

          <strong>{progress}%</strong>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>

      </div>

      {/* ================= CARE TASKS ================= */}

      <div className="care-section">

        <div className="care-section-heading">
          <h2>Daily Care Activities</h2>
          <p>
            Mark the activities completed for this resident.
          </p>
        </div>

        <div className="care-task-grid">

          <CareTask
            icon="💊"
            title="Medicine"
            description="Medicine provided as scheduled"
            name="medicine"
            checked={careData.medicine}
            onChange={handleCheckbox}
          />

          <CareTask
            icon="🍲"
            title="Meal"
            description="Meal provided and completed"
            name="meal"
            checked={careData.meal}
            onChange={handleCheckbox}
          />

          <CareTask
            icon="🚿"
            title="Bath"
            description="Personal hygiene and bathing completed"
            name="bath"
            checked={careData.bath}
            onChange={handleCheckbox}
          />

          <CareTask
            icon="🚶"
            title="Walking"
            description="Walking or light exercise completed"
            name="walking"
            checked={careData.walking}
            onChange={handleCheckbox}
          />

          <CareTask
            icon="💧"
            title="Water"
            description="Adequate water intake provided"
            name="water"
            checked={careData.water}
            onChange={handleCheckbox}
          />

          <CareTask
            icon="🛏️"
            title="Rest"
            description="Rest and sleep routine monitored"
            name="rest"
            checked={careData.rest}
            onChange={handleCheckbox}
          />

        </div>
      </div>

      {/* ================= NOTES ================= */}

      <div className="care-notes-card">

        <div>
          <h2>Care Notes</h2>

          <p>
            Add any important observation about the resident.
          </p>
        </div>

        <textarea
          placeholder="Example: Resident felt weak during walking, ate less during lunch..."
          value={careData.notes}
          onChange={handleNotes}
          maxLength={500}
        />

        <div className="notes-count">
          {careData.notes.length}/500
        </div>

      </div>

      {message && (
        <div className="care-message">
          {message}
        </div>
      )}

      {/* ================= SAVE ================= */}

      <div className="care-actions">

        <button
          className="cancel-care-btn"
          onClick={() => navigate("/caretaker/dashboard")}
        >
          Cancel
        </button>

        <button
          className="save-care-btn"
          onClick={saveCare}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Daily Care"}
        </button>

      </div>

    </div>
  );
}

function CareTask({
  icon,
  title,
  description,
  name,
  checked,
  onChange,
}) {
  return (
    <label
      className={`care-task-card ${
        checked ? "care-task-completed" : ""
      }`}
    >
      <div className="task-icon">
        {icon}
      </div>

      <div className="task-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />

      <span className="custom-check">
        {checked ? "✓" : ""}
      </span>
    </label>
  );
}

export default ResidentCare;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaUser,
  FaClock,
  FaHeart,
} from "react-icons/fa";
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
      setMessage("");

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
        error.response?.data?.message ||
        "Unable to load resident details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckbox = (event) => {
    const { name, checked } = event.target;

    setCareData((previousData) => ({
      ...previousData,
      [name]: checked,
    }));
  };

  const handleNotes = (event) => {
    setCareData((previousData) => ({
      ...previousData,
      notes: event.target.value,
    }));
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

      setMessage(
        res.data.message || "Daily care saved successfully"
      );
    } catch (error) {
      console.log("Save Care Error:", error);

      setMessage(
        error.response?.data?.message ||
        "Unable to save daily care"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="resident-care-loading">
        <div className="resident-care-loader"></div>

        <h2>Loading Resident Care</h2>

        <p>Please wait while resident details are loading.</p>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="resident-care-error">
        <div className="resident-error-icon">
          <FaUser />
        </div>

        <h2>{message || "Resident not found"}</h2>

        <p>
          The requested resident information could not be loaded.
        </p>

        <button
          type="button"
          onClick={() => navigate("/caretaker/dashboard")}
        >
          <FaArrowLeft />
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

      {/* HEADER */}

      <header className="resident-care-header">

        <div className="resident-header-left">

          <button
            type="button"
            className="resident-back-btn"
            onClick={() => navigate("/caretaker/dashboard")}
          >
            <FaArrowLeft />
          </button>

          <div className="resident-header-content">

            <p className="resident-page-label">
              Daily Care Management
            </p>

            <h1>{resident.name}</h1>

            <span>
              Record and manage today's care activities.
            </span>

          </div>

        </div>


        <div className="resident-header-actions">

          <div className="resident-shift-card">

            <div className="resident-shift-icon">
              <FaClock />
            </div>

            <div>
              <span>Current Shift</span>

              <strong>
                {caretaker.shift || "Not Assigned"}
              </strong>
            </div>

          </div>


          <div className="resident-caretaker-card">

            <div className="resident-caretaker-icon">
              <FaHeart />
            </div>

            <div>
              <span>Caretaker</span>

              <strong>
                {caretaker.name || "Caretaker"}
              </strong>
            </div>

          </div>

        </div>

      </header>
      {/* RESIDENT SUMMARY */}

      <section className="resident-summary-card">

        <div className="resident-profile-section">

          <div className="resident-avatar-large">
            {resident.gender?.toLowerCase() === "female" ? "👵" : "👴"}
          </div>

          <div className="resident-profile-info">

            <span>Resident Profile</span>

            <h2>{resident.name}</h2>

            <p>
              {resident.age} Years • {resident.gender}
            </p>

          </div>

        </div>


        <div className="resident-info-grid">

          <div className="resident-info-box">

            <span>Room Number</span>

            <strong>
              {resident.room?.roomNumber || "Not Assigned"}
            </strong>

          </div>


          <div className="resident-info-box">

            <span>Room Type</span>

            <strong>
              {resident.room?.roomType || "-"}
            </strong>

          </div>


          <div className="resident-info-box">

            <span>Medical Condition</span>

            <strong>
              {resident.medicalCondition || "Normal"}
            </strong>

          </div>


          <div className="resident-info-box">

            <span>Assigned Doctor</span>

            <strong>
              {doctor?.name || "Not Assigned"}
            </strong>

          </div>

        </div>

      </section>


      {/* CARE PROGRESS */}

      <section className="resident-progress-card">

        <div className="resident-progress-header">

          <div>

            <p className="resident-progress-label">
              Today's Progress
            </p>

            <h3>
              Daily Care Status
            </h3>

            <span>
              {completedTasks} of 6 care activities completed today.
            </span>

          </div>

          <div className="resident-progress-circle">

            <strong>
              {progress}%
            </strong>

          </div>

        </div>


        <div className="resident-progress-bar">

          <div
            className="resident-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          ></div>

        </div>

      </section>


      {/* DAILY CARE */}

      <section className="resident-care-section">

        <div className="resident-section-header">

          <div>

            <p className="resident-section-label">
              Daily Checklist
            </p>

            <h2>
              Care Activities
            </h2>

          </div>

          <span>
            Complete all required activities.
          </span>

        </div>


        <div className="resident-task-grid">

          <CareTask
            icon="💊"
            title="Medicine"
            description="Medicine provided as scheduled."
            name="medicine"
            checked={careData.medicine}
            onChange={handleCheckbox}
          />

          <CareTask
            icon="🍲"
            title="Meal"
            description="Breakfast / Lunch / Dinner completed."
            name="meal"
            checked={careData.meal}
            onChange={handleCheckbox}
          />

          <CareTask
            icon="🚿"
            title="Bath"
            description="Personal hygiene completed."
            name="bath"
            checked={careData.bath}
            onChange={handleCheckbox}
          />

          <CareTask
            icon="🚶"
            title="Walking"
            description="Walking or exercise completed."
            name="walking"
            checked={careData.walking}
            onChange={handleCheckbox}
          />

          <CareTask
            icon="💧"
            title="Water"
            description="Enough water intake completed."
            name="water"
            checked={careData.water}
            onChange={handleCheckbox}
          />

          <CareTask
            icon="🛏️"
            title="Rest"
            description="Rest and sleep monitored."
            name="rest"
            checked={careData.rest}
            onChange={handleCheckbox}
          />

        </div>

      </section>
      {/* NOTES */}

      <section className="resident-notes-card">

        <div className="resident-section-header">

          <div>

            <p className="resident-section-label">
              Care Notes
            </p>

            <h2>
              Observation
            </h2>

          </div>

          <span>
            Maximum 500 characters
          </span>

        </div>

        <textarea
          className="resident-notes-input"
          placeholder="Write today's observation about the resident..."
          value={careData.notes}
          onChange={handleNotes}
          maxLength={500}
        />

        <div className="resident-notes-footer">

          <span>
            {careData.notes.length}/500
          </span>

        </div>

      </section>


      {/* MESSAGE */}

      {message && (
        <div className="resident-message">
          {message}
        </div>
      )}


      {/* ACTION BUTTONS */}

      <div className="resident-action-buttons">

        <button
          type="button"
          className="resident-cancel-btn"
          onClick={() =>
            navigate("/caretaker/dashboard")
          }
        >
          Cancel
        </button>

        <button
          type="button"
          className="resident-save-btn"
          onClick={saveCare}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Daily Care"}
        </button>

      </div>

    </div>
  );
}


/* =========================
   CARE TASK COMPONENT
========================= */

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
      className={`resident-task-card ${checked
          ? "resident-task-active"
          : ""
        }`}
    >

      <div className="resident-task-icon">
        {icon}
      </div>

      <div className="resident-task-content">

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>

      <div className="resident-task-check">

        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
        />

        <span className="resident-custom-checkbox">
          {checked ? "✓" : ""}
        </span>

      </div>

    </label>
  );
}

export default ResidentCare;
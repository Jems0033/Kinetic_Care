import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaArrowLeft,
  FaUser,
  FaVenusMars,
  FaBed,
  FaNotesMedical,
  FaCalendarAlt,
  FaPlus,
  FaPills,
  FaClock,
} from "react-icons/fa";

import "../../css/doctor/PatientDetails.css";

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resident, setResident] = useState({});
  const [records, setRecords] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [problem, setProblem] = useState("");
  const [medicine, setMedicine] = useState("");
  const [editId, setEditId] = useState(null);
  const [doctor, setDoctor] = useState({});

  const [alertBox, setAlertBox] = useState({
    show: false,
    message: "",
    type: "",
  });

  const getPatient = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/doctor/patient/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setResident(res.data.resident);
      setDoctor(res.data.doctor);
      setRecords(res.data.records);
    } catch (error) {
      console.log(error);
    }
  };
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

  const canEditRecord = (recordDate) => {
    const today = new Date();
    const record = new Date(recordDate);

    today.setHours(0, 0, 0, 0);
    record.setHours(0, 0, 0, 0);

    return record.getTime() >= today.getTime();
  };
  const validateRecord = () => {
    if (!problem.trim()) return "Problem / Diagnosis is required.";

    if (!medicine.trim()) return "Medicine / Prescription is required.";

    return null;
  };
  useEffect(() => {
    getPatient();
  }, []);

  const saveRecord = async () => {
    try {
      const validationError = validateRecord();

      if (validationError) {
        return showAlert(validationError, "error");
      }
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/doctor/medical",
        {
          residentId: id,
          problem,
          medicine,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      showAlert("Medical Record Added Successfully", "success");

      setProblem("");
      setMedicine("");
      setShowForm(false);

      getPatient();
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Failed to Add Record",
        "error",
      );
    }
  };

  const closeModal = () => {
    setEditId(null);
    setProblem("");
    setMedicine("");
    setShowForm(false);
  };

  const editRecord = (record) => {
    setEditId(record._id);
    setProblem(record.problem);
    setMedicine(record.medicine);
    setShowForm(true);
  };

  const updateRecord = async () => {
    try {
      const validationError = validateRecord();

      if (validationError) {
        return showAlert(validationError, "error");
      }

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/doctor/medical/${editId}`,
        {
          problem,
          medicine,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      showAlert("Medical Record Updated Successfully", "success");

      setEditId(null);
      setProblem("");
      setMedicine("");
      setShowForm(false);

      getPatient();
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Failed to Update Record",
        "error",
      );
    }
  };

  return (
    <>
      <div className="patient-details">
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

        {/* TOP */}

        <div className="patient-page-top">
          <button
            className="back-btn"
            onClick={() => navigate("/doctor/dashboard")}
          >
            <FaArrowLeft />
            Back to Patients
          </button>

          <div className="patient-page-heading">
            <p>Patient Overview</p>

            <h1>Patient Details</h1>

            <span>View patient profile and complete medical history</span>
          </div>

          <div className="resident-shift-card">
            <div className="resident-shift-icon">
              <FaClock />
            </div>

            <div>
              <span>Current Shift</span>
              <strong>{doctor.shift || "-"}</strong>
            </div>
          </div>
        </div>

        {/* PATIENT PROFILE */}

        <section className="patient-profile-card">
          <div className="patient-profile-main">
            <div className="patient-large-avatar">
              {resident.gender?.toLowerCase() === "male" ? "👴" : "👵"}
            </div>

            <div>
              <span className="patient-label">Resident</span>

              <h2>{resident.name || "Patient"}</h2>

              <p>Kinetic Care Resident</p>
            </div>
          </div>

          <div className="patient-profile-grid">
            <div className="patient-info-box">
              <div className="patient-info-icon">
                <FaUser />
              </div>

              <div>
                <span>Age</span>

                <strong>{resident.age || "N/A"} Years</strong>
              </div>
            </div>

            <div className="patient-info-box">
              <div className="patient-info-icon gender-icon">
                <FaVenusMars />
              </div>

              <div>
                <span>Gender</span>

                <strong>{resident.gender || "N/A"}</strong>
              </div>
            </div>

            <div className="patient-info-box">
              <div className="patient-info-icon room-icon">
                <FaBed />
              </div>

              <div>
                <span>Room</span>

                <strong>{resident.room || "Not Assigned"}</strong>
              </div>
            </div>

            <div className="patient-info-box condition-box">
              <div className="patient-info-icon condition-icon">
                <FaNotesMedical />
              </div>

              <div>
                <span>Medical Condition</span>

                <strong>
                  {resident.medicalCondition || "No condition recorded"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* HISTORY HEADER */}

        <div className="history-header">
          <div>
            <p className="history-label">Health Records</p>

            <h2>Medical History</h2>

            <span>
              {records.length} medical record
              {records.length !== 1 ? "s" : ""}
            </span>
          </div>

          <button
            className="add-btn"
            disabled={resident.status === "Temporary Leave"}
            onClick={() => {
              if (resident.status === "Active") {
                setShowForm(true);
              }
            }}
          >
            {resident.status !== "Temporary Leave" && <FaPlus />}
            {resident.status === "Temporary Leave"
              ? "Resident on Temporary Leave"
              : "Add Medical Record"}
          </button>
        </div>

        {/* HISTORY */}

        {records.length === 0 ? (
          <div className="no-record">
            <div className="no-record-icon">
              <FaNotesMedical />
            </div>

            <h3>No Medical Records Found</h3>

            <p>Medical records added for this patient will appear here.</p>

            <button
              disabled={resident.status === "Temporary Leave"}
              onClick={() => {
                if (resident.status === "Active") {
                  setShowForm(true);
                }
              }}
            >
              {resident.status !== "Temporary Leave" && <FaPlus />}
              {resident.status === "Temporary Leave"
                ? "Resident on Temporary Leave"
                : "Add First Record"}
            </button>
          </div>
        ) : (
          <div className="medical-history-list">
            {records.map((record, index) => (
              <div className="history-record" key={record._id}>
                <div className="timeline-section">
                  <div className="timeline-icon">
                    <FaNotesMedical />
                  </div>

                  {index !== records.length - 1 && (
                    <div className="timeline-line"></div>
                  )}
                </div>

                <div className="history-record-card">
                  <div className="record-header">
                    <div>
                      <span>Medical Record</span>

                      <h3>{record.problem || "General Checkup"}</h3>
                    </div>

                    <div className="record-date">
                      <FaCalendarAlt />

                      {new Date(record.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="record-content">
                    <div className="record-info">
                      <span>Diagnosis / Problem</span>

                      <strong>{record.problem || "Not specified"}</strong>
                    </div>

                    <div className="record-info medicine-record">
                      <div className="medicine-title">
                        <FaPills />

                        <span>Medicine</span>
                      </div>

                      <strong>
                        {record.medicine || "No medicine prescribed"}
                      </strong>
                    </div>
                  </div>

                  {record.doctor && (
                    <div className="record-doctor">
                      Recorded by Dr. {record.doctor}
                    </div>
                  )}
                  {resident.status === "Active" &&
                    canEditRecord(record.date) && (
                      <button
                        className="record-edit-btn"
                        onClick={() => editRecord(record)}
                      >
                        Edit
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD RECORD MODAL */}

      {showForm && (
        <div className="doctor-modal-overlay">
          <div className="doctor-modal">
            <button className="doctor-modal-close" onClick={closeModal}>
              ×
            </button>

            <div className="doctor-modal-header">
              <div className="doctor-modal-icon">
                <FaNotesMedical />
              </div>

              <div>
                <p>Medical Record</p>

                <h2>Add Medical Record</h2>

                <span>
                  Add diagnosis and medicine for{" "}
                  {resident.name || "this patient"}.
                </span>
              </div>
            </div>

            <div className="doctor-form-group">
              <label>Problem / Diagnosis</label>

              <input
                type="text"
                placeholder="Example: High Blood Pressure"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />
            </div>

            <div className="doctor-form-group">
              <label>Medicine / Prescription</label>

              <textarea
                rows="4"
                placeholder="Enter medicine name, dosage and instructions..."
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
              />
            </div>

            <div className="doctor-modal-buttons">
              <button className="doctor-cancel-btn" onClick={closeModal}>
                Cancel
              </button>

              <button
                className="doctor-save-btn"
                onClick={editId ? updateRecord : saveRecord}
              >
                {editId ? "Update Medical Record" : "Save Medical Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PatientDetails;

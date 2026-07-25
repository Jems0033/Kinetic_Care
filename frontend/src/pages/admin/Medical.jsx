import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../css/admin/Medical.css";

function Medical() {

    const [records, setRecords] = useState([]);
    const [residents, setResidents] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({

        residentId: "",

        staffId: "",

        problem: "",

        medicine: ""

    });

    useEffect(() => {

        getMedicalRecords();

        getResidents();

        getDoctors();

    }, []);

    const getMedicalRecords = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await axios.get(

            "http://localhost:5000/api/medical",

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        setRecords(res.data);

    }

    catch (error) {

        console.log(error);

    }

};

const getResidents = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await axios.get(

            "http://localhost:5000/api/residents",

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        setResidents(res.data);

    }

    catch (error) {

        console.log(error);

    }

};
const getDoctors = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await axios.get(

            "http://localhost:5000/api/staff/doctors",

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        setDoctors(res.data);

    } catch (error) {

        console.log(error);

    }

};
const handleChange = (e) => {

    setFormData({

        ...formData,

        [e.target.name]: e.target.value

    });

};
const addMedicalRecord = async () => {

    try {

        const token = localStorage.getItem("token");

        await axios.post(

            "http://localhost:5000/api/medical",

            formData,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        alert("Medical Record Added Successfully");

        closeModal();

        getMedicalRecords();

    } catch (error) {

        console.log(error);

        alert("Unable To Add Medical Record");

    }

};

// ===========================
// Edit Medical Record
// ===========================

const editMedicalRecord = (record) => {

    setEditId(record._id);

    setFormData({

        residentId: record.residentId._id,

        staffId: record.staffId._id,

        problem: record.problem,

        medicine: record.medicine

    });

    setShowModal(true);

};

// ===========================
// Update Medical Record
// ===========================

const updateMedicalRecord = async () => {

    try {

        const token = localStorage.getItem("token");

        await axios.put(

            `http://localhost:5000/api/medical/${editId}`,

            formData,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        alert("Medical Record Updated Successfully");

        closeModal();

        getMedicalRecords();

    } catch (error) {

        console.log(error);

    }

};

// ===========================
// Delete Medical Record
// ===========================

const deleteMedicalRecord = async (id) => {

    if (!window.confirm("Delete this record?")) return;

    try {

        const token = localStorage.getItem("token");

        await axios.delete(

            `http://localhost:5000/api/medical/${id}`,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        alert("Medical Record Deleted Successfully");

        getMedicalRecords();

    } catch (error) {

        console.log(error);

    }

};

// ===========================
// Close Modal
// ===========================

const closeModal = () => {

    setEditId(null);

    setShowModal(false);

    setFormData({

        residentId: "",

        staffId: "",

        problem: "",

        medicine: ""

    });

};

// ===========================
// Search
// ===========================

const filteredRecords = records.filter((record) =>

    record.residentId?.name.toLowerCase().includes(search.toLowerCase()) ||

    record.staffId?.name.toLowerCase().includes(search.toLowerCase()) ||

    record.problem.toLowerCase().includes(search.toLowerCase()) ||

    record.medicine.toLowerCase().includes(search.toLowerCase())

);

return (

    <>

        <div className="medical-page">

            <Sidebar />

            <div className="medical-content">

                <div className="medical-header">

  <div>
    <p className="medical-label">Health Management</p>

    <h1>Medical Records</h1>

    <span>
      Track resident health conditions, doctors and medicines
    </span>
  </div>

  <button
    onClick={() => {
      closeModal();
      setShowModal(true);
    }}
  >
    + Add Medical Record
  </button>

</div>

<div className="medical-search-box">

  <input
    type="text"
    placeholder="Search resident, doctor, problem or medicine..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

</div>

                <div className="medical-record-grid">

  {filteredRecords.length === 0 ? (

    <div className="medical-empty">
      <div className="medical-empty-icon">🩺</div>

      <h3>No Medical Records Found</h3>

      <p>
        Medical records will appear here once they are added.
      </p>
    </div>

  ) : (

    filteredRecords.map((record) => (

      <div
        className="medical-record-card"
        key={record._id}
      >

        {/* TOP */}

        <div className="medical-card-top">

          <div className="patient-info">

            <div className="patient-avatar">
              {record.residentId?.name
                ?.charAt(0)
                ?.toUpperCase() || "R"}
            </div>

            <div>
              <span>Resident</span>

              <h3>
                {record.residentId?.name || "Unknown Resident"}
              </h3>
            </div>

          </div>

          <div className="record-date">

            <span>
              {new Date(record.date).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </span>

          </div>

        </div>


        {/* PROBLEM */}

        <div className="health-condition-box">

          <span className="condition-label">
            Health Condition
          </span>

          <h4>
            {record.problem || "No problem specified"}
          </h4>

        </div>


        {/* DOCTOR + MEDICINE */}

        <div className="medical-info-grid">

          <div className="medical-info-item">

            <div className="info-icon doctor-icon">
              🩺
            </div>

            <div>
              <span>Assigned Doctor</span>

              <strong>
                Dr. {record.staffId?.name || "Not Assigned"}
              </strong>
            </div>

          </div>


          <div className="medical-info-item">

            <div className="info-icon medicine-icon">
              💊
            </div>

            <div>
              <span>Medicine</span>

              <strong>
                {record.medicine || "Not Prescribed"}
              </strong>
            </div>

          </div>

        </div>


        {/* ACTION */}

        <div className="medical-card-actions">

          <button
            className="medical-edit-btn"
            onClick={() => editMedicalRecord(record)}
          >
            Edit Record
          </button>

          <button
            className="medical-delete-btn"
            onClick={() =>
              deleteMedicalRecord(record._id)
            }
          >
            Delete
          </button>

        </div>

      </div>

    ))

  )}

</div>
            </div>

        </div>

        {showModal && (

  <div className="medical-modal-overlay">

    <div className="medical-modal">

      <button
        className="medical-modal-close"
        onClick={closeModal}
      >
        ×
      </button>


      {/* MODAL HEADER */}

      <div className="medical-modal-header">

        <div className="medical-modal-icon">
          🩺
        </div>

        <div>

          <p>Medical Management</p>

          <h2>
            {editId
              ? "Update Medical Record"
              : "New Medical Record"}
          </h2>

          <span>
            {editId
              ? "Update resident health information"
              : "Add health information for a resident"}
          </span>

        </div>

      </div>


      {/* FORM */}

      <div className="medical-modal-form">

        <div className="medical-form-group">

          <label>Resident</label>

          <select
            name="residentId"
            value={formData.residentId}
            onChange={handleChange}
          >

            <option value="">
              Select Resident
            </option>

            {residents.map((resident) => (

              <option
                key={resident._id}
                value={resident._id}
              >
                {resident.name}
              </option>

            ))}

          </select>

        </div>


        <div className="medical-form-group">

          <label>Doctor</label>

          <select
            name="staffId"
            value={formData.staffId}
            onChange={handleChange}
          >

            <option value="">
              Select Doctor
            </option>

            {doctors.map((doctor) => (

              <option
                key={doctor._id}
                value={doctor._id}
              >
                Dr. {doctor.name}
              </option>

            ))}

          </select>

        </div>


        <div className="medical-form-group full-width">

          <label>Health Problem / Diagnosis</label>

          <input
            type="text"
            name="problem"
            placeholder="Example: Diabetes, Blood Pressure..."
            value={formData.problem}
            onChange={handleChange}
          />

        </div>


        <div className="medical-form-group full-width">

          <label>Prescribed Medicine</label>

          <input
            type="text"
            name="medicine"
            placeholder="Enter medicine name and dosage"
            value={formData.medicine}
            onChange={handleChange}
          />

        </div>

      </div>


      <div className="medical-modal-actions">

        <button
          className="medical-cancel-btn"
          onClick={closeModal}
        >
          Cancel
        </button>

        <button
          className="medical-save-btn"
          onClick={
            editId
              ? updateMedicalRecord
              : addMedicalRecord
          }
        >
          {editId
            ? "Update Record"
            : "Save Record"}
        </button>

      </div>

    </div>

  </div>

)}
    </>

);

}

export default Medical;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../css/doctor/PatientDetails.css";
import { useNavigate } from "react-router-dom";

function PatientDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [resident, setResident] = useState({});
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [problem, setProblem] = useState("");
const [medicine, setMedicine] = useState("");

  useEffect(() => {
    getPatient();
  }, []);

  const getPatient = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/doctor/patient/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResident(res.data.resident);
      setRecords(res.data.records);

    } catch (error) {
      console.log(error);
    }
  };

  const saveRecord = async () => {

  try {

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
      }
    );

    alert("Medical Record Added Successfully");

    setProblem("");
    setMedicine("");
    setShowForm(false);

    getPatient();

  } catch (error) {
    console.log(error);
    alert("Failed to Add Record");
  }

};

const closeModal = () => {
    setProblem("");
    setMedicine("");
    setShowForm(false);
};

  return (
    <>
    <div className="patient-details">
        <button
  className="back-btn"
  onClick={() => navigate("/doctor/patients")}
>
  ← Back to Patients
</button>

<h1 className="patient-title">
  Patient Details
</h1>

      <div className="patient-card">

        <div className="info">
          <span>Name</span>
          <p>{resident.name}</p>
        </div>

        <div className="info">
          <span>Age</span>
          <p>{resident.age}</p>
        </div>

        <div className="info">
          <span>Gender</span>
          <p>{resident.gender}</p>
        </div>

        <div className="info">
          <span>Room</span>
          <p>{resident.room}</p>
        </div>


        <div className="info">
          <span>Medical Condition</span>
          <p>{resident.medicalCondition}</p>
        </div>

      </div>

      <div className="history-header">
        <h2>Medical History</h2>

        <button
  className="add-btn"
  onClick={() => setShowForm(true)}
>
  + Add Medical Record
</button>
      </div>

      {records.length === 0 ? (

        <div className="no-record">
          No Medical Records Found
        </div>

      ) : (

        records.map((record) => (

          <div className="record-card" key={record._id}>

            <div className="record-top">

              <h3>
                {new Date(record.date).toLocaleDateString()}
              </h3>

              <span>{record.doctor}</span>

            </div>

            <div className="record-body">

              <p>
                <strong>Problem:</strong> {record.problem}
              </p>

              <p>
                <strong>Medicine:</strong> {record.medicine}
              </p>

            </div>

          </div>

        ))

      )}

      

    </div>
{showForm && (
  <div className="doctor-modal-overlay">

    <div className="doctor-modal">

      <h2>Add Medical Record</h2>

      <div className="doctor-form-group">
        <label>Problem</label>
        <input
  type="text"
  placeholder="Enter Problem"
  value={problem}
  onChange={(e) => setProblem(e.target.value)}
/>
      </div>

      <div className="doctor-form-group">
        <label>Medicine</label>
        <textarea
  rows="4"
  placeholder="Enter Medicine"
  value={medicine}
  onChange={(e) => setMedicine(e.target.value)}
></textarea>
      </div>

      <div className="doctor-modal-buttons">

        <button
    className="doctor-cancel-btn"
    onClick={closeModal}
>
    Cancel
</button>

        <button
  className="doctor-save-btn"
  onClick={saveRecord}
>
  Save Record
</button>

      </div>

    </div>

  </div>
)}
</>
  );
}

export default PatientDetails;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/doctor/DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalPatients: 0,
    totalRecords: 0,
    todayRecords: 0,
    latestRecords: [],
  });

  useEffect(() => {
    getDashboard();
  }, []);

  

  const getDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/doctor/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDashboard(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="doctor-dashboard">
      <div className="doctor-header">
        <div>
          <h1>Doctor Dashboard</h1>
          <p>Welcome Back 👨‍⚕️</p>
        </div>

        <button
          className="patient-btn"
          onClick={() => navigate("/doctor/patients")}
        >
          View My Patients
        </button>
        <div className="doctor-profile">
          <div
            className="doctor-profile-info"
          >
            <div className="doctor-avatar">👨‍⚕️</div>

            <div>
              <button  onClick={() => navigate("/doctor/profile")}>Dr. Rahul Patel</button>
            </div>
          </div>

          
        </div>
      </div>

      <div className="doctor-cards">
        <div className="doctor-card">
          <h2>{dashboard.totalPatients}</h2>
          <span>Total Patients</span>
        </div>

        <div className="doctor-card">
          <h2>{dashboard.totalRecords}</h2>
          <span>Medical Records</span>
        </div>

        <div className="doctor-card">
          <h2>{dashboard.todayRecords}</h2>
          <span>Today's Records</span>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Medical Records</h2>

        {dashboard.latestRecords.length === 0 ? (
          <div className="empty-record">
            <p>No Medical Records Available</p>
          </div>
        ) : (
          <div className="record-list">
            {dashboard.latestRecords.map((record) => (
              <div className="record-card" key={record._id}>
                <div className="record-top">
                  <h3>{record.residentId?.name}</h3>

                  <span>{new Date(record.date).toLocaleDateString()}</span>
                </div>

                <div className="record-body">
                  <p>
                    <strong>Age :</strong> {record.residentId?.age}
                  </p>

                  <p>
                    <strong>Problem :</strong> {record.problem}
                  </p>

                  <p>
                    <strong>Medicine :</strong> {record.medicine}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;

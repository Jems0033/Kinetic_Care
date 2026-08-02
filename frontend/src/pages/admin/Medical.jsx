import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../css/admin/Medical.css";

function Medical() {

  const [records, setRecords] = useState([]);
  const [residents, setResidents] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [search, setSearch] = useState("");


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

              <h1>Medical Records</h1>

              <span>
                Track resident health conditions, doctors and medicines
              </span>
            </div>

          </div>

          <div className="medical-search-box">

            <input
    type="text"
    placeholder="Search record by resident name..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {search && (
    <button
      className="search-clear-btn"
      onClick={() => setSearch("")}
      type="button"
    >
      ✕
    </button>
  )}

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

                </div>

              ))

            )}

          </div>
        </div>

      </div>


    </>

  );

}

export default Medical;
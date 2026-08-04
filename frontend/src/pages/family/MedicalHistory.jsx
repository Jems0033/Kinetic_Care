import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/family/MedicalHistory.css";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaNotesMedical,
  FaUserMd,
  FaPills,
  FaCalendarAlt,
} from "react-icons/fa";

function MedicalHistory() {
  const [records, setRecords] = useState([]);

  const navigate = useNavigate();
  const { residentId } = useParams();

  useEffect(() => {
    getMedicalHistory();
  }, []);

  const getMedicalHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/family/medical-history/${residentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRecords(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="medical-history-page">
      {/* TOP */}

      <div className="history-topbar">
        <button
          className="history-back-btn"
          onClick={() => navigate("/family-dashboard")}
        >
          <FaArrowLeft />
          Back
        </button>

        {/* HEADING */}

        <div className="medical-history-heading">
          <p>Health Records</p>

          <h1>Medical History</h1>

          <span>
            View complete medical records and treatment history of your loved
            one.
          </span>
        </div>
      </div>

      {/* RECORDS */}

      {records.length === 0 ? (
        <div className="medical-history-empty">
          <div className="history-empty-icon">
            <FaNotesMedical />
          </div>

          <h3>No Medical Records Found</h3>

          <p>Medical records will appear here once they are added.</p>
        </div>
      ) : (
        <div className="medical-history-list">
          {records.map((record, index) => (
            <div className="medical-history-item" key={record._id}>
              {/* TIMELINE */}

              <div className="history-timeline">
                <div className="timeline-dot">
                  <FaNotesMedical />
                </div>

                {index !== records.length - 1 && (
                  <div className="timeline-line"></div>
                )}
              </div>

              {/* CARD */}

              <div className="history-record-card">
                <div className="history-card-header">
                  <div>
                    <span>Medical Record</span>

                    <h3>{record.problem || "General Checkup"}</h3>
                  </div>

                  <div className="history-date">
                    <FaCalendarAlt />

                    {new Date(record.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div className="history-details-grid">
                  <div className="history-detail">
                    <div className="history-detail-icon doctor-history-icon">
                      <FaUserMd />
                    </div>

                    <div>
                      <span>Doctor</span>

                      <strong>
                        Dr. {record.staffId?.name || "Not Available"}
                      </strong>
                    </div>
                  </div>

                  <div className="history-detail">
                    <div className="history-detail-icon problem-history-icon">
                      <FaNotesMedical />
                    </div>

                    <div>
                      <span>Problem</span>

                      <strong>{record.problem || "Not specified"}</strong>
                    </div>
                  </div>

                  <div className="history-detail medicine-history-detail">
                    <div className="history-detail-icon medicine-history-icon">
                      <FaPills />
                    </div>

                    <div>
                      <span>Medicine</span>

                      <strong>{record.medicine || "Not prescribed"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MedicalHistory;

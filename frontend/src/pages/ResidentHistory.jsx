import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ResidentHistory.css";

function ResidentHistory() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [history, setHistory] = useState({
    vitals: [],
    medicines: [],
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/staff/resident/${id}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="history-page">

      <h1>Resident Medical History</h1>

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2>❤️ Vitals History</h2>

      <div className="history-grid">

        {history.vitals.map((item) => (

          <div
            key={item._id}
            className="history-card"
          >

            <h3>{item.createdAt.substring(0,10)}</h3>

            <p><strong>Temperature:</strong> {item.temperature}°C</p>

            <p><strong>BP:</strong> {item.bloodPressure}</p>

            <p><strong>Pulse:</strong> {item.pulse}</p>

            <p><strong>Sugar:</strong> {item.sugarLevel}</p>

            <p><strong>Weight:</strong> {item.weight}</p>

            <p><strong>Updated By:</strong> {item.staff?.name}</p>

          </div>

        ))}

      </div>

      <h2>💊 Medicine History</h2>

      <div className="history-grid">

        {history.medicines.map((item) => (

          <div
            key={item._id}
            className="history-card"
          >

            <h3>{item.createdAt.substring(0,10)}</h3>

            <p><strong>Medicine:</strong> {item.medicineName}</p>

            <p><strong>Dosage:</strong> {item.dosage}</p>

            <p><strong>Time:</strong> {item.time}</p>

            <p><strong>Status:</strong> {item.status}</p>

            <p><strong>Given By:</strong> {item.staff?.name}</p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ResidentHistory;
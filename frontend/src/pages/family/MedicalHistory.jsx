import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/family/MedicalHistory.css";

function MedicalHistory() {

  const [records, setRecords] = useState([]);

  useEffect(() => {
    getMedicalHistory();
  }, []);

  const getMedicalHistory = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/family/medical-history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecords(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="medical-history">

      <h1>Medical History</h1>

      {records.length === 0 ? (

        <div className="no-record">
          No Medical Records Found
        </div>

      ) : (

        <table>

          <thead>

            <tr>
              <th>Date</th>
              <th>Doctor</th>
              <th>Problem</th>
              <th>Medicine</th>
            </tr>

          </thead>

          <tbody>

            {records.map((record) => (

              <tr key={record._id}>

                <td>
                  {new Date(record.date).toLocaleDateString()}
                </td>

                <td>
                  {record.staffId?.name}
                </td>

                <td>
                  {record.problem}
                </td>

                <td>
                  {record.medicine}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default MedicalHistory;
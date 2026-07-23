import { useEffect, useState } from "react";
import axios from "axios";
import "../css/DoctorPatients.css";
import { useNavigate } from "react-router-dom";

function DoctorPatients() {

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getPatients();
  }, []);

  const navigate = useNavigate();

  const getPatients = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/doctor/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPatients(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="doctor-patients">

        <div className="doctor-topbar">

  <div>
    <h1>Doctor Dashboard</h1>
    <p>Welcome Back</p>
  </div>

  <div className="doctor-profile">
    <div className="doctor-avatar">
      👨‍⚕️
    </div>

    <div>
      <h3>Dr. Rahul Patel</h3>
      <span>Doctor</span>
    </div>
  </div>

</div>

      <div className="patients-header">

  <h2>My Patients</h2>

  <input
    type="text"
    placeholder="Search Patient..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

</div>

      <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Room</th>
              <th>Latest Problem</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredPatients.length === 0 ? (

              <tr>
                <td colSpan="6">
                  No Patients Found
                </td>
              </tr>

            ) : (

              filteredPatients.map((patient) => (

                <tr key={patient._id}>

                  <td>{patient.name}</td>

                  <td>{patient.age}</td>

                  <td>{patient.gender}</td>

                  <td>{patient.room}</td>

                  <td>{patient.latestProblem}</td>

                  <td>

                    <button
  className="view-btn"
  onClick={() => navigate(`/doctor/patient/${patient._id}`)}
>
  View
</button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default DoctorPatients;
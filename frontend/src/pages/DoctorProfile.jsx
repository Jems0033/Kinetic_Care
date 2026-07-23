import { useEffect, useState } from "react";
import axios from "axios";
import "../css/DoctorProfile.css";
import { useNavigate } from "react-router-dom";

function DoctorProfile() {

  const [doctor, setDoctor] = useState({});
  const navigate = useNavigate(); 
  const logout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/doctor/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDoctor(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <div className="doctor-profile-page">


      <h1>Doctor Profile</h1>

      <div className="profile-card">

        <div className="profile-avatar">
          👨‍⚕️
        </div>

        <div className="profile-info">

          <div className="profile-item">
            <label>Name</label>
            <p>{doctor.name}</p>
          </div>

          <div className="profile-item">
            <label>Email</label>
            <p>{doctor.email}</p>
          </div>

          <div className="profile-item">
            <label>Phone</label>
            <p>{doctor.phone}</p>
          </div>

          <div className="profile-item">
            <label>Role</label>
            <p>{doctor.role}</p>
          </div>

          <div className="profile-item">
            <label>Shift</label>
            <p>{doctor.shift}</p>
          </div>

        </div>

      </div>
      <button
  className="logout-btn"
  onClick={logout}
>
  🚪 Logout
</button>

    </div>
  );
}

export default DoctorProfile;
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../css/Staff.css";

function Staff() {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    phone: "",
    shift: "",
    salary: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="staff-page">
        <Sidebar />

        <div className="staff-content">
          <div className="staff-header">
            <h1>Staff Management</h1>

            <button onClick={() => setShowModal(true)}>+ Add Staff</button>
          </div>

          <input type="text" placeholder="Search Staff..." />

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Shift</th>
                <th>Salary</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody></tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h2>Add Staff</h2>

            <input
              type="text"
              name="name"
              placeholder="Staff Name"
              value={formData.name}
              onChange={handleChange}
            />

            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="">Select Role</option>

              <option value="Doctor">Doctor</option>

              <option value="Nurse">Nurse</option>

              <option value="Caretaker">Caretaker</option>

              <option value="Manager">Manager</option>

              <option value="Receptionist">Receptionist</option>
            </select>

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <select name="shift" value={formData.shift} onChange={handleChange}>
              <option value="">Select Shift</option>

              <option value="Morning">Morning</option>

              <option value="Evening">Evening</option>

              <option value="Night">Night</option>
            </select>

            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button>Save</button>

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Staff;

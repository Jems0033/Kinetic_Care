
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "../css/Staff.css";
import { useState, useEffect } from "react";

function Staff() {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    shift: "",
    salary: "",
  });

  const [staff, setStaff] = useState([]);

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    getStaff();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const addStaff = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/staff",
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        shift: formData.shift,
        salary: formData.salary,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Staff Added Successfully");

    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "",
      shift: "",
      salary: "",
    });

    setShowModal(false);
    getStaff();

  } catch (error) {
    alert(error.response?.data?.message || "Unable to Add Staff");
  }
};

  const getStaff = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/staff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStaff(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const editStaff = (member) => {

    setFormData({
        name: member.name,
        phone: member.phone,
        role: member.role,
        shift: member.shift,
        salary: member.salary,
        email: "",
        password: ""
    });

    setEditId(member._id);

    setShowModal(true);

};

  const updateStaff = async () => {

    try {

        const token = localStorage.getItem("token");

        await axios.put(

            `http://localhost:5000/api/staff/${editId}`,

            {
                name: formData.name,
                role: formData.role,
                phone: formData.phone,
                shift: formData.shift,
                salary: formData.salary
            },

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        alert("Staff Updated Successfully");

        getStaff();

        setShowModal(false);

        setEditId(null);

    } catch (error) {

        console.log(error);

    }

};


  const deleteStaff = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this staff?"
    );

    if (!confirmDelete) return;

    try {

        const token = localStorage.getItem("token");

        await axios.delete(
            `http://localhost:5000/api/staff/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert("Staff Deleted Successfully");

        getStaff();

    } catch (error) {

        console.log(error);

        alert("Unable to Delete Staff");

    }

};

  const closeModal = () => {

    setShowModal(false);

    setEditId(null);

    setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        shift: "",
        salary: ""
    });

};

const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.role.toLowerCase().includes(search.toLowerCase()) ||
    member.phone.includes(search)
);

  return (
    <>
      <div className="staff-page">
        <Sidebar />

        <div className="staff-content">
          <div className="staff-header">
            <h1>Staff Management</h1>

            <button onClick={() => setShowModal(true)}>+ Add Staff</button>
          </div>

          <input
    type="text"
    placeholder="Search Staff..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
/>

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

            <tbody>
              {filteredStaff.map((member) => (
                <tr key={member._id}>
                  <td>{member.name}</td>

                  <td>{member.role}</td>

                  <td>{member.phone}</td>

                  <td>{member.shift}</td>

                  <td>₹ {member.salary}</td>

                  <td>
                    <button onClick={() => editStaff(member)}>
    Edit
</button>

                    <button
    className="delete-btn"
    onClick={() => deleteStaff(member._id)}
>
    Delete
</button>
                  </td>
                </tr>
              ))}
            </tbody>
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

            {!editId && (
    <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
    />
)}

            {!editId && (
    <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
    />
)}
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
              <button onClick={editId ? updateStaff : addStaff}>
    {editId ? "Update" : "Save"}
</button>

              <button
    className="cancel-btn"
    onClick={closeModal}
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

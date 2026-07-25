
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import "../../css/admin/Staff.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";


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

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openModal === "addStaff") {
      setShowModal(true);
    }
  }, [location.state]);

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
          <div className="staff-headers">

            <div>
              <p className="staff-small-title">
                Staff Management
              </p>

              <h1>Staff Members</h1>

              <span>
                Manage staff profiles, roles, shifts and salary details
              </span>
            </div>

            <button onClick={() => setShowModal(true)}>
              + Add Staff
            </button>

          </div>

          <div className="staff-search-box">

            <input
              type="text"
              placeholder="Search by name, role or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="staff-grid">

            {filteredStaff.length === 0 ? (

              <div className="staff-empty">

      <div className="staff-empty-icon">
        👨‍⚕️
      </div>

      <h3>No Staff Found</h3>

      <p>
        Staff members will appear here once they are added.
      </p>

    </div>

            ) : (

              filteredStaff.map((member) => (

                <div
                  className="staff-card"
                  key={member._id}
                >

                  <div className="staff-card-top">

                    <div className="staff-avatar">
                      {member.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <span
                      className={`staff-role-badge ${member.role
                        ?.toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {member.role}
                    </span>

                  </div>

                  <div className="staff-info">

                    <h3>{member.name}</h3>

                    <p className="staff-position">
                      {member.role}
                    </p>

                  </div>

                  <div className="staff-details-grid">

                    <div className="staff-detail-box">
                      <span>Phone</span>
                      <strong>{member.phone}</strong>
                    </div>

                    <div className="staff-detail-box">
                      <span>Shift</span>
                      <strong>{member.shift}</strong>
                    </div>

                    <div className="staff-detail-box salary-box">
                      <span>Salary</span>
                      <strong>
                        ₹ {Number(member.salary).toLocaleString("en-IN")}
                      </strong>
                    </div>

                  </div>

                  <div className="staff-card-actions">

                    <button
                      className="staff-edit-btn"
                      onClick={() => editStaff(member)}
                    >
                      Edit
                    </button>

                    <button
                      className="staff-delete-btn"
                      onClick={() => deleteStaff(member._id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-box staff-modal-box">

            <div className="staff-modal-header">
              <div className="staff-modal-icon">
                👨‍⚕️
              </div>

              <div>
                <p>Staff Management</p>

                <h2>
                  {editId ? "Update Staff Member" : "Add New Staff"}
                </h2>

                <span>
                  {editId
                    ? "Update staff information"
                    : "Create a new staff account"}
                </span>
              </div>

              <button
                className="modal-close-icon"
                onClick={closeModal}
              >
                ×
              </button>
            </div>


            <div className="staff-modal-body">

              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter staff name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>


              {!editId && (
                <div className="form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              )}


              {!editId && (
                <div className="form-group">
                  <label>Password</label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              )}


              <div className="form-group">
                <label>Staff Role</label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Role
                  </option>

                  <option value="Doctor">
                    Doctor
                  </option>

                  <option value="Nurse">
                    Nurse
                  </option>

                  <option value="Caretaker">
                    Caretaker
                  </option>

                  <option value="Manager">
                    Manager
                  </option>

                  <option value="Receptionist">
                    Receptionist
                  </option>
                </select>
              </div>


              <div className="form-group">
                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>


              <div className="form-group">
                <label>Shift</label>

                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Shift
                  </option>

                  <option value="Morning">
                    Morning
                  </option>

                  <option value="Evening">
                    Evening
                  </option>

                  <option value="Night">
                    Night
                  </option>
                </select>
              </div>


              <div className="form-group full-width">
                <label>Monthly Salary</label>

                <input
                  type="number"
                  name="salary"
                  placeholder="Enter salary"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>

            </div>


            <div className="staff-modal-footer">

              <button
                className="modal-cancel-btn"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="modal-save-btn"
                onClick={editId ? updateStaff : addStaff}
              >
                {editId ? "Update Staff" : "Add Staff"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Staff;

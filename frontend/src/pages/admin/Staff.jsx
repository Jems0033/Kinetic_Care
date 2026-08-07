import Sidebar from "../../components/Sidebar";
import axios from "axios";
import "../../css/admin/Staff.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Staff() {
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    staffId: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    role: "",
    shift: "",
    salary: "",
  });

  const [staff, setStaff] = useState([]);

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [alertBox, setAlertBox] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showAlert = (message, type = "success") => {
    setAlertBox({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setAlertBox({
        show: false,
        message: "",
        type: "",
      });
    }, 3000);
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

  const validateStaff = () => {
    if (!formData.name.trim()) return "Staff name is required.";

    if (!editId && !formData.email.trim()) return "Email is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!editId && !emailRegex.test(formData.email))
      return "Please enter a valid email address.";

    if (!formData.phone.trim()) return "Phone number is required.";

    if (!/^9[0-9]{9}$/.test(formData.phone))
      return "Phone number must contain exactly 10 digits and start with 9.";

    if (!formData.gender && !editId) return "Please select gender.";

    if (!formData.role) return "Please select staff role.";

    if (!formData.shift) return "Please select shift.";

    if (!formData.salary) return "Salary is required.";

    if (Number(formData.salary) <= 0) return "Please enter a valid salary.";

    return null;
  };

  useEffect(() => {
    getStaff();
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openModal === "addStaff") {
      setShowModal(true);
    }
  }, [location.state?.openModal]);

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const addStaff = async () => {
    try {
      const validationError = validateStaff();

      if (validationError) {
        return showAlert(validationError, "error");
      }
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/staff",
        {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          phone: formData.phone,
          gender: formData.gender,
          shift: formData.shift,
          salary: formData.salary,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      showAlert(
        "Staff added successfully. Login credentials have been sent to the registered email.",
        "success",
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "",
        role: "",
        shift: "",
        salary: "",
      });

      setShowModal(false);
      getStaff();
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Unable to Add Staff",
        "error",
      );
    }
  };

  const editStaff = (member) => {
    setFormData({
      name: member.name,
      phone: member.phone,
      gender: member.gender,
      role: member.role,
      shift: member.shift,
      salary: member.salary,
      email: "",
    });

    setEditId(member._id);

    setShowModal(true);
  };

  const updateStaff = async () => {
    try {
      const validationError = validateStaff();

      if (validationError) {
        return showAlert(validationError, "error");
      }
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/staff/${editId}`,

        {
          name: formData.name,
          role: formData.role,
          phone: formData.phone,
          shift: formData.shift,
          salary: formData.salary,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      showAlert("Staff Updated Successfully", "success");

      getStaff();

      setShowModal(false);

      setEditId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStaff = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/staff/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeleteConfirm({
        show: false,
        staffId: null,
      });

      await getStaff();

      showAlert("Staff Deleted Successfully", "success");

      getStaff();
    } catch (error) {
      console.log(error);
      setDeleteConfirm({
        show: false,
        staffId: null,
      });
      showAlert("Unable to Delete Staff", "error");
    }
  };

  const closeModal = () => {
    setShowModal(false);

    setEditId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "",
      role: "",
      shift: "",
      salary: "",
    });
  };

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.includes(search),
  );

  return (
    <>
      <div className="staff-page">
        {alertBox.show && (
          <div className={`order-banner ${alertBox.type} show`}>
            <div className="order-banner-icon">
              {alertBox.type === "success" ? "✔" : "✖"}
            </div>

            <div>
              <div className="order-banner-title">
                {alertBox.type === "success" ? "Success" : "Error"}
              </div>

              <div className="order-banner-detail">{alertBox.message}</div>
            </div>

            <button
              className="order-banner-close"
              onClick={() =>
                setAlertBox({
                  show: false,
                  message: "",
                  type: "",
                })
              }
            >
              ×
            </button>
          </div>
        )}

        {deleteConfirm.show && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-box">
              <div className="delete-confirm-icon">!</div>

              <h2>Delete Staff?</h2>

              <p>Are you sure you want to delete this Staff?</p>

              <div className="delete-confirm-actions">
                <button
                  className="delete-cancel-btn"
                  onClick={() =>
                    setDeleteConfirm({
                      show: false,
                      staffId: null,
                    })
                  }
                >
                  Cancel
                </button>

                <button
                  className="delete-confirm-btn"
                  onClick={() => deleteStaff(deleteConfirm.staffId)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <Sidebar />

        <div className="staff-content">
          <div className="staff-headers">
            <div>
              <h1>Staff Members</h1>

              <span>
                Manage staff profiles, roles, shifts and salary details
              </span>
            </div>

            <button onClick={() => setShowModal(true)}>+ Add Staff</button>
          </div>

          <div className="staff-search-box">
            <input
              type="text"
              placeholder="Search staff by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="staff-search-clear-btn"
                onClick={() => setSearch("")}
                type="button"
              >
                ✕
              </button>
            )}
          </div>

          <div className="staff-grid">
            {filteredStaff.length === 0 ? (
              <div className="staff-empty">
                <div className="staff-empty-icon">👨‍⚕️</div>

                <h3>No Staff Found</h3>

                <p>Staff members will appear here once they are added.</p>
              </div>
            ) : (
              filteredStaff.map((member) => (
                <div className="staff-card" key={member._id}>
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
                    <div className="staff-name-row">
                      <span>
                        {member.role === "Doctor"
                          ? `Dr. ${member.name}`
                          : member.name}
                      </span>

                      <span className="gender-badge">
                        {member.gender === "Male" ? "♂ Male" : "♀ Female"}
                      </span>
                    </div>

                    <p className="staff-position">{member.role}</p>
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
                      onClick={() =>
                        setDeleteConfirm({
                          show: true,
                          staffId: member._id,
                        })
                      }
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
              <div className="staff-modal-icon">👨‍⚕️</div>

              <div>
                <p>Staff Management</p>

                <h2>{editId ? "Update Staff Member" : "Add New Staff"}</h2>

                <span>
                  {editId
                    ? "Update staff information"
                    : "Create a new staff account. Login credentials will be sent automatically by email."}
                </span>
              </div>

              <button className="modal-close-icon" onClick={closeModal}>
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

              <div className="form-group">
                <label>Staff Role</label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>

                  <option value="Doctor">Doctor</option>

                  <option value="Caretaker">Caretaker</option>
                </select>
              </div>
              {!editId && (
                <div className="form-group">
                  <label>Gender</label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              )}
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
              <button className="modal-cancel-btn" onClick={closeModal}>
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

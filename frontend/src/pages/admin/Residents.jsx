import Sidebar from "../../components/Sidebar";
import "../../css/admin/Residents.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";


function Residents() {
  const location = useLocation();
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [rooms, setRooms] = useState([]);

  const [showSecondResident, setShowSecondResident] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState({
  show: false,
  residentId: null,
});

  const [secondResident, setSecondResident] = useState({
    name: "",
    age: "",
    gender: "",
    medicalCondition: "",
  });
  const [alertBox, setAlertBox] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    room: "",
    status: "Active",
    medicalCondition: "",
    familyName: "",
    familyEmail: "",
    familyPhone: "",
    familyPassword: "",
    relation: "",
  });

  useEffect(() => {
    getResidents();
    getRooms();
  }, []);



  useEffect(() => {
    if (location.state?.openModal === "addResident") {
      setShowModal(true);

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, []);

  useEffect(() => {
  if (location.state?.searchResident) {
    setSearch(location.state.searchResident);

    navigate(location.pathname, {
      replace: true,
      state: {},
    });
  }
}, [location, navigate]);
  


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

  const getErrorMessage = (error) => {
    const msg = error.response?.data?.message || "";

    switch (msg) {
      case "Family Email Already Exists":
        return "This family email is already registered.";

      case "Resident Not Found":
        return "Resident not found.";

      case "Unable to Delete Resident":
        return "Unable to delete the resident.";

      case "Discharged residents cannot be updated.":
        return "Discharged residents cannot be updated.";

      default:
        return "Something went wrong. Please try again.";
    }
  };

const validateResident = () => {
  if (!formData.name.trim())
    return "Resident name is required.";

  if (!formData.age)
    return "Age is required.";

  if (Number(formData.age) <= 0)
    return "Please enter a valid age.";

  if (!formData.gender)
    return "Please select gender.";

  if (!formData.room)
    return "Please select a room.";

  if (!formData.medicalCondition.trim())
    return "Medical condition is required.";

  // Family Details (optional)
  if (formData.familyEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.familyEmail))
      return "Please enter a valid family email.";

    if (!formData.familyName.trim())
      return "Family name is required.";

    if (!formData.familyPhone.trim())
      return "Family phone number is required.";

    if (!/^9[0-9]{9}$/.test(formData.familyPhone))
      return "Family phone number must contain exactly 10 digits and start with 9.";

if (!editId) {
  if (!formData.familyPassword.trim()) {
    return "Family password is required.";
  }

  if (formData.familyPassword.length < 6) {
    return "Family password must be at least 6 characters.";
  }
}

    if (!formData.relation.trim())
      return "Relation is required.";
  }

  // Couple Admission Validation
  if (showSecondResident) {
    if (!secondResident.name.trim())
      return "Second resident name is required.";

    if (!secondResident.age)
      return "Second resident age is required.";

    if (Number(secondResident.age) <= 0)
      return "Please enter a valid second resident age.";

    if (!secondResident.gender)
      return "Please select second resident gender.";

    if (!secondResident.medicalCondition.trim())
      return "Second resident medical condition is required.";

    const selectedRoom = rooms.find(
      (room) => room._id === formData.room
    );

    if (!selectedRoom)
      return "Please select a room.";

    if (selectedRoom.roomType !== "Double")
      return "Family residents can only stay in Double Bed rooms.";
  }

  return null;
};
  const getResidents = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/residents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      setResidents(response.data);
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSecondResidentChange = (e) => {
    setSecondResident({
      ...secondResident,
      [e.target.name]: e.target.value,
    });
  };

  const addResident = async () => {
    try {
      const validationError = validateResident();

      if (validationError) {
        return showAlert(validationError, "error");
      }
      console.log("Save Clicked");
      const token = localStorage.getItem("token");

      const payload = showSecondResident
  ? {
      isFamily: true,
      resident1: formData,
      resident2: secondResident,
    }
  : {
      isFamily: false,
      ...formData,
    };

await axios.post(
  "http://localhost:5000/api/residents",
  payload,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      showAlert("Resident Added Successfully", "success");

      setShowModal(false);

      getResidents();

      setFormData({
        name: "",
        age: "",
        gender: "",
        room: "",
        status: "Active",
        medicalCondition: "",
        familyName: "",
        familyEmail: "",
        familyPhone: "",
        familyPassword: "",
        relation: "",
      });
      setShowSecondResident(false);

      setSecondResident({
        name: "",
        age: "",
        gender: "",
        medicalCondition: "",
      });
    } catch (error) {
      console.log(error.response?.data);
      showAlert(getErrorMessage(error), "error");
    }
  };

  const closeModal = () => {
    setShowModal(false);

    setEditId(null);

    setFormData({
      name: "",
      age: "",
      gender: "",
      room: "",
      status: "Active",
      medicalCondition: "",

      familyName: "",
      familyEmail: "",
      familyPhone: "",
      familyPassword: "",
      relation: "",
    });
    setShowSecondResident(false);

    setSecondResident({
      name: "",
      age: "",
      gender: "",
      medicalCondition: "",
    });
  };

  const editResident = (resident) => {
    setFormData({
      name: resident.name,

      age: resident.age,

      gender: resident.gender,

      room: resident.room?._id,

      medicalCondition: resident.medicalCondition,

      status: resident.status,

      familyName: resident.family?.name || "",

      familyEmail: resident.family?.email || "",

      familyPhone: resident.family?.phone || "",

      familyPassword: "",

      relation: resident.family?.relation || "",
    });

    setEditId(resident._id);

    setShowModal(true);
  };

  const updateResident = async () => {
  try {
    const validationError = validateResident();

    if (validationError) {
      return showAlert(validationError, "error");
    }

    const token = localStorage.getItem("token");

    const updateData = { ...formData };

    // Empty password backend પર send નહીં કરવો
    delete updateData.familyPassword;

    await axios.put(
      `http://localhost:5000/api/residents/${editId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    showAlert("Resident Updated Successfully", "success");

    setShowModal(false);
    setEditId(null);
    getResidents();
  } catch (error) {
    console.log(error.response?.data);
    showAlert(getErrorMessage(error), "error");
  }
};

  const deleteResident = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/residents/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setDeleteConfirm({
      show: false,
      residentId: null,
    });

    await getResidents();

    showAlert("Resident deleted successfully.", "success");

  } catch (error) {
    console.log(error.response?.data);

    setDeleteConfirm({
      show: false,
      residentId: null,
    });

    showAlert(getErrorMessage(error), "error");
  }
};

  const filteredResidents = residents.filter((resident) =>
    resident.name.toLowerCase().includes(search.toLowerCase()),
  );

  const getRooms = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/rooms/available",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRooms(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="residents">
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

      <h2>Delete Resident?</h2>

      <p>
        Are you sure you want to delete this resident?
      </p>

      <div className="delete-confirm-actions">

        <button
          className="delete-cancel-btn"
          onClick={() =>
            setDeleteConfirm({
              show: false,
              residentId: null,
            })
          }
        >
          Cancel
        </button>

        <button
          className="delete-confirm-btn"
          onClick={() =>
            deleteResident(deleteConfirm.residentId)
          }
        >
          Delete
        </button>

      </div>

    </div>
  </div>
)}

      <Sidebar />

      <div className="resident-content">
        <div className="resident-header">
          <div>

            <h1>Residents</h1>

            <span>Manage resident profiles, rooms and family details</span>
          </div>

          <button onClick={() => setShowModal(true)}>+ Add Resident</button>
        </div>

        <div className="residents-search-box">
  <input
    type="text"
    placeholder="Search resident by name..."
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
        <div className="resident-grid">
          {filteredResidents.length === 0 ? (
            <div className="resident-empty">
              <div className="resident-empty-icon">👴</div>

              <h3>No Residents Found</h3>

              <p>Residents will appear here once they are added.</p>
            </div>
          ) : (
            filteredResidents.map((resident) => (
              <div className="resident-profile-card" key={resident._id}>
                <div className="resident-card-header">
                  <div className="resident-avatar">
                    {resident.gender === "Male" ? "👴" : "👵"}
                  </div>

                  <span
                    className={`resident-status ${
                      resident.status === "Active"
                        ? "active"
                        : resident.status === "Temporary Leave"
                          ? "temporary"
                          : "discharged"
                    }`}
                  >
                    {resident.status}
                  </span>
                </div>

                <div className="resident-main-info">
                  <h2>{resident.name}</h2>

                  <p>
                    {resident.medicalCondition || "No medical condition added"}
                  </p>
                </div>

                <div className="resident-detail-grid">
                  <div>
                    <span>Age</span>
                    <strong>{resident.age}</strong>
                  </div>

                  <div>
                    <span>Gender</span>
                    <strong>{resident.gender}</strong>
                  </div>

                  <div>
                    <span>Room</span>

                    <strong>
                      {resident.room?.roomNumber || "Not Assigned"}
                    </strong>
                  </div>
                </div>

                <div className="resident-care-team-box">
                  <div className="care-team-title">
                    <span>Assigned Care Team</span>
                  </div>
                  <div className="care-team-grid">
                    <div className="care-member">
                      <span className="member-label">Morning Doctor</span>
                      <strong>
                        {resident.morningDoctor?.name || "Not Assigned"}
                      </strong>
                    </div>
                    <div className="care-member">
                      <span className="member-label">Morning Caretaker</span>
                      <strong>
                        {resident.morningCaretaker?.name || "Not Assigned"}
                      </strong>
                    </div>
                    <div className="care-member">
                      <span className="member-label">Night Doctor</span>
                      <strong>
                        {resident.nightDoctor?.name || "Not Assigned"}
                      </strong>
                    </div>
                    <div className="care-member">
                      <span className="member-label">Night Caretaker</span>
                      <strong>
                        {resident.nightCaretaker?.name || "Not Assigned"}
                      </strong>
                    </div>
                  </div>
                </div>

                {resident.family?.name && (<div className="resident-family-box">
                  <div className="family-box-title">
                    <span>Family Contact</span>
                  </div>

                  <div className="family-person">
                    <div className="family-avatar">
                      {resident.family?.name?.charAt(0)?.toUpperCase() || "F"}
                    </div>

                    <div>
                      <strong>{resident.family?.name || "Not Added"}</strong>

                      <p>{resident.family?.relation || "No relation"}</p>
                    </div>
                  </div>

                  {resident.family?.phone && (
                    <small>📞 {resident.family.phone}</small>
                  )}
                </div>)}

                <div className="resident-card-actions">
                  <button
                    className="resident-edit-btn"
                    disabled={resident.status === "Discharged"}
                    onClick={() => editResident(resident)}
                  >
                    Edit
                  </button>

                  <button
  className="resident-delete-btn"
  onClick={() =>
    setDeleteConfirm({
      show: true,
      residentId: resident._id,
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
      {showModal && (
        <div className="resident-modal-overlay">
          <div className="resident-modal-box">
            <button className="resident-modal-close" onClick={closeModal}>
              ×
            </button>

            <div className="resident-modal-header">
              <div className="resident-modal-avatar">👴</div>

              <div>
                <p>Resident Management</p>

                <h2>{editId ? "Update Resident" : "Add New Resident"}</h2>

                <span>
                  {editId
                    ? "Update resident and family information."
                    : "Register a new resident in Kinetic Care."}
                </span>
              </div>
            </div>

            {/* RESIDENT DETAILS */}

            <div className="resident-form-section">
              <div className="form-section-title">
                <span>01</span>

                <div>
                  <h3>Resident Details</h3>
                  <p>Basic and medical information</p>
                </div>
              </div>

              <div className="resident-modal-form">
                <div className="resident-form-group">
                  <label>Resident Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter resident name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="resident-form-group">
                  <label>Age</label>

                  <input
                    type="number"
                    name="age"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                <div className="resident-form-group">
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

                <div className="resident-form-group">
                  <label>Room</label>

                  <select
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                  >
                    <option value="">Select Room</option>

                    {rooms
                      .filter((room) =>
                        showSecondResident ? room.roomType === "Double" : true,
                      )
                      .map((room) => (
                        <option key={room._id} value={room._id}>
                          Room {room.roomNumber} ({room.roomType})
                        </option>
                      ))}
                  </select>
                </div>

                {editId && (
                  <div className="resident-form-group">
                    <label>Status</label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Temporary Leave">Temporary Leave</option>
                      <option value="Discharged">Discharged</option>
                    </select>
                  </div>
                )}

                <div className="resident-form-group">
                  <label>Medical Condition</label>

                  <input
                    type="text"
                    name="medicalCondition"
                    placeholder="Example: Diabetes"
                    value={formData.medicalCondition}
                    onChange={handleChange}
                  />
                </div>
                
              </div>
              {!showSecondResident && (
  <div className="resident-add-second-wrapper">
    <button
      type="button"
      className="resident-add-second-btn"
      onClick={() => setShowSecondResident(true)}
    >
      <span className="add-icon">+</span>
      Add Another Resident
    </button>
  </div>
)}
                {showSecondResident && (
                  <div className="resident-form-section">
                    <div className="form-section-title">
                      <span>02</span>

                      <div>
                        <h3>Second Resident</h3>
                        <p>Enter second resident details</p>
                      </div>
                    </div>

                    <div className="resident-modal-form">
                      <div className="resident-form-group">
                        <label>Name</label>

                        <input
                          type="text"
                          name="name"
                          value={secondResident.name}
                          onChange={handleSecondResidentChange}
                        />
                      </div>

                      <div className="resident-form-group">
                        <label>Age</label>

                        <input
                          type="number"
                          name="age"
                          value={secondResident.age}
                          onChange={handleSecondResidentChange}
                        />
                      </div>

                      <div className="resident-form-group">
                        <label>Gender</label>

                        <select
                          name="gender"
                          value={secondResident.gender}
                          onChange={handleSecondResidentChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      <div className="resident-form-group">
                        <label>Medical Condition</label>

                        <input
                          type="text"
                          name="medicalCondition"
                          value={secondResident.medicalCondition}
                          onChange={handleSecondResidentChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
            </div>


            {/* FAMILY DETAILS */}

            <div className="resident-form-section family-section">
              <div className="form-section-title">
                <span>02</span>

                <div>
                  <h3>Family Details</h3>
                  <p>Emergency and login contact information</p>
                </div>
              </div>

              <div className="resident-modal-form">
                <div className="resident-form-group">
                  <label>Family Member Name</label>

                  <input
                    type="text"
                    name="familyName"
                    placeholder="Enter family member name"
                    value={formData.familyName}
                    onChange={handleChange}
                  />
                </div>

                <div className="resident-form-group">
                  <label>Relation</label>

                  <input
                    type="text"
                    name="relation"
                    placeholder="Example: Son"
                    value={formData.relation}
                    onChange={handleChange}
                  />
                </div>

                <div className="resident-form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="familyEmail"
                    placeholder="Enter email address"
                    value={formData.familyEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className="resident-form-group">
                  <label>Phone</label>

                  <input
                    type="text"
                    name="familyPhone"
                    placeholder="Enter phone number"
                    value={formData.familyPhone}
                    onChange={handleChange}
                  />
                </div>

                {!editId && (
                  <div className="resident-form-group full-width">
                    <label>Password</label>

                    <input
                      type="password"
                      name="familyPassword"
                      placeholder="Create family login password"
                      value={formData.familyPassword}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="resident-modal-actions">
              <button className="resident-cancel-btn" onClick={closeModal}>
                Cancel
              </button>

              <button
                className="resident-save-btn"
                onClick={editId ? updateResident : addResident}
              >
                {editId ? "Update Resident" : "Add Resident"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Residents;
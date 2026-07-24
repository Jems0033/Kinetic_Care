import Sidebar from "../../components/Sidebar";
import "../../css/admin/Residents.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function Residents() {
  const [residents, setResidents] = useState([]);
  useEffect(() => {
    getResidents();
    getRooms();
  }, []);

  const [showModal, setShowModal] = useState(false);

  const location = useLocation();
const navigate = useNavigate();

useEffect(() => {
  if (location.state?.openModal === "addResident") {
    setShowModal(true);

    navigate(location.pathname, {
      replace: true,
      state: {},
    });
  }
}, []);


  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    room: "",
    status: "",
    medicalCondition: "",

    familyName: "",
    familyEmail: "",
    familyPhone: "",
    familyPassword: "",
    relation: "",
  });

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [rooms, setRooms] = useState([]);

  const getResidents = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/residents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  const addResident = async () => {
    try {
      console.log("Save Clicked");
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/residents",

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Resident Added Successfully");

      setShowModal(false);

      getResidents();

      setFormData({
        name: "",
        age: "",
        gender: "",
        room: "",
        status: "",
        medicalCondition: "",
        familyName: "",
        familyEmail: "",
        familyPhone: "",
        familyPassword: "",
        relation: "",
      });
    } catch (error) {
      console.log(error);

      console.log(error.response);

      console.log(error.response?.data);
      alert("Unable to Add Resident");
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
      status: "",
      medicalCondition: "",

      familyName: "",
      familyEmail: "",
      familyPhone: "",
      familyPassword: "",
      relation: "",
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

      relation: resident.family?.relation || ""

    });

    setEditId(resident._id);

    setShowModal(true);

  };

  const updateResident = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/residents/${editId}`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Resident Updated Successfully");

      setShowModal(false);

      setEditId(null);

      getResidents();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteResident = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resident?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/residents/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Resident Deleted Successfully");

      getResidents();
    } catch (error) {
      console.log(error);

      alert("Unable to Delete Resident");
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
      <Sidebar />

      <div className="resident-content">
        <div className="resident-header">

  <div>
    <p className="resident-small-title">
      Resident Management
    </p>

    <h1>Residents</h1>

    <span>
      Manage resident profiles, rooms and family details
    </span>
  </div>

  <button onClick={() => setShowModal(true)}>
    + Add Resident
  </button>

</div>

<div className="residents-search-box">

  <input
    type="text"
    placeholder="Search resident by name..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

</div>
        <div className="resident-grid">

  {filteredResidents.length === 0 ? (

    <div className="resident-empty">

      <div className="resident-empty-icon">
        👴
      </div>

      <h3>No Residents Found</h3>

      <p>
        Residents will appear here once they are added.
      </p>
    </div>

  ) : (

    filteredResidents.map((resident) => (

      <div
        className="resident-profile-card"
        key={resident._id}
      >

        <div className="resident-card-header">

          <div className="resident-avatar">
            {resident.gender === "Male" ? "👴" : "👵"}
          </div>

          <span
            className={`resident-status ${
              resident.status === "Active"
                ? "active"
                : "discharged"
            }`}
          >
            {resident.status}
          </span>

        </div>

        <div className="resident-main-info">

          <h2>{resident.name}</h2>

          <p>
            {resident.medicalCondition ||
              "No medical condition added"}
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

        <div className="resident-family-box">

          <div className="family-box-title">
            <span>Family Contact</span>
          </div>

          <div className="family-person">

            <div className="family-avatar">
              {resident.family?.name
                ?.charAt(0)
                ?.toUpperCase() || "F"}
            </div>

            <div>
              <strong>
                {resident.family?.name || "Not Added"}
              </strong>

              <p>
                {resident.family?.relation || "No relation"}
              </p>
            </div>

          </div>

          {resident.family?.phone && (
            <small>
              📞 {resident.family.phone}
            </small>
          )}

        </div>

        <div className="resident-card-actions">

          <button
            className="resident-edit-btn"
            onClick={() => editResident(resident)}
          >
            Edit
          </button>

          <button
            className="resident-delete-btn"
            onClick={() =>
              deleteResident(resident._id)
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

      <button
        className="resident-modal-close"
        onClick={closeModal}
      >
        ×
      </button>

      <div className="resident-modal-header">

        <div className="resident-modal-avatar">
          👴
        </div>

        <div>

          <p>Resident Management</p>

          <h2>
            {editId
              ? "Update Resident"
              : "Add New Resident"}
          </h2>

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

              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

            </select>

          </div>

          <div className="resident-form-group">

            <label>Room</label>

            <select
              name="room"
              value={formData.room}
              onChange={handleChange}
            >

              <option value="">
                Select Room
              </option>

              {rooms.map((room) => (

                <option
                  key={room._id}
                  value={room._id}
                >
                  Room {room.roomNumber}
                </option>

              ))}

            </select>

          </div>

          <div className="resident-form-group">

            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >

              <option value="">
                Select Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Discharged">
                Discharged
              </option>

            </select>

          </div>

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

        <button
          className="resident-cancel-btn"
          onClick={closeModal}
        >
          Cancel
        </button>

        <button
          className="resident-save-btn"
          onClick={
            editId
              ? updateResident
              : addResident
          }
        >
          {editId
            ? "Update Resident"
            : "Add Resident"}
        </button>

      </div>

    </div>

  </div>

)}
    </div>
  );
}

export default Residents;

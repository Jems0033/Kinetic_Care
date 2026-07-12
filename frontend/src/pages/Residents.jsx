import Sidebar from "../components/Sidebar";
import "../css/Residents.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Residents() {
  const [residents, setResidents] = useState([]);
  useEffect(() => {
    getResidents();
    getRooms();
  }, []);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    room: "",
    medicalCondition: "",
  });

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [rooms, setRooms] = useState([]);

  const getResidents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/residents",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setResidents(res.data);
    } catch (err) {
      console.log(err);
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
    });
  };

  const editResident = (resident) => {
    setFormData({
      name: resident.name,
      age: resident.age,
      gender: resident.gender,
      room: resident.room,
      medicalCondition: resident.medicalCondition,
      status: resident.status,
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
          <h1>Residents</h1>

          <button onClick={() => setShowModal(true)}>+ Add Resident</button>
        </div>

        <input
          type="text"
          placeholder="Search Resident..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th>Name</th>

              <th>Age</th>

              <th>Gender</th>

              <th>Room</th>

              <th>Status</th>

              <th>MedicalCondition</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredResidents.map((resident) => (
              <tr key={resident._id}>
                <td>{resident.name}</td>

                <td>{resident.age}</td>

                <td>{resident.gender}</td>

                <td>{resident.room?.roomNumber}</td>

                <td>{resident.status}</td>

                <td>{resident.medicalCondition}</td>

                <td>
                  <button onClick={() => editResident(resident)}>Edit</button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteResident(resident._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h2>Add Resident</h2>

            <input
              type="text"
              name="name"
              placeholder="Resident Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>

              <option value="Male">Male</option>

              <option value="Female">Female</option>
            </select>

            <select name="room" value={formData.room} onChange={handleChange}>
              <option value="">Select Room</option>

              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.roomNumber}
                </option>
              ))}
            </select>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Discharged">Discharged</option>
            </select>

            <input
              type="text"
              name="medicalCondition"
              placeholder="Medical Condition"
              value={formData.medicalCondition}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button onClick={editId ? updateResident : addResident}>
                {editId ? "Update" : "Save"}
              </button>

              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Residents;

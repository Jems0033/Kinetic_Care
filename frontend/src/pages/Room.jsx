import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../css/Room.css";

function Room() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    roomNumber: "",

    roomType: "",

    capacity: "",

    status: "Available",
  });

  useEffect(() => {
    getRooms();
  }, []);

  // ===========================
  // Get Rooms
  // ===========================

  const getRooms = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/rooms",

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

  // ===========================
  // Handle Change
  // ===========================

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // Add Room
  // ===========================

  const addRoom = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/rooms",

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Room Added Successfully");

      closeModal();

      getRooms();
    } catch (error) {
      console.log(error);

      alert("Unable to Add Room");
    }
  };

  // ===========================
  // Edit Room
  // ===========================

  const editRoom = (room) => {
    setEditId(room._id);

    setFormData({
      roomNumber: room.roomNumber,

      roomType: room.roomType,

      capacity: room.capacity,

      status: room.status,
    });

    setShowModal(true);
  };

  // ===========================
  // Update Room
  // ===========================

  const updateRoom = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/rooms/${editId}`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Room Updated Successfully");

      closeModal();

      getRooms();
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // Delete Room
  // ===========================

  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/rooms/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Room Deleted Successfully");

      getRooms();
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // Close Modal
  // ===========================

  const closeModal = () => {
    setEditId(null);

    setShowModal(false);

    setFormData({
      roomNumber: "",

      roomType: "",

      capacity: "",

      status: "Available",
    });
  };

  // ===========================
  // Search
  // ===========================

  const filteredRooms = rooms.filter(
    (room) =>
      room.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      room.roomType.toLowerCase().includes(search.toLowerCase()) ||
      room.status.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="room-page">
        <Sidebar />

        <div className="room-content">
          <div className="room-header">
            <h1>Room Management</h1>

            <button
              onClick={() => {
                closeModal();

                setShowModal(true);
              }}
            >
              + Add Room
            </button>
          </div>

          <input
            type="text"
            placeholder="Search Room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <table>
            <thead>
              <tr>
                <th>Room No</th>

                <th>Room Type</th>

                <th>Capacity</th>

                <th>Occupied</th>

                <th>Status</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.roomNumber}</td>

                  <td>{room.roomType}</td>

                  <td>{room.capacity}</td>

                  <td>
                    {room.occupiedBeds} / {room.capacity}
                  </td>

                  <td>
                    <span
                      className={
                        room.status === "Available"
                          ? "available"
                          : room.status === "Occupied"
                            ? "occupied"
                            : "maintenance"
                      }
                    >
                      {room.status}
                    </span>
                  </td>

                  <td>
                    <button className="edit-btn" onClick={() => editRoom(room)}>
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteRoom(room._id)}
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
            <h2>{editId ? "Edit Room" : "Add Room"}</h2>

            <input
              type="text"
              name="roomNumber"
              placeholder="Room Number"
              value={formData.roomNumber}
              onChange={handleChange}
            />

            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
            >
              <option value="">Select Room Type</option>

              <option value="Single">Single</option>

              <option value="Double">Double</option>

              <option value="Deluxe">Deluxe</option>
            </select>

            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={handleChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Available">Available</option>

              <option value="Occupied">Occupied</option>

              <option value="Maintenance">Maintenance</option>
            </select>

            <div className="modal-buttons">
              <button onClick={editId ? updateRoom : addRoom}>
                {editId ? "Update" : "Save"}
              </button>

              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Room;

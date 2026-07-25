import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../css/admin/Room.css";
import { useLocation} from "react-router-dom";


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

  const location = useLocation();

useEffect(() => {
  if (location.state?.openModal === "addRoom") {
    setShowModal(true);
  }
}, [location.state]);

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

  <div>
    <p className="room-small-title">
      Facility Management
    </p>

    <h1>Room Management</h1>

    <span>
      Manage room availability, capacity and occupancy
    </span>
  </div>

  <button
    onClick={() => {
      closeModal();
      setShowModal(true);
    }}
  >
    + Add Room
  </button>

</div>

<div className="room-search-box">

  <input
    type="text"
    placeholder="Search by room number, type or status..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

</div>

          <div className="room-grid">

  {filteredRooms.length === 0 ? (

    <div className="room-empty">

      <div className="room-empty-icon">
        🛏️
      </div>

      <h3>No Rooms Found</h3>

      <p>
        Rooms will appear here once they are added.
      </p>
    </div>

  ) : (

    filteredRooms.map((room) => {

      const occupied = Number(room.occupiedBeds || 0);
      const capacity = Number(room.capacity || 0);

      const percentage =
        capacity > 0
          ? Math.min((occupied / capacity) * 100, 100)
          : 0;

      return (

        <div
          className="room-card"
          key={room._id}
        >

          <div className="room-card-top">

            <div className="room-number-box">
              <span>ROOM</span>
              <h2>{room.roomNumber}</h2>
            </div>

            <span
              className={`room-status-badge ${
                room.status === "Available"
                  ? "available"
                  : room.status === "Occupied"
                    ? "occupied"
                    : "maintenance"
              }`}
            >
              {room.status}
            </span>

          </div>

          <div className="room-card-info">

            <div>
              <span>Room Type</span>
              <strong>{room.roomType}</strong>
            </div>

            <div>
              <span>Capacity</span>
              <strong>{room.capacity} Beds</strong>
            </div>

          </div>

          <div className="occupancy-section">

            <div className="occupancy-header">
              <span>Occupancy</span>

              <strong>
                {occupied} / {capacity}
              </strong>
            </div>

            <div className="occupancy-bar">
              <div
                className="occupancy-fill"
                style={{
                  width: `${percentage}%`,
                }}
              ></div>
            </div>

            <small>
              {capacity - occupied > 0
                ? `${capacity - occupied} bed(s) available`
                : "Room is full"}
            </small>

          </div>

          <div className="room-actions">

            <button
              className="room-edit-btn"
              onClick={() => editRoom(room)}
            >
              Edit Room
            </button>

            <button
              className="room-delete-btn"
              onClick={() => deleteRoom(room._id)}
            >
              Delete
            </button>

          </div>

        </div>

      );

    })

  )}

</div>
        </div>
      </div>
{showModal && (
  <div className="room-modal-overlay">

    <div className="room-modal-box single-room-modal">

      <div className="room-modal-right">

        <button
          className="room-modal-close"
          onClick={closeModal}
        >
          ×
        </button>

        <div className="room-modal-title">

          <p>Room Management</p>

          <h2>
            {editId ? "Edit Room" : "Add New Room"}
          </h2>

          <span>
            {editId
              ? "Update room details and availability."
              : "Create a new room for the facility."}
          </span>

        </div>

        <div className="room-modal-form">

          <div className="room-form-group">

            <label>Room Number</label>

            <input
              type="text"
              name="roomNumber"
              placeholder="Example: A-101"
              value={formData.roomNumber}
              onChange={handleChange}
            />

          </div>

          <div className="room-form-group">

            <label>Room Type</label>

            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
            >

              <option value="">
                Select Room Type
              </option>

              <option value="Single">
                Single
              </option>

              <option value="Double">
                Double
              </option>

              <option value="Deluxe">
                Deluxe
              </option>

            </select>

          </div>

          <div className="room-form-group">

            <label>Capacity</label>

            <input
              type="number"
              name="capacity"
              min="1"
              placeholder="Enter bed capacity"
              value={formData.capacity}
              onChange={handleChange}
            />

          </div>

          <div className="room-form-group">

            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >

              <option value="Available">
                Available
              </option>

              <option value="Occupied">
                Occupied
              </option>

              <option value="Maintenance">
                Maintenance
              </option>

            </select>

          </div>

        </div>

        <div className="room-modal-actions">

          <button
            className="room-cancel-btn"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            className="room-save-btn"
            onClick={editId ? updateRoom : addRoom}
          >
            {editId ? "Update Room" : "Add Room"}
          </button>

        </div>

      </div>

    </div>

  </div>
)}
          </>
  );
}

export default Room;

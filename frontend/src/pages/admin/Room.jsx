import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../css/admin/Room.css";
import { useLocation } from "react-router-dom";

function Room() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    roomId: null,
  });

  const [formData, setFormData] = useState({
    roomNumber: "",

    roomType: "Single",

    capacity: "",

    status: "Available",
  });

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
  const validateRoom = () => {
    if (!formData.roomNumber.trim()) return "Room Number is required.";

    // A101 અથવા A-101 format જ allow
    const roomRegex = /^[A-Z]\d{3}$/;

    if (!roomRegex.test(formData.roomNumber.trim().toUpperCase()))
      return "Room Number must be in A101 format.";

    if (!formData.capacity) return "Number of Beds is required.";

    if (Number(formData.capacity) <= 0)
      return "Number of Beds must be greater than 0.";

    return null;
  };

  const getErrorMessage = (error) => {
    const msg = error.response?.data?.message || "";

    switch (msg) {
      case "Room Number Already Exists":
        return "This room number already exists.";

      case "Room Number must be in A101 or A-101 format.":
        return "Room number must be in A101 format.";

      default:
        return msg || "Something went wrong.";
    }
  };
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
    let { name, value } = e.target;

    if (name === "roomNumber") {
      value = value.toUpperCase();
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ===========================
  // Add Room
  // ===========================

  const addRoom = async () => {
    try {
      const validationError = validateRoom();

      if (validationError) {
        return showAlert(validationError, "error");
      }
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

      showAlert("Room Added Successfully", "success");

      closeModal();

      getRooms();
    } catch (error) {
      console.log(error);

      showAlert(getErrorMessage(error), "error");
    }
  };

  // ===========================
  // Edit Room
  // ===========================

  const editRoom = (room) => {
    setEditId(room._id);

    setFormData({
      roomNumber: room.roomNumber,

      roomType: "Single",

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
      const validationError = validateRoom();

      if (validationError) {
        return showAlert(validationError, "error");
      }
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

      showAlert("Room Updated Successfully", "success");

      closeModal();

      getRooms();
    } catch (error) {
      console.log(error);

      showAlert(getErrorMessage(error), "error");
    }
  };

  // ===========================
  // Delete Room
  // ===========================

  const deleteRoom = async (id) => {
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
      setDeleteConfirm({
        show: false,
        roomId: null,
      });

      await getRooms();

      showAlert("Room Deleted Successfully", "success");

      getRooms();
    } catch (error) {
      console.log(error);
      setDeleteConfirm({
        show: false,
        roomId: null,
      });
      showAlert(
        error.response?.data?.message || "Unable to Delete Room",
        "error",
      );
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

      roomType: "Single",

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

              <h2>Delete Room?</h2>

              <p>Are you sure you want to delete this Room?</p>

              <div className="delete-confirm-actions">
                <button
                  className="delete-cancel-btn"
                  onClick={() =>
                    setDeleteConfirm({
                      show: false,
                      roomId: null,
                    })
                  }
                >
                  Cancel
                </button>

                <button
                  className="delete-confirm-btn"
                  onClick={() => deleteRoom(deleteConfirm.roomId)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <Sidebar />

        <div className="room-content">
          <div className="room-header">
            <div>
              <h1>Rooms</h1>

              <span>Manage room availability, capacity and occupancy</span>
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
              placeholder="Search room by room number..."
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

          <div className="room-grid">
            {filteredRooms.length === 0 ? (
              <div className="room-empty">
                <div className="room-empty-icon">🛏️</div>

                <h3>No Rooms Found</h3>

                <p>Rooms will appear here once they are added.</p>
              </div>
            ) : (
              filteredRooms.map((room) => {
                const occupied = Number(room.occupiedBeds || 0);

                const capacity = Number(room.capacity);

                const percentage =
                  capacity > 0 ? Math.min((occupied / capacity) * 100, 100) : 0;

                return (
                  <div className="room-card" key={room._id}>
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
                        <span>Number of Beds</span>
                        <strong>
                          {room.capacity} {room.roomType} Bed
                          {room.capacity > 1 ? "s" : ""}
                        </strong>
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
                          ? `${capacity - occupied} resident slot(s) available`
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
                        onClick={() =>
                          setDeleteConfirm({
                            show: true,
                            roomId: room._id,
                          })
                        }
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
              <button className="room-modal-close" onClick={closeModal}>
                ×
              </button>

              <div className="room-modal-title">
                <p>Room Management</p>

                <h2>{editId ? "Edit Room" : "Add New Room"}</h2>

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
                  <label>Capacity</label>

                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    placeholder="Enter number of beds"
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
                    <option value="Available">Available</option>

                    <option value="Occupied">Occupied</option>

                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="room-modal-actions">
                <button className="room-cancel-btn" onClick={closeModal}>
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

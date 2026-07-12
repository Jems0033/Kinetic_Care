import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../css/Event.css";

function Event() {
  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",

    description: "",

    date: "",

    time: "",

    location: "",
  });

  useEffect(() => {
    getEvents();
  }, []);
  const getEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/events",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };
  const addEvent = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/events",

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Event Added Successfully");

      closeModal();

      getEvents();
    } catch (error) {
      console.log(error);
    }
  };
  // ===========================
  // Edit Event
  // ===========================

  const editEvent = (event) => {
    setEditId(event._id);

    setFormData({
      title: event.title,

      description: event.description,

      date: event.date.split("T")[0],

      time: event.time,

      location: event.location,
    });

    setShowModal(true);
  };

  // ===========================
  // Update Event
  // ===========================

  const updateEvent = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/events/${editId}`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Event Updated Successfully");

      closeModal();

      getEvents();
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // Delete Event
  // ===========================

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/events/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Event Deleted Successfully");

      getEvents();
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
      title: "",

      description: "",

      date: "",

      time: "",

      location: "",
    });
  };

  // ===========================
  // Search
  // ===========================

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="event-page">
        <Sidebar />

        <div className="event-content">
          <div className="event-header">
            <h1>Events</h1>

            <button
              onClick={() => {
                closeModal();

                setShowModal(true);
              }}
            >
              + Add Event
            </button>
          </div>

          <input
            type="text"
            placeholder="Search Event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <table>
            <thead>
              <tr>
                <th>Title</th>

                <th>Description</th>

                <th>Date</th>

                <th>Time</th>

                <th>Location</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEvents.map((event) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0);

                const isCompleted = eventDate < today;

                return (
                  <tr key={event._id}>
                    <td>{event.title}</td>

                    <td>{event.description}</td>

                    <td>{new Date(event.date).toLocaleDateString()}</td>

                    <td>{event.time}</td>

                    <td>{event.location}</td>

                    <td>
                      {isCompleted ? (
                        <span className="completed">Completed</span>
                      ) : (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => editEvent(event)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => deleteEvent(event._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h2>{editId ? "Edit Event" : "Add Event"}</h2>

            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button onClick={editId ? updateEvent : addEvent}>
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

export default Event;

import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../css/admin/Event.css";
import { useLocation } from "react-router-dom";

function Event() {
  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const location = useLocation();

useEffect(() => {
  if (location.state?.openModal === "addEvent") {
    setShowModal(true);
  }
}, [location.state]);

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

  <div>
    <p className="event-small-title">
      Activity Management
    </p>

    <h1>Events</h1>

    <span>
      Manage upcoming activities, celebrations and community events
    </span>
  </div>

  <button
    onClick={() => {
      closeModal();
      setShowModal(true);
    }}
  >
    + Add Event
  </button>

</div>

<div className="event-search-box">

  <input
    type="text"
    placeholder="Search by event title or location..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

</div>
          <div className="event-grid">

  {filteredEvents.length === 0 ? (

    <div className="event-empty">

      <div className="event-empty-icon">
        📅
      </div>

      <h3>No Events Found</h3>

      <p>
        New events will appear here.
      </p>

    </div>

  ) : (

    filteredEvents.map((event) => {

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      const isCompleted = eventDate < today;

      const date = new Date(event.date);

      const day = date.toLocaleDateString("en-IN", {
        day: "2-digit",
      });

      const month = date
        .toLocaleDateString("en-IN", {
          month: "short",
        })
        .toUpperCase();

      const year = date.getFullYear();

      return (

        <div
          className={`event-card ${
            isCompleted ? "completed-event-card" : ""
          }`}
          key={event._id}
        >

          <div className="event-card-top">

            <div className="event-date-box">

              <span>{month}</span>

              <h2>{day}</h2>

              <small>{year}</small>

            </div>

            <span
              className={
                isCompleted
                  ? "event-status completed-event"
                  : "event-status upcoming-event"
              }
            >
              {isCompleted
                ? "Completed"
                : "Upcoming"}
            </span>

          </div>


          <div className="event-card-content">

            <h3>{event.title}</h3>

            <p>
              {event.description ||
                "No description available"}
            </p>

          </div>


          <div className="event-detail-box">

            <div className="event-detail-item">

              <div className="event-detail-icon">
                🕒
              </div>

              <div>
                <span>Time</span>
                <strong>{event.time}</strong>
              </div>

            </div>


            <div className="event-detail-item">

              <div className="event-detail-icon location-icon">
                📍
              </div>

              <div>
                <span>Location</span>

                <strong>
                  {event.location}
                </strong>
              </div>

            </div>

          </div>


          <div className="event-card-actions">

            {isCompleted ? (

              <div className="event-completed-message">
                ✓ Event Completed
              </div>

            ) : (

              <>
                <button
                  className="event-edit-btn"
                  onClick={() =>
                    editEvent(event)
                  }
                >
                  Edit Event
                </button>

                <button
                  className="event-delete-btn"
                  onClick={() =>
                    deleteEvent(event._id)
                  }
                >
                  Delete
                </button>
              </>

            )}

          </div>

        </div>

      );

    })

  )}

</div>
        </div>
      </div>

      {showModal && (

  <div className="event-modal-overlay">

    <div className="event-modal-box">

      <button
        className="event-modal-close"
        onClick={closeModal}
      >
        ×
      </button>


      <div className="event-modal-header">

        <div className="event-modal-icon">
          📅
        </div>

        <div>

          <p>Event Management</p>

          <h2>
            {editId
              ? "Update Event"
              : "Create New Event"}
          </h2>

          <span>
            {editId
              ? "Update event details and schedule."
              : "Create an activity for Kinetic Care residents."}
          </span>

        </div>

      </div>


      <div className="event-modal-form">

        <div className="event-form-group full-width">

          <label>Event Title</label>

          <input
            type="text"
            name="title"
            placeholder="Example: Birthday Celebration"
            value={formData.title}
            onChange={handleChange}
          />

        </div>


        <div className="event-form-group full-width">

          <label>Description</label>

          <textarea
            name="description"
            placeholder="Write a short description about the event..."
            value={formData.description}
            onChange={handleChange}
          />

        </div>


        <div className="event-form-group">

          <label>Event Date</label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

        </div>


        <div className="event-form-group">

          <label>Event Time</label>

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />

        </div>


        <div className="event-form-group full-width">

          <label>Location</label>

          <input
            type="text"
            name="location"
            placeholder="Example: Community Hall"
            value={formData.location}
            onChange={handleChange}
          />

        </div>

      </div>


      <div className="event-modal-actions">

        <button
          className="event-cancel-btn"
          onClick={closeModal}
        >
          Cancel
        </button>

        <button
          className="event-save-btn"
          onClick={
            editId
              ? updateEvent
              : addEvent
          }
        >
          {editId
            ? "Update Event"
            : "Create Event"}
        </button>

      </div>

    </div>

  </div>

)}
    </>
  );
}

export default Event;

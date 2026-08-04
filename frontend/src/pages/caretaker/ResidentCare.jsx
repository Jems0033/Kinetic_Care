import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaUser,
  FaClock,
  FaHeart,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import "../../css/caretaker/ResidentCare.css";

const DEFAULT_TASKS = [
  {
    key: "medicine",
    icon: "💊",
    title: "Medicine",
    description: "Medicine provided as scheduled.",
  },
  {
    key: "meal",
    icon: "🍲",
    title: "Meal",
    description: "Breakfast / Lunch / Dinner completed.",
  },
  {
    key: "bath",
    icon: "🚿",
    title: "Bath",
    description: "Personal hygiene completed.",
  },
  {
    key: "walking",
    icon: "🚶",
    title: "Walking",
    description: "Walking or exercise completed.",
  },
  {
    key: "water",
    icon: "💧",
    title: "Water",
    description: "Enough water intake completed.",
  },
  {
    key: "rest",
    icon: "🛏️",
    title: "Rest",
    description: "Rest and sleep monitored.",
  },
];

const TASK_OPTIONS = [
  {
    key: "bloodPressure",
    icon: "🩺",
    title: "Blood Pressure",
    description: "Check and record blood pressure.",
  },
  {
    key: "temperature",
    icon: "🌡️",
    title: "Temperature",
    description: "Check resident body temperature.",
  },
  {
    key: "physiotherapy",
    icon: "🏃",
    title: "Physiotherapy",
    description: "Complete the assigned physiotherapy session.",
  },
  {
    key: "doctorVisit",
    icon: "👨‍⚕️",
    title: "Doctor Visit",
    description: "Assist resident during the doctor visit.",
  },
  {
    key: "healthCheck",
    icon: "❤️",
    title: "Health Check",
    description: "Complete the routine health check.",
  },
  {
    key: "roomCleaning",
    icon: "🧹",
    title: "Room Cleaning",
    description: "Confirm the resident room is clean.",
  },
];

const emptyCareData = {
  medicine: false,
  meal: false,
  bath: false,
  walking: false,
  water: false,
  rest: false,
  notes: "",
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);

function ResidentCare() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resident, setResident] = useState(null);
  const [caretaker, setCaretaker] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [careData, setCareData] = useState(emptyCareData);

  // The names stored here are disabled after a successful save.
  const [savedTaskKeys, setSavedTaskKeys] = useState([]);

  // Custom tasks added from the modal.
  const [customTasks, setCustomTasks] = useState([]);
  const [customTaskStatus, setCustomTaskStatus] = useState({});

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTaskKey, setSelectedTaskKey] = useState("");
  const [customTaskForm, setCustomTaskForm] = useState({
    title: "",
    description: "",
    icon: "✅",
  });

  useEffect(() => {
    getResidentCare();
  }, [id]);

  const getResidentCare = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/caretaker/resident/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setResident(res.data.resident);
      setCaretaker(res.data.caretaker || {});

      if (res.data.todayCare) {
        const todayCare = res.data.todayCare;
        if (
          Array.isArray(todayCare.customTasks) &&
          todayCare.customTasks.length > 0
        ) {
          setCustomTasks(todayCare.customTasks);

          const status = {};

          const savedKeys = [];

          todayCare.customTasks.forEach((task) => {
            status[task.key] = task.completed;

            if (task.completed) {
              savedKeys.push(task.key);
            }
          });

          setCustomTaskStatus(status);

          setSavedTaskKeys((prev) => [...new Set([...prev, ...savedKeys])]);
        }

        setCareData({
          medicine: Boolean(todayCare.medicine),
          meal: Boolean(todayCare.meal),
          bath: Boolean(todayCare.bath),
          walking: Boolean(todayCare.walking),
          water: Boolean(todayCare.water),
          rest: Boolean(todayCare.rest),
          notes: todayCare.notes || "",
        });

        const alreadySavedTasks = DEFAULT_TASKS.filter((task) =>
          Boolean(todayCare[task.key]),
        ).map((task) => task.key);

        setSavedTaskKeys((previousKeys) => [
          ...new Set([...previousKeys, ...alreadySavedTasks]),
        ]);
      } else {
        setCareData(emptyCareData);
      }
    } catch (error) {
      console.log("Resident Care Error:", error);

      setMessage(
        error.response?.data?.message || "Unable to load resident details",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckbox = (event) => {
    const { name, checked } = event.target;

    if (savedTaskKeys.includes(name)) {
      return;
    }

    setCareData((previousData) => ({
      ...previousData,
      [name]: checked,
    }));
  };

  const handleCustomTaskCheckbox = (taskKey) => {
    if (savedTaskKeys.includes(taskKey)) {
      return;
    }

    setCustomTaskStatus((previousStatus) => ({
      ...previousStatus,
      [taskKey]: !previousStatus[taskKey],
    }));
  };

  const handleNotes = (event) => {
    setCareData((previousData) => ({
      ...previousData,
      notes: event.target.value,
    }));
  };

  const openTaskModal = () => {
    setSelectedTaskKey("");
    setCustomTaskForm({ title: "", description: "", icon: "✅" });
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setSelectedTaskKey("");
    setCustomTaskForm({ title: "", description: "", icon: "✅" });
    setShowTaskModal(false);
  };

  const handleCustomTaskForm = (event) => {
    const { name, value } = event.target;

    setCustomTaskForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const createCustomTaskKey = (title) => {
    const cleanedTitle = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return `custom-${cleanedTitle || "task"}-${Date.now()}`;
  };

  const addSelectedTask = () => {
    if (!selectedTaskKey) {
      setMessage("Please select one task.");
      return;
    }

    const selectedTask = TASK_OPTIONS.find(
      (task) => task.key === selectedTaskKey,
    );

    if (!selectedTask) {
      setMessage("Selected task is not valid.");
      return;
    }

    if (customTasks.some((task) => task.key === selectedTask.key)) {
      setMessage("This task has already been added.");
      return;
    }

    setCustomTasks((prev) => [...prev, selectedTask]);

    setCustomTaskStatus((prev) => ({
      ...prev,
      [selectedTask.key]: false,
    }));

    closeTaskModal();

    setTimeout(() => {
      setMessage(`${selectedTask.title} task added successfully.`);
    }, 100);
  };

  const addCustomTask = () => {
    const title = customTaskForm.title.trim();
    const description = customTaskForm.description.trim();
    const icon = customTaskForm.icon.trim() || "✅";

    if (!title) {
      setMessage("Please enter custom task name.");
      return;
    }

    if (
      [...DEFAULT_TASKS, ...customTasks].some(
        (task) => task.title.toLowerCase() === title.toLowerCase(),
      )
    ) {
      setMessage("A task with this name already exists.");
      return;
    }

    const newTask = {
      key: createCustomTaskKey(title),
      title,
      description: description || "Custom care activity.",
      icon,
    };

    setCustomTasks((prev) => [...prev, newTask]);

    setCustomTaskStatus((prev) => ({
      ...prev,
      [newTask.key]: false,
    }));

    closeTaskModal(); // <-- પહેલાં modal બંધ

    setTimeout(() => {
      setMessage(`${newTask.title} custom task added successfully.`);
    }, 100);
  };

  const saveCare = async () => {
    try {
      setSaving(true);
      setMessage("");

      const selectedDefaultTaskKeys = DEFAULT_TASKS.filter(
        (task) => careData[task.key] && !savedTaskKeys.includes(task.key),
      ).map((task) => task.key);

      const selectedCustomTaskKeys = customTasks
        .filter(
          (task) =>
            customTaskStatus[task.key] && !savedTaskKeys.includes(task.key),
        )
        .map((task) => task.key);

      if (
        selectedDefaultTaskKeys.length === 0 &&
        selectedCustomTaskKeys.length === 0 &&
        !careData.notes.trim()
      ) {
        setMessage("Please select at least one task or add a note.");
        return;
      }

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/api/caretaker/resident/${id}`,
        {
          ...careData,

          // Your backend can store this later after adding customTasks
          // to the Care model/schema.
          customTasks: customTasks.map((task) => ({
            key: task.key,
            title: task.title,
            description: task.description,
            icon: task.icon,
            completed: Boolean(customTaskStatus[task.key]),
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const nextSavedTaskKeys = [
        ...new Set([
          ...savedTaskKeys,
          ...selectedDefaultTaskKeys,
          ...selectedCustomTaskKeys,
        ]),
      ];

      setSavedTaskKeys(nextSavedTaskKeys);

      setMessage(
        res.data.message ||
          "Selected tasks saved. Saved tasks are now disabled.",
      );
    } catch (error) {
      console.log("Save Care Error:", error);

      setMessage(error.response?.data?.message || "Unable to save daily care");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="resident-care-loading">
        <div className="resident-care-loader"></div>
        <h2>Loading Resident Care</h2>
        <p>Please wait while resident details are loading.</p>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="resident-care-error">
        <div className="resident-error-icon">
          <FaUser />
        </div>

        <h2>{message || "Resident not found"}</h2>
        <p>The requested resident information could not be loaded.</p>

        <button type="button" onClick={() => navigate("/caretaker/dashboard")}>
          <FaArrowLeft />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const doctor =
    caretaker.shift === "Morning"
      ? resident.morningDoctor
      : resident.nightDoctor;

  const defaultCompletedTasks = DEFAULT_TASKS.filter(
    (task) => careData[task.key],
  ).length;

  const customCompletedTasks = customTasks.filter(
    (task) => customTaskStatus[task.key],
  ).length;

  const totalTasks = DEFAULT_TASKS.length + customTasks.length;
  const completedTasks = defaultCompletedTasks + customCompletedTasks;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const hasUnsavedSelection =
    DEFAULT_TASKS.some(
      (task) => careData[task.key] && !savedTaskKeys.includes(task.key),
    ) ||
    customTasks.some(
      (task) => customTaskStatus[task.key] && !savedTaskKeys.includes(task.key),
    );

  return (
    <div className="resident-care-page">
      {/* HEADER */}
      <header className="resident-care-header">
        <div className="resident-header-left">
          <button
            type="button"
            className="resident-back-btn"
            onClick={() => navigate("/caretaker/dashboard")}
          >
            <FaArrowLeft />
          </button>

          <div className="resident-header-content">
            <p className="resident-page-label">Daily Care Management</p>
            <h1>{resident.name}</h1>
            <span>Record and manage today's care activities.</span>
          </div>
        </div>

        <div className="resident-header-actions">
          <div className="resident-shift-card">
            <div className="resident-shift-icon">
              <FaClock />
            </div>

            <div>
              <span>Current Shift</span>
              <strong>{caretaker.shift || "Not Assigned"}</strong>
            </div>
          </div>

          <div className="resident-caretaker-card">
            <div className="resident-caretaker-icon">
              <FaHeart />
            </div>

            <div>
              <span>Caretaker</span>
              <strong>{caretaker.name || "Caretaker"}</strong>
            </div>
          </div>
        </div>
      </header>

      {/* RESIDENT SUMMARY */}
      <section className="resident-summary-card">
        <div className="resident-profile-section">
          <div className="resident-avatar-large">
            {resident.gender?.toLowerCase() === "female" ? "👵" : "👴"}
          </div>

          <div className="resident-profile-info">
            <span>Resident Profile</span>
            <h2>{resident.name}</h2>
            <p>
              {resident.age} Years • {resident.gender}
            </p>
          </div>
        </div>

        <div className="resident-info-grid">
          <div className="resident-info-box">
            <span>Room Number</span>
            <strong>{resident.room?.roomNumber || "Not Assigned"}</strong>
          </div>

          <div className="resident-info-box">
            <span>Room Type</span>
            <strong>{resident.room?.roomType || "-"}</strong>
          </div>

          <div className="resident-info-box">
            <span>Medical Condition</span>
            <strong>{resident.medicalCondition || "Normal"}</strong>
          </div>

          <div className="resident-info-box">
            <span>Assigned Doctor</span>
            <strong>{doctor?.name || "Not Assigned"}</strong>
          </div>
        </div>
      </section>

      {/* CARE PROGRESS */}
      <section className="resident-progress-card">
        <div className="resident-progress-header">
          <div>
            <p className="resident-progress-label">Today's Progress</p>
            <h3>Daily Care Status</h3>
            <span>
              {completedTasks} of {totalTasks} care activities completed today.
            </span>
          </div>

          <div className="resident-progress-circle">
            <strong>{progress}%</strong>
          </div>
        </div>

        <div className="resident-progress-bar">
          <div
            className="resident-progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </section>

      {/* DAILY CARE */}
      <section className="resident-care-section">
        <div className="resident-section-header resident-task-heading">
          <div>
            <p className="resident-section-label">Daily Checklist</p>
            <h2>Care Activities</h2>
          </div>

          <button
            type="button"
            className="resident-add-task-btn"
            onClick={openTaskModal}
          >
            <FaPlus />
            Add Task
          </button>
        </div>

        <div className="resident-task-grid">
          {DEFAULT_TASKS.map((task) => (
            <CareTask
              key={task.key}
              icon={task.icon}
              title={task.title}
              description={task.description}
              name={task.key}
              checked={Boolean(careData[task.key])}
              onChange={handleCheckbox}
              disabled={savedTaskKeys.includes(task.key)}
              saved={savedTaskKeys.includes(task.key)}
            />
          ))}

          {customTasks.map((task) => (
            <CareTask
              key={task.key}
              icon={task.icon}
              title={task.title}
              description={task.description}
              name={task.key}
              checked={Boolean(customTaskStatus[task.key])}
              onChange={() => handleCustomTaskCheckbox(task.key)}
              disabled={savedTaskKeys.includes(task.key)}
              saved={savedTaskKeys.includes(task.key)}
            />
          ))}
        </div>
      </section>

      {/* NOTES */}
      <section className="resident-notes-card">
        <div className="resident-section-header">
          <div>
            <p className="resident-section-label">Care Notes</p>
            <h2>Observation</h2>
          </div>

          <span>Maximum 500 characters</span>
        </div>

        <textarea
          className="resident-notes-input"
          placeholder="Write today's observation about the resident..."
          value={careData.notes}
          onChange={handleNotes}
          maxLength={500}
        />

        <div className="resident-notes-footer">
          <span>{careData.notes.length}/500</span>
        </div>
      </section>

      {message && <div className="resident-message">{message}</div>}

      {/* ACTION BUTTONS */}
      <div className="resident-action-buttons">
        <button
          type="button"
          className="resident-cancel-btn"
          onClick={() => navigate("/caretaker/dashboard")}
        >
          Cancel
        </button>

        <button
          type="button"
          className="resident-save-btn"
          onClick={saveCare}
          disabled={saving || (!hasUnsavedSelection && !careData.notes.trim())}
        >
          {saving ? "Saving..." : "Save Selected Tasks"}
        </button>
      </div>

      {/* ADD TASK MODAL */}
      {showTaskModal && (
        <div
          className="resident-task-modal-overlay"
          role="presentation"
          onMouseDown={closeTaskModal}
        >
          <div
            className="resident-task-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-task-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="resident-task-modal-header">
              <div>
                <p className="resident-section-label">Daily Care</p>
                <h2 id="add-task-title">Add New Task</h2>
              </div>

              <button
                type="button"
                className="resident-task-modal-close"
                onClick={closeTaskModal}
                aria-label="Close task modal"
              >
                <FaTimes />
              </button>
            </div>

            <p className="resident-task-modal-help">
              Select a ready-made task or create your own custom task.
            </p>

            <div className="resident-task-option-list">
              {TASK_OPTIONS.map((task) => {
                const isAlreadyAdded = customTasks.some(
                  (addedTask) => addedTask.key === task.key,
                );

                return (
                  <label
                    key={task.key}
                    className={`resident-task-option ${
                      selectedTaskKey === task.key
                        ? "resident-task-option-selected"
                        : ""
                    } ${isAlreadyAdded ? "resident-task-option-disabled" : ""}`}
                  >
                    <input
                      type="radio"
                      name="newTask"
                      value={task.key}
                      checked={selectedTaskKey === task.key}
                      onChange={(event) =>
                        setSelectedTaskKey(event.target.value)
                      }
                      disabled={isAlreadyAdded}
                    />

                    <span className="resident-task-option-icon">
                      {task.icon}
                    </span>

                    <span className="resident-task-option-content">
                      <strong>{task.title}</strong>
                      <small>{task.description}</small>
                    </span>

                    {isAlreadyAdded && (
                      <span className="resident-task-option-added">Added</span>
                    )}
                  </label>
                );
              })}
            </div>

            <div className="resident-task-modal-actions">
              <button
                type="button"
                className="resident-cancel-btn"
                onClick={closeTaskModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="resident-save-btn"
                onClick={addSelectedTask}
                disabled={!selectedTaskKey}
              >
                Add Selected Task
              </button>
            </div>

            <div className="resident-custom-task-divider">
              <span>OR CREATE CUSTOM TASK</span>
            </div>

            <div className="resident-custom-task-form">
              <div className="resident-custom-task-row">
                <div className="resident-custom-task-field resident-custom-icon-field">
                  <label htmlFor="customTaskIcon">Icon</label>
                  <input
                    id="customTaskIcon"
                    type="text"
                    name="icon"
                    value={customTaskForm.icon}
                    onChange={handleCustomTaskForm}
                    maxLength={4}
                    placeholder="✅"
                  />
                </div>

                <div className="resident-custom-task-field">
                  <label htmlFor="customTaskTitle">Task Name *</label>
                  <input
                    id="customTaskTitle"
                    type="text"
                    name="title"
                    value={customTaskForm.title}
                    onChange={handleCustomTaskForm}
                    maxLength={60}
                    placeholder="Example: Evening Walk"
                  />
                </div>
              </div>

              <div className="resident-custom-task-field">
                <label htmlFor="customTaskDescription">Description</label>
                <textarea
                  id="customTaskDescription"
                  name="description"
                  value={customTaskForm.description}
                  onChange={handleCustomTaskForm}
                  maxLength={160}
                  rows={3}
                  placeholder="Write a short instruction for this task..."
                />
              </div>

              <button
                type="button"
                className="resident-save-btn resident-custom-task-save"
                onClick={addCustomTask}
                disabled={!customTaskForm.title.trim()}
              >
                <FaPlus />
                Add Custom Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   CARE TASK COMPONENT
========================= */
function CareTask({
  icon,
  title,
  description,
  name,
  checked,
  onChange,
  disabled,
  saved,
}) {
  return (
    <label
      className={`resident-task-card
        ${checked ? "resident-task-active" : ""}
        ${disabled ? "resident-task-disabled" : ""}
      `}
    >
      <div className="resident-task-icon">{icon}</div>

      <div className="resident-task-content">
        <h3>{title}</h3>
        <p>{description}</p>
        {saved && <span className="resident-task-saved">Saved ✓</span>}
      </div>

      <div className="resident-task-check">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />

        <span className="resident-custom-checkbox">{checked ? "✓" : ""}</span>
      </div>
    </label>
  );
}

export default ResidentCare;

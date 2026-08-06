import { useEffect, useState } from "react";
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

/* =========================
   DAY SHIFT DEFAULT TASKS
========================= */

const DAY_TASKS = [
  {
    key: "medicine",
    icon: "💊",
    title: "Day Medicine",
    description: "Day medicine provided as scheduled.",
  },
  {
    key: "breakfast",
    icon: "🍳",
    title: "Breakfast Given",
    description: "Breakfast served to the resident.",
  },
  {
    key: "bath",
    icon: "🚿",
    title: "Bath Assistance",
    description: "Bath assistance completed.",
  },
  {
    key: "hygiene",
    icon: "🦷",
    title: "Personal Hygiene",
    description: "Brush and face wash assistance completed.",
  },
  {
    key: "walk",
    icon: "🚶",
    title: "Walk / Exercise",
    description: "Walk or exercise activity completed.",
  },
  {
    key: "water",
    icon: "💧",
    title: "Water Intake",
    description: "Required water intake provided.",
  },
  {
    key: "healthCheck",
    icon: "🩺",
    title: "Day Health Check",
    description: "Routine day health check completed.",
  },
  {
    key: "lunch",
    icon: "🍛",
    title: "Lunch Given",
    description: "Lunch served to the resident.",
  },
];

/* =========================
   NIGHT SHIFT DEFAULT TASKS
========================= */

const NIGHT_TASKS = [
  {
    key: "medicine",
    icon: "💊",
    title: "Night Medicine",
    description: "Night medicine provided as scheduled.",
  },
  {
    key: "dinner",
    icon: "🍽️",
    title: "Dinner Given",
    description: "Dinner served to the resident.",
  },
  {
    key: "water",
    icon: "💧",
    title: "Water Before Sleep",
    description: "Water provided before sleep.",
  },
  {
    key: "sleep",
    icon: "😴",
    title: "Sleep Assistance",
    description: "Resident assisted for sleep.",
  },
  {
    key: "healthCheck",
    icon: "🌡️",
    title: "Night Health Check",
    description: "Routine night health check completed.",
  },
  {
    key: "comfort",
    icon: "😌",
    title: "Comfort Check",
    description: "Resident comfort and position checked.",
  },
  {
    key: "sleeping",
    icon: "🛌",
    title: "Resident Sleeping Safely",
    description: "Resident confirmed sleeping safely.",
  },
];

/* =========================
   DAY ADDITIONAL TASKS
========================= */

const DAY_TASK_OPTIONS = [
  {
    key: "bloodPressure",
    icon: "🩺",
    title: "Blood Pressure",
    description: "Check and record blood pressure.",
  },
  {
    key: "sugarCheck",
    icon: "🩸",
    title: "Sugar Check",
    description: "Check resident blood sugar level.",
  },
  {
    key: "physiotherapy",
    icon: "🏃",
    title: "Physiotherapy",
    description: "Complete assigned physiotherapy session.",
  },
  {
    key: "feedingAssistance",
    icon: "🥣",
    title: "Feeding Assistance",
    description: "Provide additional feeding assistance.",
  },
];

/* =========================
   NIGHT ADDITIONAL TASKS
========================= */

const NIGHT_TASK_OPTIONS = [
  {
    key: "temperature",
    icon: "🌡️",
    title: "Temperature Check",
    description: "Check resident body temperature.",
  },
  {
    key: "oxygenCheck",
    icon: "🫁",
    title: "Oxygen Check",
    description: "Check oxygen saturation level.",
  },
  {
    key: "toiletAssistance",
    icon: "🚻",
    title: "Toilet Assistance",
    description: "Assist resident with toilet activity.",
  },
  {
    key: "nightObservation",
    icon: "👁️",
    title: "Night Observation",
    description: "Complete special night observation.",
  },
];

/* =========================
   EMPTY CARE DATA
========================= */

const emptyCareData = {
  dayTasks: {
    medicine: false,
    breakfast: false,
    bath: false,
    hygiene: false,
    walk: false,
    water: false,
    healthCheck: false,
    lunch: false,
  },

  nightTasks: {
    medicine: false,
    dinner: false,
    water: false,
    sleep: false,
    healthCheck: false,
    comfort: false,
    sleeping: false,
  },

  notes: "",
};

function ResidentCare() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resident, setResident] = useState(null);
  const [caretaker, setCaretaker] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [careData, setCareData] = useState(emptyCareData);

  // Current shift custom tasks
  const [customTasks, setCustomTasks] = useState([]);
  const [customTaskStatus, setCustomTaskStatus] = useState({});

  // Other shift data is shown as read-only
  const [otherShiftCustomTasks, setOtherShiftCustomTasks] = useState([]);

  // Tasks already saved cannot be changed again
  const [savedTaskKeys, setSavedTaskKeys] = useState([]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTaskKey, setSelectedTaskKey] = useState("");

  const [customTaskForm, setCustomTaskForm] = useState({
    title: "",
    description: "",
    icon: "✅",
  });

  const isDayShift =
    caretaker.shift === "Day" ;

  const currentShiftName = isDayShift ? "Day" : "Night";

  const currentDefaultTasks = isDayShift ? DAY_TASKS : NIGHT_TASKS;

  const currentTaskOptions = isDayShift
    ? DAY_TASK_OPTIONS
    : NIGHT_TASK_OPTIONS;

  const otherShiftDefaultTasks = isDayShift
    ? NIGHT_TASKS
    : DAY_TASKS;

  const currentTaskValues = isDayShift
    ? careData.dayTasks
    : careData.nightTasks;

  const otherShiftTaskValues = isDayShift
    ? careData.nightTasks
    : careData.dayTasks;

  useEffect(() => {
    getResidentCare();
  }, [id]);

  /* =========================
     GET RESIDENT CARE
  ========================= */

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

      const residentData = res.data.resident;
      const caretakerData = res.data.caretaker || {};
      const todayCare = res.data.todayCare || {};

      const responseIsDayShift =
        caretakerData.shift === "Day";

      const dayTasks = {
        ...emptyCareData.dayTasks,
        ...(todayCare.dayTasks || {}),
      };

      const nightTasks = {
        ...emptyCareData.nightTasks,
        ...(todayCare.nightTasks || {}),
      };

      const dayCustomTasks = Array.isArray(todayCare.dayCustomTasks)
        ? todayCare.dayCustomTasks
        : [];

      const nightCustomTasks = Array.isArray(todayCare.nightCustomTasks)
        ? todayCare.nightCustomTasks
        : [];

      const shiftCustomTasks = responseIsDayShift
        ? dayCustomTasks
        : nightCustomTasks;

      const oppositeCustomTasks = responseIsDayShift
        ? nightCustomTasks
        : dayCustomTasks;

      const shiftDefaultTasks = responseIsDayShift
        ? DAY_TASKS
        : NIGHT_TASKS;

      const shiftTaskValues = responseIsDayShift
        ? dayTasks
        : nightTasks;

      const statusMap = {};
      const savedKeys = [];

      shiftCustomTasks.forEach((task) => {
        statusMap[task.key] = Boolean(task.completed);

        if (task.completed) {
          savedKeys.push(task.key);
        }
      });

      shiftDefaultTasks.forEach((task) => {
        if (shiftTaskValues[task.key]) {
          savedKeys.push(task.key);
        }
      });

      setResident(residentData);
      setCaretaker(caretakerData);

      setCareData({
        dayTasks,
        nightTasks,
        notes: todayCare.notes || "",
      });

      setCustomTasks(shiftCustomTasks);
      setOtherShiftCustomTasks(oppositeCustomTasks);
      setCustomTaskStatus(statusMap);
      setSavedTaskKeys([...new Set(savedKeys)]);
    } catch (error) {
      console.log("Resident Care Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load resident details",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DEFAULT TASK CHECKBOX
  ========================= */

  const handleCheckbox = (event) => {
    const { name, checked } = event.target;

    if (savedTaskKeys.includes(name)) {
      return;
    }

    if (isDayShift) {
      setCareData((previousData) => ({
        ...previousData,

        dayTasks: {
          ...previousData.dayTasks,
          [name]: checked,
        },
      }));
    } else {
      setCareData((previousData) => ({
        ...previousData,

        nightTasks: {
          ...previousData.nightTasks,
          [name]: checked,
        },
      }));
    }
  };

  /* =========================
     CUSTOM TASK CHECKBOX
  ========================= */

  const handleCustomTaskCheckbox = (taskKey) => {
    if (savedTaskKeys.includes(taskKey)) {
      return;
    }

    setCustomTaskStatus((previousStatus) => ({
      ...previousStatus,
      [taskKey]: !previousStatus[taskKey],
    }));
  };

  /* =========================
     NOTES
  ========================= */

  const handleNotes = (event) => {
    setCareData((previousData) => ({
      ...previousData,
      notes: event.target.value,
    }));
  };

  /* =========================
     MODAL
  ========================= */

  const openTaskModal = () => {
    setMessage("");
    setSelectedTaskKey("");

    setCustomTaskForm({
      title: "",
      description: "",
      icon: "✅",
    });

    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setSelectedTaskKey("");

    setCustomTaskForm({
      title: "",
      description: "",
      icon: "✅",
    });

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

    return `${currentShiftName.toLowerCase()}-${cleanedTitle || "task"}-${Date.now()}`;
  };

  /* =========================
     ADD READY-MADE TASK
  ========================= */

  const addSelectedTask = () => {
    if (!selectedTaskKey) {
      setMessage("Please select one task.");
      return;
    }

    const selectedTask = currentTaskOptions.find(
      (task) => task.key === selectedTaskKey,
    );

    if (!selectedTask) {
      setMessage("Selected task is not valid.");
      return;
    }

    if (
      customTasks.some(
        (task) => task.key === selectedTask.key,
      )
    ) {
      setMessage("This task has already been added.");
      return;
    }

    setCustomTasks((previousTasks) => [
      ...previousTasks,
      selectedTask,
    ]);

    setCustomTaskStatus((previousStatus) => ({
      ...previousStatus,
      [selectedTask.key]: false,
    }));

    closeTaskModal();

    setTimeout(() => {
      setMessage(
        `${selectedTask.title} task added successfully.`,
      );
    }, 100);
  };

  /* =========================
     ADD CUSTOM TASK
  ========================= */

  const addCustomTask = () => {
    const title = customTaskForm.title.trim();
    const description =
      customTaskForm.description.trim();

    const icon =
      customTaskForm.icon.trim() || "✅";

    if (!title) {
      setMessage("Please enter custom task name.");
      return;
    }

    const taskExists = [
      ...currentDefaultTasks,
      ...customTasks,
    ].some(
      (task) =>
        task.title.toLowerCase() ===
        title.toLowerCase(),
    );

    if (taskExists) {
      setMessage(
        "A task with this name already exists.",
      );
      return;
    }

    const newTask = {
      key: createCustomTaskKey(title),
      title,
      description:
        description || "Custom care activity.",
      icon,
      completed: false,
    };

    setCustomTasks((previousTasks) => [
      ...previousTasks,
      newTask,
    ]);

    setCustomTaskStatus((previousStatus) => ({
      ...previousStatus,
      [newTask.key]: false,
    }));

    closeTaskModal();

    setTimeout(() => {
      setMessage(
        `${newTask.title} custom task added successfully.`,
      );
    }, 100);
  };

  /* =========================
     SAVE DAILY CARE
  ========================= */

  const saveCare = async () => {
    try {
      setSaving(true);
      setMessage("");

      const selectedDefaultTaskKeys =
        currentDefaultTasks
          .filter(
            (task) =>
              currentTaskValues?.[task.key] &&
              !savedTaskKeys.includes(task.key),
          )
          .map((task) => task.key);

      const selectedCustomTaskKeys = customTasks
        .filter(
          (task) =>
            customTaskStatus[task.key] &&
            !savedTaskKeys.includes(task.key),
        )
        .map((task) => task.key);

      if (
        selectedDefaultTaskKeys.length === 0 &&
        selectedCustomTaskKeys.length === 0 &&
        !careData.notes.trim()
      ) {
        setMessage(
          "Please select at least one task or add a note.",
        );
        return;
      }

      const preparedCustomTasks = customTasks.map(
        (task) => ({
          key: task.key,
          title: task.title,
          description: task.description || "",
          icon: task.icon || "📋",
          completed: Boolean(
            customTaskStatus[task.key],
          ),
        }),
      );

      const payload = {
  dayTasks: careData.dayTasks || {},

  nightTasks: careData.nightTasks || {},

  notes: careData.notes,

  dayCustomTasks: isDayShift
    ? preparedCustomTasks
    : [],

  nightCustomTasks: !isDayShift
    ? preparedCustomTasks
    : [],
};

console.log(payload);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/api/caretaker/resident/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSavedTaskKeys((previousKeys) => [
        ...new Set([
          ...previousKeys,
          ...selectedDefaultTaskKeys,
          ...selectedCustomTaskKeys,
        ]),
      ]);

      setMessage(
        res.data.message ||
          "Selected tasks saved successfully.",
      );
    } catch (error) {
      console.log("Save Care Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to save daily care",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="resident-care-loading">
        <div className="resident-care-loader"></div>

        <h2>Loading Resident Care</h2>

        <p>
          Please wait while resident details are
          loading.
        </p>
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

        <p>
          The requested resident information could not
          be loaded.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/caretaker/dashboard")
          }
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const doctor = isDayShift
    ? resident.dayDoctor
    : resident.nightDoctor;

  const defaultCompletedTasks =
    currentDefaultTasks.filter(
      (task) =>
        Boolean(currentTaskValues?.[task.key]),
    ).length;

  const customCompletedTasks = customTasks.filter(
    (task) =>
      Boolean(customTaskStatus[task.key]),
  ).length;

  const totalTasks =
    currentDefaultTasks.length + customTasks.length;

  const completedTasks =
    defaultCompletedTasks + customCompletedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100,
        );

  const hasUnsavedSelection =
    currentDefaultTasks.some(
      (task) =>
        currentTaskValues?.[task.key] &&
        !savedTaskKeys.includes(task.key),
    ) ||
    customTasks.some(
      (task) =>
        customTaskStatus[task.key] &&
        !savedTaskKeys.includes(task.key),
    );

  const completedOtherDefaultTasks =
    otherShiftDefaultTasks.filter((task) =>
      Boolean(otherShiftTaskValues?.[task.key]),
    );

  const completedOtherCustomTasks =
    otherShiftCustomTasks.filter(
      (task) => task.completed,
    );

  const hasOtherShiftCompletedTasks =
    completedOtherDefaultTasks.length > 0 ||
    completedOtherCustomTasks.length > 0;

  return (
    <div className="resident-care-page">
      {/* HEADER */}

      <header className="resident-care-header">
        <div className="resident-header-left">
          <button
            type="button"
            className="resident-back-btn"
            onClick={() =>
              navigate("/caretaker/dashboard")
            }
          >
            <FaArrowLeft />
          </button>

          <div className="resident-header-content">
            <p className="resident-page-label">
              Daily Care Management
            </p>

            <h1>{resident.name}</h1>

            <span>
              Record and manage today's{" "}
              {currentShiftName.toLowerCase()} shift care
              activities.
            </span>
          </div>
        </div>

        <div className="resident-header-actions">
          <div className="resident-shift-card">
            <div className="resident-shift-icon">
              <FaClock />
            </div>

            <div>
              <span>Current Shift</span>
              <strong>{currentShiftName}</strong>
            </div>
          </div>

          <div className="resident-caretaker-card">
            <div className="resident-caretaker-icon">
              <FaHeart />
            </div>

            <div>
              <span>Caretaker</span>

              <strong>
                {caretaker.name || "Caretaker"}
              </strong>
            </div>
          </div>
        </div>
      </header>

      {/* RESIDENT SUMMARY */}

      <section className="resident-summary-card">
        <div className="resident-profile-section">
          <div className="resident-avatar-large">
            {resident.gender?.toLowerCase() ===
            "female"
              ? "👵"
              : "👴"}
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

            <strong>
              {resident.room?.roomNumber ||
                "Not Assigned"}
            </strong>
          </div>

          <div className="resident-info-box">
            <span>Medical Condition</span>

            <strong>
              {resident.medicalCondition || "Normal"}
            </strong>
          </div>

          <div className="resident-info-box">
            <span>Assigned Doctor</span>

            <strong>
              Dr. {doctor?.name || "Not Assigned"}
            </strong>
          </div>
        </div>
      </section>

      {/* CURRENT SHIFT PROGRESS */}

      <section className="resident-progress-card">
        <div className="resident-progress-header">
          <div>
            <p className="resident-progress-label">
              Today's {currentShiftName} Shift Progress
            </p>

            <h3>Daily Care Status</h3>

            <span>
              {completedTasks} of {totalTasks} care
              activities completed.
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

      {/* CURRENT SHIFT TASKS */}

      <section className="resident-care-section">
        <div className="resident-section-header resident-task-heading">
          <div>
            <p className="resident-section-label">
              {currentShiftName} Shift Checklist
            </p>

            <h2>{currentShiftName} Care Activities</h2>
          </div>

          <button
            type="button"
            className="resident-add-task-btn"
            onClick={openTaskModal}
          >
            <FaPlus />
            Add {currentShiftName} Task
          </button>
        </div>

        <div className="resident-task-grid">
          {currentDefaultTasks.map((task) => (
            <CareTask
              key={task.key}
              icon={task.icon}
              title={task.title}
              description={task.description}
              name={task.key}
              checked={Boolean(
                currentTaskValues?.[task.key],
              )}
              onChange={handleCheckbox}
              disabled={savedTaskKeys.includes(
                task.key,
              )}
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
              checked={Boolean(
                customTaskStatus[task.key],
              )}
              onChange={() =>
                handleCustomTaskCheckbox(task.key)
              }
              disabled={savedTaskKeys.includes(
                task.key,
              )}
              saved={savedTaskKeys.includes(task.key)}
            />
          ))}
        </div>
      </section>

      {/* OTHER SHIFT COMPLETED TASKS */}

      {!isDayShift && hasOtherShiftCompletedTasks && (
        <section className="resident-care-section">
          <div className="resident-section-header">
            <div>
              <p className="resident-section-label">
                Previous Care Information
              </p>

              <h2>
                 Day Shift
                Completed Tasks
              </h2>

              <span>
                These tasks are read-only and were
                completed by the Day shift.
              </span>
            </div>
          </div>

          <div className="resident-task-grid">
            {completedOtherDefaultTasks.map(
              (task) => (
                <CareTask
                  key={`other-${task.key}`}
                  icon={task.icon}
                  title={task.title}
                  description={task.description}
                  name={`other-${task.key}`}
                  checked={true}
                  onChange={() => {}}
                  disabled={true}
                  saved={true}
                />
              ),
            )}

            {completedOtherCustomTasks.map((task) => (
              <CareTask
                key={`other-${task.key}`}
                icon={task.icon}
                title={task.title}
                description={task.description}
                name={`other-${task.key}`}
                checked={true}
                onChange={() => {}}
                disabled={true}
                saved={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* NOTES */}

      <section className="resident-notes-card">
        <div className="resident-section-header">
          <div>
            <p className="resident-section-label">
              Care Notes
            </p>

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

      {message && (
        <div className="resident-message">
          {message}
        </div>
      )}

      {/* ACTION BUTTONS */}

      <div className="resident-action-buttons">
        <button
          type="button"
          className="resident-cancel-btn"
          onClick={() =>
            navigate("/caretaker/dashboard")
          }
        >
          Cancel
        </button>

        <button
          type="button"
          className="resident-save-btn"
          onClick={saveCare}
          disabled={
            saving ||
            (!hasUnsavedSelection &&
              !careData.notes.trim())
          }
        >
          {saving
            ? "Saving..."
            : `Save ${currentShiftName} Tasks`}
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
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="resident-task-modal-header">
              <div>
                <p className="resident-section-label">
                  {currentShiftName} Shift Care
                </p>

                <h2 id="add-task-title">
                  Add {currentShiftName} Task
                </h2>
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
              Select a {currentShiftName.toLowerCase()}{" "}
              shift task or create your own custom task.
            </p>

            <div className="resident-task-option-list">
              {currentTaskOptions.map((task) => {
                const isAlreadyAdded =
                  customTasks.some(
                    (addedTask) =>
                      addedTask.key === task.key,
                  );

                return (
                  <label
                    key={task.key}
                    className={`resident-task-option ${
                      selectedTaskKey === task.key
                        ? "resident-task-option-selected"
                        : ""
                    } ${
                      isAlreadyAdded
                        ? "resident-task-option-disabled"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="newTask"
                      value={task.key}
                      checked={
                        selectedTaskKey === task.key
                      }
                      onChange={(event) =>
                        setSelectedTaskKey(
                          event.target.value,
                        )
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
                      <span className="resident-task-option-added">
                        Added
                      </span>
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
                  <label htmlFor="customTaskIcon">
                    Icon
                  </label>

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
                  <label htmlFor="customTaskTitle">
                    Task Name *
                  </label>

                  <input
                    id="customTaskTitle"
                    type="text"
                    name="title"
                    value={customTaskForm.title}
                    onChange={handleCustomTaskForm}
                    maxLength={60}
                    placeholder={`Example: ${currentShiftName} Special Care`}
                  />
                </div>
              </div>

              <div className="resident-custom-task-field">
                <label htmlFor="customTaskDescription">
                  Description
                </label>

                <textarea
                  id="customTaskDescription"
                  name="description"
                  value={
                    customTaskForm.description
                  }
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
                disabled={
                  !customTaskForm.title.trim()
                }
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
      <div className="resident-task-icon">
        {icon}
      </div>

      <div className="resident-task-content">
        <h3>{title}</h3>

        <p>{description}</p>

        {saved && (
          <span className="resident-task-saved">
            Saved ✓
          </span>
        )}
      </div>

      <div className="resident-task-check">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />

        <span className="resident-custom-checkbox">
          {checked ? "✓" : ""}
        </span>
      </div>
    </label>
  );
}

export default ResidentCare;
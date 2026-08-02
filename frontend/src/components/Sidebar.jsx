import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Sidebar.css";

import {
  FaHome,
  FaUserFriends,
  FaUsers,
  FaBed,
  FaNotesMedical,
  FaWalking,
  FaHeart,
  FaCalendarAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        className="sidebar-menu-btn"
        onClick={() => setSidebarOpen(true)}
      >
        <FaBars />
      </button>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>

        {/* MOBILE CLOSE BUTTON */}
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={closeSidebar}
        >
          <FaTimes />
        </button>

        {/* LOGO SECTION */}
        <div className="sidebar-logo">
          <div>
            <h2>
              Kinetic<span>Care</span>
            </h2>
          </div>

          <img
            src="/logo.png"
            alt="Kinetic Care Logo"
            className="sidebar-logo-img"
          />
        </div>

        {/* MENU */}
        <ul className="sidebar-menu">
          <li>
            <NavLink
              to="/dashboard"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "sidebar-active" : ""
              }
            >
              <FaHome />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/residents"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "sidebar-active" : ""
              }
            >
              <FaUserFriends />
              <span>Residents</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/staff"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "sidebar-active" : ""
              }
            >
              <FaUsers />
              <span>Staff</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/rooms"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "sidebar-active" : ""
              }
            >
              <FaBed />
              <span>Rooms</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/medical"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "sidebar-active" : ""
              }
            >
              <FaNotesMedical />
              <span>Medical</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/visitors"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "sidebar-active" : ""
              }
            >
              <FaWalking />
              <span>Visitors</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/donors"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "sidebar-active" : ""
              }
            >
              <FaHeart />
              <span>Donors</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/events"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "sidebar-active" : ""
              }
            >
              <FaCalendarAlt />
              <span>Events</span>
            </NavLink>
          </li>
        </ul>

        {/* LOGOUT */}
        <button
          type="button"
          className="logout-btn"
          onClick={logout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}

export default Sidebar;
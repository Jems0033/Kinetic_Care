import { NavLink, useNavigate } from "react-router-dom";
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
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="sidebar">

      {/* LOGO SECTION */}

      <div className="sidebar-logo">

        <h2>
          Kinetic<span>Care</span>
        </h2>

        <img
          src="/logo.png"
          alt="Kinetic Care Logo"
          className="sidebar-logo-img"
        />

      </div>


      {/* MENU */}

      <ul className="sidebar-menu">

        <li>
          <NavLink to="/dashboard">
            <FaHome />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/residents">
            <FaUserFriends />
            <span>Residents</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/staff">
            <FaUsers />
            <span>Staff</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/rooms">
            <FaBed />
            <span>Rooms</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/medical">
            <FaNotesMedical />
            <span>Medical</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/visitors">
            <FaWalking />
            <span>Visitors</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/donors">
            <FaHeart />
            <span>Donors</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/events">
            <FaCalendarAlt />
            <span>Events</span>
          </NavLink>
        </li>

      </ul>


      {/* LOGOUT */}

      <button
        className="logout-btn"
        onClick={logout}
      >
        <FaSignOutAlt />

        <span>Logout</span>
      </button>

    </div>
  );
}

export default Sidebar;
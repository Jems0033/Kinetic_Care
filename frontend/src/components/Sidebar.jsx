import { NavLink, useNavigate } from "react-router-dom";
import "../css/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>
          Kinetic<span>Care</span>
        </h2>
      </div>

      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard">🏠 Dashboard</NavLink>
        </li>

        <li>
          <NavLink to="/residents">👴 Residents</NavLink>
        </li>

        <li>
          <NavLink to="/staff">👨‍⚕️ Staff</NavLink>
        </li>

        <li>
          <NavLink to="/rooms">🛏 Rooms</NavLink>
        </li>

        <li>
          <NavLink to="/medical">💊 Medical</NavLink>
        </li>

        <li>
          <NavLink to="/visitors">🚶 Visitors</NavLink>
        </li>

        <li>
          <NavLink to="/donors">❤️ Donors</NavLink>
        </li>

        <li>
          <NavLink to="/events">🎉 Event</NavLink>
        </li>
      </ul>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;

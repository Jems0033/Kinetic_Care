import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Staff from "./pages/Staff";
import Room from "./pages/Room";
import Donor from "./pages/Donor";
import Medical from "./pages/Medical";
import Visitor from "./pages/Visitor";
import Event from "./pages/Event";
import FamilyDashboard from "./pages/FamilyDashboard"
import BookVisit from "./pages/BookVisit";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/residents" element={<Residents />} />

      <Route path="/staff" element={<Staff />} />

      <Route path="/rooms" element={<Room />} />

      <Route path="/donors" element={<Donor />} />
      
      <Route path="/medical" element={<Medical />} />

      <Route path="/visitors" element={<Visitor />} />

      <Route path="/events" element={<Event />} />

      <Route path="/family/dashboard" element={<FamilyDashboard />} />

      <Route path="/family/book-visit" element={<BookVisit />} />
    </Routes>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/admin/Dashboard";
import Residents from "./pages/admin/Residents";
import Staff from "./pages/admin/Staff";
import Room from "./pages/admin/Room";
import Donor from "./pages/admin/Donor";
import Medical from "./pages/admin/Medical";
import Visitor from "./pages/admin/Visitor";
import Event from "./pages/admin/Event";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientDetails from "./pages/doctor/PatientDetails";
import DoctorProfile from "./pages/doctor/DoctorProfile";

import MedicalHistory from "./pages/family/MedicalHistory";
import FamilyDashboard from "./pages/family/FamilyDashboard";
import BookVisit from "./pages/family/BookVisit";

import Home from "./pages/Home";
import Donate from "./pages/Donate";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

import CaretakerDashboard from "./pages/caretaker/CaretakerDashboard";
import ResidentCare from "./pages/caretaker/ResidentCare";
import Profile from "./pages/caretaker/Profile";
import FamilyProfile from "./pages/family/FamilyProfile";



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

      <Route path="/family-dashboard" element={<FamilyDashboard />} />

      <Route path="/family/book-visit" element={<BookVisit />} />

<Route
  path="/family/medical-history/:residentId"
  element={<MedicalHistory />}
/>

      <Route path="/donate" element={<Donate />} />

      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

      <Route path="/doctor/patient/:id" element={<PatientDetails />} />

      <Route
        path="/doctor/profile"
        element={<DoctorProfile />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
  path="/caretaker/dashboard"
  element={<CaretakerDashboard />}
/>

<Route
  path="/caretaker/resident/:id"
  element={<ResidentCare />}
/>

    <Route path="/caretaker/profile" element={<Profile />} />
    <Route path="/family/profile" element={<FamilyProfile />} />


    </Routes>
  );
}

export default App;

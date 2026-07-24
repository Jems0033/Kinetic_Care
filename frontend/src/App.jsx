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
import DoctorPatients from "./pages/doctor/DoctorPatients";
import PatientDetails from "./pages/doctor/PatientDetails";
import DoctorProfile from "./pages/doctor/DoctorProfile";

import MedicalHistory from "./pages/family/MedicalHistory";
import FamilyDonate from "./pages/family/FamilyDonate";
import FamilyDashboard from "./pages/family/FamilyDashboard";
import BookVisit from "./pages/family/BookVisit";

import Home from "./pages/Home";
import PublicDonate from "./pages/PublicDonate";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffResidents from "./pages/staff/StaffResidents";
import StaffResidentDetails from "./pages/staff/StaffResidentDetails";
import UpdateVitals  from "./pages/staff/UpdateVitals";
import GiveMedicine from "./pages/staff/GiveMedicine";
import ResidentHistory from "./pages/staff/ResidentHistory";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/residents" element={<Residents />} />

      <Route
    path="/staff/resident/:id"
    element={<StaffResidentDetails />}
  />
  <Route
  path="/staff/resident/:id/vitals"
  element={<UpdateVitals />}
/>

<Route
  path="/staff/resident/:id/medicine"
  element={<GiveMedicine />}
/>

<Route
  path="/staff/resident/:id/history"
  element={<ResidentHistory />}
/>

      <Route path="/staff" element={<Staff />} />

      <Route path="/rooms" element={<Room />} />

      <Route path="/donors" element={<Donor />} />

      <Route path="/medical" element={<Medical />} />

      <Route path="/visitors" element={<Visitor />} />

      <Route path="/events" element={<Event />} />

      <Route path="/family-dashboard" element={<FamilyDashboard />} />

      <Route path="/family/book-visit" element={<BookVisit />} />

      <Route path="/family/medical-history" element={<MedicalHistory />} />

      <Route path="/family/donate" element={<FamilyDonate />} />

      <Route path="/donate" element={<PublicDonate />} />

      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

      <Route path="/doctor/patients" element={<DoctorPatients />} />

      <Route path="/doctor/patient/:id" element={<PatientDetails />} />

      <Route
    path="/doctor/profile"
    element={<DoctorProfile />}
/>
<Route path="/staff-dashboard" element={<StaffDashboard />} />
<Route path="/staff/residents" element={<StaffResidents />} />
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

    </Routes>
  );
}

export default App;

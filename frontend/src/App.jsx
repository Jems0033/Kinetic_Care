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
import FamilyDashboard from "./pages/FamilyDashboard";
import BookVisit from "./pages/BookVisit";
import MedicalHistory from "./pages/MedicalHistory";
import FamilyDonate from "./pages/FamilyDonate";
import PublicDonate from "./pages/PublicDonate";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorPatients from "./pages/DoctorPatients";
import PatientDetails from "./pages/PatientDetails";
import DoctorProfile from "./pages/DoctorProfile"
import StaffDashboard from "./pages/StaffDashboard";
import StaffResidents from "./pages/StaffResidents";
import StaffResidentDetails from "./pages/StaffResidentDetails";
import UpdateVitals  from "./pages/UpdateVitals";
import GiveMedicine from "./pages/GiveMedicine";
import ResidentHistory from "./pages/ResidentHistory";
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

    </Routes>
  );
}

export default App;

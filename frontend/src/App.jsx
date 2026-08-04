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
import FamilyProfile from "./pages/family/FamilyProfile";

import Home from "./pages/Home";
import Donate from "./pages/Donate";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProtectedRoute from "./pages/auth/ProtectedRoute";

import CaretakerDashboard from "./pages/caretaker/CaretakerDashboard";
import ResidentCare from "./pages/caretaker/ResidentCare";
import Profile from "./pages/caretaker/Profile";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/donate" element={<Donate />} />

      {/* Admin */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/residents"
        element={
          <ProtectedRoute>
            <Residents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <Staff />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <Room />
          </ProtectedRoute>
        }
      />

      <Route
        path="/donors"
        element={
          <ProtectedRoute>
            <Donor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/medical"
        element={
          <ProtectedRoute>
            <Medical />
          </ProtectedRoute>
        }
      />

      <Route
        path="/visitors"
        element={
          <ProtectedRoute>
            <Visitor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Event />
          </ProtectedRoute>
        }
      />

      {/* Family */}

      <Route
        path="/family-dashboard"
        element={
          <ProtectedRoute>
            <FamilyDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/family/book-visit"
        element={
          <ProtectedRoute>
            <BookVisit />
          </ProtectedRoute>
        }
      />

      <Route
        path="/family/medical-history/:residentId"
        element={
          <ProtectedRoute>
            <MedicalHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/family/profile"
        element={
          <ProtectedRoute>
            <FamilyProfile />
          </ProtectedRoute>
        }
      />

      {/* Doctor */}

      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/patient/:id"
        element={
          <ProtectedRoute>
            <PatientDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute>
            <DoctorProfile />
          </ProtectedRoute>
        }
      />

      {/* Caretaker */}

      <Route
        path="/caretaker/dashboard"
        element={
          <ProtectedRoute>
            <CaretakerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/caretaker/resident/:id"
        element={
          <ProtectedRoute>
            <ResidentCare />
          </ProtectedRoute>
        }
      />

      <Route
        path="/caretaker/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Signup.jsx";
import Login from "./Login";
import AdminCreateUser from "./AdminCreateUser.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import TeacherDashboard from "./TeacherDashboard.jsx";
import StudentDashboard from "./StudentDashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AskAI from "./AskAI";
import Navbar from './navbar.jsx';


function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Role-Based Dashboards */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute allowedRoles={[ "admin"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student",  "admin"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Create User */}
      <Route
        path="/admin/create-user"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCreateUser />
          </ProtectedRoute>
        }
      />

      {/* Optional generic dashboard route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navigate to="/student-dashboard" />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" />} />
      
      <Route path="/ask-ai" element={<AskAI />} />
    </Routes>
  );
}

export default App;

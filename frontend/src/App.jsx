import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./Signup";
import Login from "./Login";
import AdminCreateUser from "./AdminCreateUser.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import StudentDashboard from "./StudentDashboard.jsx";
import AskAI from "./AskAI";
import AboutStudent from "./AboutStudent";
import AboutAdmin from "./AboutAdmin";
import AnalyticsDashboard from "./Anal_dash.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Admin only */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/create-user"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCreateUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AnalyticsDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/about-admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AboutAdmin />
          </ProtectedRoute>
        }
      />

      {/* Student only */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/about-student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AboutStudent />
          </ProtectedRoute>
        }
      />

      {/* Shared */}
      <Route
        path="/ask-ai"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AskAI />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}

export default App;
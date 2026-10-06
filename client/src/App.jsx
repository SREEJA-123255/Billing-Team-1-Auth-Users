import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/Layout/AppLayout";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import UserManagement from "./pages/Users/UserManagement";
import BusinessSettings from "./pages/BusinessSettings/BusinessSettings";
import NotFound from "./pages/NotFound/NotFound";

// Public route helper (redirects to /users if already logged in)
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to="/users" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routes */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            }
          />
          {/* Fallback route redirect to OTP forgot-password */}
          <Route path="/reset-password/*" element={<Navigate to="/forgot-password" replace />} />

          {/* Protected Application Routes inside AppLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/users" replace />} />

              {/* ADMIN ONLY Team 1 Modules */}
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/users" element={<UserManagement />} />
                <Route path="/business-settings" element={<BusinessSettings />} />
              </Route>

              {/* 404 Inside Layout */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

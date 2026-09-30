import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiShield, FiAlertTriangle } from "react-icons/fi";

const ProtectedRoute = ({ allowedRoles = null }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="spinner spinner-primary" style={{ width: "3rem", height: "3rem", borderWidth: "3px" }}></div>
      </div>
    );
  }
  

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization if restricted
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <div style={{ padding: "3rem 1.5rem", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "2.5rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0"
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#fef2f2",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              margin: "0 auto 1.25rem"
            }}
          >
            <FiShield />
          </div>
          <h2 style={{ fontSize: "1.5rem", color: "#0f172a", marginBottom: "0.5rem" }}>
            Access Restricted
          </h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem", lineHeight: "1.6" }}>
            Your account role is <strong>{currentUser.role}</strong>. You do not have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <a href="/login" className="btn btn-secondary">
            Return to Login
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;

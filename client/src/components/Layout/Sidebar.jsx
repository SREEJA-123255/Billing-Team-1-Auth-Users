import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { RoleBadge } from "../Common/Badges";
import {
  FiUsers,
  FiSettings,
  FiLogOut,
  FiX,
  FiChevronRight
} from "react-icons/fi";
import logoImg from "../../assets/logo.png";

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { currentUser, logout } = useAuth();
  const role = currentUser?.role;

  const isAdmin = role === "ADMIN";

  const handleCrossOrExpandClick = () => {
    // If on mobile (<= 768px), close the drawer overlay
    if (window.innerWidth <= 768) {
      onClose();
    } else {
      // On desktop/tablet, toggle collapse to icon-only mode
      onToggleCollapse();
    }
  };

  return (
    <>
      {/* Overlay for mobile drawer */}
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className={`sidebar-brand ${isCollapsed ? "brand-collapsed" : ""}`}>
          <div
            className="sidebar-logo-wrapper"
            style={{ width: "40px", height: "40px", minWidth: "40px", maxWidth: "40px", overflow: "hidden" }}
            title={isCollapsed ? "Click to expand sidebar" : "IT Spaxios Innovation"}
            onClick={isCollapsed ? onToggleCollapse : undefined}
            role={isCollapsed ? "button" : undefined}
            tabIndex={isCollapsed ? 0 : undefined}
          >
            <img
              src={logoImg}
              alt="IT Spaxios Innovation Logo"
              className="sidebar-logo-img"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </div>

          {!isCollapsed && (
            <div className="sidebar-brand-text">
              <h2>IT Spaxios</h2>
              <span>Innovation</span>
            </div>
          )}

          {/* Close / Collapse Cross Button (or Expand Arrow when collapsed) */}
          <button
            onClick={handleCrossOrExpandClick}
            className={`sidebar-collapse-btn ${isCollapsed ? "btn-expand" : "btn-close"}`}
            title={isCollapsed ? "Expand sidebar" : "Close sidebar (show only icons)"}
            aria-label={isCollapsed ? "Expand sidebar" : "Close sidebar to icons only"}
            id="btn-sidebar-toggle-cross"
          >
            {isCollapsed ? <FiChevronRight size={16} /> : <FiX size={18} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {!isCollapsed && (
            <div className="nav-section-title">Administration</div>
          )}

          {isAdmin && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              title="User Management"
              data-tooltip="User Management"
              onClick={() => {
                if (window.innerWidth <= 768) onClose();
              }}
            >
              <span className="nav-item-icon">
                <FiUsers />
              </span>
              {!isCollapsed && <span>User Management</span>}
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/business-settings"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              title="Business Settings"
              data-tooltip="Business Settings"
              onClick={() => {
                if (window.innerWidth <= 768) onClose();
              }}
            >
              <span className="nav-item-icon">
                <FiSettings />
              </span>
              {!isCollapsed && <span>Business Settings</span>}
            </NavLink>
          )}
        </nav>

        {/* Sidebar Footer with Logged in user info & Logout */}
        <div className={`sidebar-footer ${isCollapsed ? "footer-collapsed" : ""}`}>
          <div className="user-mini-card">
            <div
              className="user-avatar"
              title={`${currentUser?.name || "User"} (${currentUser?.role || "STAFF"})`}
              onClick={isCollapsed ? onToggleCollapse : undefined}
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser?.name || "Avatar"}
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : currentUser?.name ? (
                currentUser.name.charAt(0).toUpperCase()
              ) : (
                "U"
              )}
            </div>

            {!isCollapsed && (
              <div className="user-meta">
                <div className="user-meta-name">{currentUser?.name}</div>
                <div style={{ marginTop: "3px" }}>
                  <RoleBadge role={currentUser?.role || "STAFF"} />
                </div>
              </div>
            )}

            {!isCollapsed ? (
              <button
                onClick={logout}
                className="btn btn-outline"
                style={{
                  marginLeft: "auto",
                  padding: "0.5rem",
                  color: "#f87171",
                  borderColor: "#334155",
                  background: "transparent"
                }}
                title="Logout"
                aria-label="Logout"
              >
                <FiLogOut />
              </button>
            ) : (
              <button
                onClick={logout}
                className="collapsed-logout-btn"
                title="Sign out"
                aria-label="Sign out"
              >
                <FiLogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

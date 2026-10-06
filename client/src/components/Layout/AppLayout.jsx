import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Determine current page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/users":
        return "User Management";
      case "/business-settings":
        return "Business Settings";
      default:
        return "IT Spaxios Innovation";
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleNavbarToggle = () => {
    if (window.innerWidth > 768) {
      setIsCollapsed((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  return (
    <div className={`app-layout ${isCollapsed ? "layout-sidebar-collapsed" : ""}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div className="main-wrapper">
        <Navbar
          title={getPageTitle()}
          onToggleSidebar={handleNavbarToggle}
          isCollapsed={isCollapsed}
        />
        <main className="content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

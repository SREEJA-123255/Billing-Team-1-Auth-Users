import React from "react";

export const RoleBadge = ({ role }) => {
  const roleStyles = {
    ADMIN: "badge-role-admin",
    MANAGER: "badge-role-manager",
    CASHIER: "badge-role-cashier",
    STAFF: "badge-role-staff"
  };

  const className = `badge ${roleStyles[role] || "badge-role-staff"}`;

  return <span className={className}>{role}</span>;
};

export const StatusBadge = ({ status }) => {
  const isActive = status === "ACTIVE";
  const className = `badge ${isActive ? "badge-active" : "badge-inactive"}`;

  return (
    <span className={className}>
      <span className="badge-dot"></span>
      {status}
    </span>
  );
};

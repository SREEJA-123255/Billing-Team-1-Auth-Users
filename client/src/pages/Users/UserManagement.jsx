import React, { useState, useEffect, useCallback } from "react";
import userService from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { RoleBadge, StatusBadge } from "../../components/Common/Badges";
import UserModal from "./UserModal";
import ConfirmDialog from "../../components/Common/ConfirmDialog";
import Toast from "../../components/Common/Toast";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiUserX,
  FiUserCheck,
  FiRefreshCw,
  FiPhone,
  FiMail,
  FiCalendar,
  FiUsers,
  FiAlertCircle
} from "react-icons/fi";
import "./Users.css";

const UserManagement = () => {
  const { currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 10 });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Status toggle confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    user: null,
    targetStatus: "INACTIVE",
    loading: false
  });

  // Toast state
  const [toast, setToast] = useState({ message: "", type: "info" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Fetch users from backend
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getUsers({
        search: search.trim() || undefined,
        role: roleFilter !== "ALL" ? roleFilter : undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        page,
        limit: 10
      });

      if (res.success && res.data) {
        setUsers(res.data.users || []);
        setPagination(res.data.pagination || { total: 0, pages: 1, limit: 10 });
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load users. Please check your network connection and retry."
      );
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [fetchUsers]);

  // Reset page when search or filters change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  // Open modal for creation
  const handleOpenAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Save (Create or Update) user
  const handleSaveUser = async (formData) => {
    setIsSaving(true);
    try {
      if (selectedUser) {
        // Update user
        const res = await userService.updateUser(selectedUser.id || selectedUser._id, formData);
        showToast(res.message || "User updated successfully", "success");
      } else {
        // Create user
        const res = await userService.createUser(formData);
        showToast(res.message || "User created successfully", "success");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
          err.response?.data?.errors
          ? Object.values(err.response.data.errors).join(", ")
          : "Failed to save user";
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Open status toggle confirmation dialog
  const promptToggleStatus = (user) => {
    // Block deactivating Admin account
    if (user.role === "ADMIN") {
      showToast("The System Administrator account cannot be deactivated. It is governed strictly by server .env.", "error");
      return;
    }

    const isCurrentlyActive = user.status === "ACTIVE";
    const targetStatus = isCurrentlyActive ? "INACTIVE" : "ACTIVE";

    // Prevent self-deactivation
    if (
      user.id === currentUser?.id ||
      user._id === currentUser?.id ||
      user.email === currentUser?.email
    ) {
      showToast("You cannot deactivate your own administrative account.", "error");
      return;
    }

    setConfirmDialog({
      isOpen: true,
      user,
      targetStatus,
      loading: false
    });
  };

  // Confirm and execute status toggle
  const handleConfirmToggleStatus = async () => {
    if (!confirmDialog.user) return;

    setConfirmDialog((prev) => ({ ...prev, loading: true }));
    try {
      const userId = confirmDialog.user.id || confirmDialog.user._id;
      const res = await userService.toggleUserStatus(userId, confirmDialog.targetStatus);
      showToast(res.message || `User status changed to ${confirmDialog.targetStatus}`, "success");
      setConfirmDialog({ isOpen: false, user: null, targetStatus: "INACTIVE", loading: false });
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update user status";
      showToast(msg, "error");
      setConfirmDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="users-page">
      {/* Toast Notification */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "info" })}
        />
      )}

      {/* Action Bar */}
      <div className="users-action-bar">
        <div className="users-heading">
          <h2>User Accounts & Permissions</h2>
          <p>Create, manage roles, and control access permissions for all staff members.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenAdd}
          id="btn-add-user"
        >
          <FiPlus />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="users-filter-card">
        <div className="search-box">
          <FiSearch className="search-box-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={handleSearchChange}
            id="search-users-input"
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={roleFilter}
            onChange={handleRoleChange}
            id="filter-role-select"
            aria-label="Filter by role"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="CASHIER">CASHIER</option>
            <option value="STAFF">STAFF</option>
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={handleStatusChange}
            id="filter-status-select"
            aria-label="Filter by status"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchUsers}
            title="Refresh list"
          >
            <FiRefreshCw />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <FiAlertCircle style={{ fontSize: "1.25rem", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>{error}</div>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={fetchUsers}>
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="state-message-card">
          <div className="spinner spinner-primary" style={{ width: "2.5rem", height: "2.5rem", borderWidth: "3px" }}></div>
          <div className="state-message-title" style={{ marginTop: "1rem" }}>
            Loading Users...
          </div>
          <p className="state-message-desc">Retrieving records from the system</p>
        </div>
      ) : users.length === 0 ? (
        /* Empty State */
        <div className="state-message-card">
          <div className="state-message-icon">
            <FiUsers />
          </div>
          <div className="state-message-title">No Users Found</div>
          <p className="state-message-desc">
            {search || roleFilter !== "ALL" || statusFilter !== "ALL"
              ? "No accounts matched your search criteria or active filters."
              : "No user accounts have been created yet."}
          </p>
          {(search || roleFilter !== "ALL" || statusFilter !== "ALL") && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearch("");
                setRoleFilter("ALL");
                setStatusFilter("ALL");
                setPage(1);
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View (>= 768px) */}
          <div className="table-container">
            <table className="desktop-table-view">
              <thead>
                <tr>
                  <th>User / Name</th>
                  <th>Contact Info</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const uid = u.id || u._id;
                  const isSelf = uid === currentUser?.id || u.email === currentUser?.email;
                  return (
                    <tr key={uid}>
                      <td>
                        <div className="user-name-cell">{u.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          ID: {uid?.substring(0, 8)}...
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                          <FiMail style={{ color: "#94a3b8", fontSize: "0.875rem" }} />
                          <span>{u.email}</span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            marginTop: "3px",
                            fontSize: "0.8125rem",
                            color: "#64748b"
                          }}
                        >
                          <FiPhone style={{ color: "#94a3b8", fontSize: "0.875rem" }} />
                          <span>{u.phone}</span>
                        </div>
                      </td>
                      <td>
                        <RoleBadge role={u.role} />
                      </td>
                      <td>
                        <StatusBadge status={u.status} />
                      </td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => handleOpenEdit(u)}
                            title="Edit User"
                          >
                            <FiEdit2 />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            className={`btn btn-sm ${u.status === "ACTIVE" ? "btn-outline-danger" : "btn-secondary"
                              }`}
                            onClick={() => promptToggleStatus(u)}
                            disabled={isSelf || u.role === "ADMIN"}
                            title={
                              u.role === "ADMIN"
                                ? "System Administrator account cannot be deactivated (governed by server .env)"
                                : isSelf
                                  ? "You cannot deactivate your own account"
                                  : u.status === "ACTIVE"
                                    ? "Deactivate User"
                                    : "Activate User"
                            }
                          >
                            {u.status === "ACTIVE" ? (
                              <>
                                <FiUserX />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <FiUserCheck />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards List (< 768px) */}
          <div className="mobile-card-list">
            {users.map((u) => {
              const uid = u.id || u._id;
              const isSelf = uid === currentUser?.id || u.email === currentUser?.email;
              return (
                <div key={uid} className="user-card">
                  <div className="user-card-header">
                    <div>
                      <div className="user-card-title">{u.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>
                        Joined {formatDate(u.createdAt)}
                      </div>
                    </div>
                    <StatusBadge status={u.status} />
                  </div>

                  <div className="user-card-meta">
                    <div className="meta-row">
                      <FiMail style={{ color: "#94a3b8" }} />
                      <span>{u.email}</span>
                    </div>
                    <div className="meta-row">
                      <FiPhone style={{ color: "#94a3b8" }} />
                      <span>{u.phone}</span>
                    </div>
                    <div style={{ marginTop: "4px" }}>
                      <RoleBadge role={u.role} />
                    </div>
                  </div>

                  <div className="user-card-actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleOpenEdit(u)}
                    >
                      <FiEdit2 />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      className={`btn btn-sm ${u.status === "ACTIVE" ? "btn-outline-danger" : "btn-secondary"
                        }`}
                      style={{ flex: 1 }}
                      onClick={() => promptToggleStatus(u)}
                      disabled={isSelf || u.role === "ADMIN"}
                      title={
                        u.role === "ADMIN"
                          ? "System Administrator account cannot be deactivated (governed by server .env)"
                          : isSelf
                            ? "You cannot deactivate your own account"
                            : u.status === "ACTIVE"
                              ? "Deactivate User"
                              : "Activate User"
                      }
                    >
                      {u.status === "ACTIVE" ? (
                        <>
                          <FiUserX />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <FiUserCheck />
                          <span>Activate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing <strong>{users.length}</strong> of <strong>{pagination.total}</strong> users
                (Page {pagination.page} of {pagination.pages})
              </div>

              <div className="pagination-controls">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add / Edit User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        isSaving={isSaving}
      />

      {/* Deactivate / Activate Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() =>
          setConfirmDialog({ isOpen: false, user: null, targetStatus: "INACTIVE", loading: false })
        }
        onConfirm={handleConfirmToggleStatus}
        title={confirmDialog.targetStatus === "INACTIVE" ? "Deactivate User" : "Activate User"}
        message={
          confirmDialog.targetStatus === "INACTIVE"
            ? `Are you sure you want to deactivate ${confirmDialog.user?.name}? They will immediately be prevented from logging into the billing system.`
            : `Are you sure you want to restore access for ${confirmDialog.user?.name}? They will be able to log in again.`
        }
        confirmText={confirmDialog.targetStatus === "INACTIVE" ? "Yes, Deactivate" : "Yes, Activate"}
        isDanger={confirmDialog.targetStatus === "INACTIVE"}
        loading={confirmDialog.loading}
      />
    </div>
  );
};

export default UserManagement;

import apiClient from "./apiClient";

const userService = {
  // Get users list with optional search, role, status, page, and limit
  getUsers: async (params = {}) => {
    const response = await apiClient.get("/users", { params });
    return response.data;
  },

  // Get single user by ID
  getUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Create new user (Admin only)
  createUser: async (userData) => {
    const response = await apiClient.post("/users", userData);
    return response.data;
  },

  // Update user details (Admin only)
  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // Soft activate / deactivate user status (Admin only)
  toggleUserStatus: async (id, status) => {
    const response = await apiClient.patch(`/users/${id}/status`, { status });
    return response.data;
  }
};

export default userService;

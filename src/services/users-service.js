import axios from "axios";

// Base API configuration
const API_BASE_URL =
  import.meta.env?.VITE_API_URL || "http://localhost:5016/api";
// const API_BASE_URL = import.meta.env?.VITE_API_URL || "https://emuss.depedimuscity.com:5016/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token if available
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor to handle common errors
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Unauthorized - clear token and redirect to login
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// User Service Functions
export const userService = {
  // User Registration
  async registerUser(userData) {
    try {
      const response = await apiClient.post("/users/register", userData);
      return {
        success: true,
        data: response.data,
        message: "User registered successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || error.message || "Registration failed",
        message: "Failed to register user",
      };
    }
  },

  // User Login
  async loginUser(credentials) {
    try {
      const response = await apiClient.post("/users/login", credentials);

      // Commented out token storage for now
      // if (response.data.success) {
      //   // Store auth token and user data
      //   localStorage.setItem("authToken", response.data.token || "dummy-token");
      //   localStorage.setItem("user", JSON.stringify(response.data.user));
      // }

      return {
        success: true,
        data: response.data,
        message: "Login successful",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Login failed",
        message: "Invalid email or password",
      };
    }
  },

  // User Logout
  logoutUser() {
    // Commented out token cleanup for now
    // localStorage.removeItem("authToken");
    // localStorage.removeItem("user");
    return {
      success: true,
      message: "Logged out successfully",
    };
  },

  // Update User
  async updateUser(userId, updateData) {
    try {
      const response = await apiClient.put(`/users/${userId}`, updateData);
      return {
        success: true,
        data: response.data,
        message: "User updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Update failed",
        message: "Failed to update user",
      };
    }
  },

  // Delete User
  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return {
        success: true,
        data: response.data,
        message: "User deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Delete failed",
        message: "Failed to delete user",
      };
    }
  },

  async getAllUsers() {
    try {
      const response = await apiClient.get("/users/getAllUsers");
      return {
        success: true,
        data: response.data,
        message: "Users fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          "Get all users failed",
        message: "Failed to get all users",
      };
    }
  },

  // Get Current User
  getCurrentUser() {
    // Commented out for now - no token storage
    // try {
    //   const user = localStorage.getItem("user");
    //   return user ? JSON.parse(user) : null;
    // } catch (error) {
    //   console.error("Error parsing user data:", error);
    //   return null;
    // }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    // Commented out for now - no token storage
    // const token = localStorage.getItem("authToken");
    // const user = localStorage.getItem("user");
    // return !!(token && user);
    return false;
  },

  // Get auth token
  getAuthToken() {
    // Commented out for now - no token storage
    // return localStorage.getItem("authToken");
    return null;
  },
};

// Export individual functions for convenience
export const {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  isAuthenticated,
  getAuthToken,
} = userService;

export default userService;

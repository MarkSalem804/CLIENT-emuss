import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { userService } from "../services/users-service";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    try {
      const userData = localStorage.getItem("emuss_user");
      const token = localStorage.getItem("emuss_token");

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      // Clear invalid data
      localStorage.removeItem("emuss_user");
      localStorage.removeItem("emuss_token");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      console.log("AuthContext: Attempting login with:", credentials);

      // Call the actual login API
      const result = await userService.loginUser(credentials);
      console.log("AuthContext: User service result:", result);

      if (result.success) {
        // Extract user data from the response (backend returns user directly)
        const userData = result.user;
        const token = result.token || "dummy-token"; // Use actual token when available

        console.log("AuthContext: Login successful, user data:", userData);

        // Store user data and token
        localStorage.setItem("emuss_user", JSON.stringify(userData));
        localStorage.setItem("emuss_token", token);

        setIsAuthenticated(true);
        setUser(userData);

        return { success: true, user: userData };
      } else {
        // Login failed
        console.log("AuthContext: Login failed:", result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      return {
        success: false,
        error: error.message || "An unexpected error occurred",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("emuss_user");
    localStorage.removeItem("emuss_token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

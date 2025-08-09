import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

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
      // Mock login for now - replace with actual API call
      const mockUser = {
        id: 1,
        name: "Dr. Smith",
        email: credentials.email || "dr.smith@medsystem.com",
        role: "Administrator",
        avatar: null,
      };

      const mockToken = "mock-jwt-token";

      localStorage.setItem("emuss_user", JSON.stringify(mockUser));
      localStorage.setItem("emuss_token", mockToken);

      setIsAuthenticated(true);
      setUser(mockUser);

      return { success: true, user: mockUser };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
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

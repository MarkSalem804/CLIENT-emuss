import { useState, useRef, useEffect } from "react";
import { Bell, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Topbar = ({ sidebarCollapsed }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-emerald-100/90 backdrop-blur-sm shadow-sm border-b border-emerald-200/50 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Side - System Title */}
        <div className="flex items-center">
          {/* System Title - Responsive */}
          <div className="hidden sm:block">
            <h1 className="font-semibold text-slate-800 text-lg transition-all duration-500 ease-in-out">
              <span
                className={`transition-all duration-500 ease-in-out ${
                  sidebarCollapsed ? "inline" : "hidden lg:inline"
                }`}
              >
                Electronic Medical Records and Unified Scheduling System
              </span>
              <span
                className={`transition-all duration-500 ease-in-out ${
                  sidebarCollapsed ? "hidden" : "lg:hidden"
                }`}
              >
                EMRUSS
              </span>
            </h1>
            <p
              className={`text-xs text-slate-500 transition-all duration-500 ease-in-out ${
                sidebarCollapsed ? "block" : "hidden md:block"
              }`}
            >
              Medical Unit Support System
            </p>
          </div>
        </div>

        {/* Right Side - Notifications & User Menu */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-slate-600 hover:bg-emerald-200/70 hover:text-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300/50">
            <Bell className="w-5 h-5" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs rounded-full flex items-center justify-center shadow-sm">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg text-slate-600 hover:bg-emerald-200/70 hover:text-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-800">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.role || "Administrator"}
                </p>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-emerald-200/30 py-3 z-50 backdrop-blur-sm">
                {/* Header Section */}
                <div className="px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 mx-3 rounded-xl border border-emerald-100/50">
                  <p className="text-sm font-semibold text-slate-800">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-slate-600">
                    {user?.email || "user@example.com"}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">
                    {user?.role || "Administrator"}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="mt-3 px-2">
                  <button className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-3 transition-all duration-200 rounded-xl">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium">Profile</span>
                  </button>

                  <button className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-3 transition-all duration-200 rounded-xl">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Settings</span>
                  </button>

                  <hr className="my-2 border-slate-200/50" />

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center space-x-3 transition-all duration-200 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Topbar.propTypes = {
  sidebarCollapsed: PropTypes.bool.isRequired,
};

export default Topbar;

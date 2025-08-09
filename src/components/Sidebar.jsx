import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  Users,
  UserCheck,
  History,
  Calendar,
  FileText,
  ChevronRight,
  LogOut,
} from "lucide-react";
import PropTypes from "prop-types";
import depedLogo from "../assets/deped_logo.png";

const Sidebar = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const routes = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "inventory",
      name: "Inventory",
      icon: Package,
      badge: "Beta",
      path: "/inventory",
    },
    {
      id: "doctors",
      name: "Doctor's Directory",
      icon: UserCheck,
      path: "/doctors",
    },
    { id: "users", name: "Users Management", icon: Users, path: "/users" },
    { id: "history", name: "Clients History", icon: History, path: "/history" },
    {
      id: "appointments",
      name: "Appointments",
      icon: Calendar,
      path: "/appointments",
    },
    {
      id: "records",
      name: "Medical Records",
      icon: FileText,
      path: "/records",
    },
  ];

  const handleRouteClick = (route) => {
    navigate(route.path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isRouteActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={`
        bg-emerald-100 shadow-xl border-r border-emerald-300/50
        transition-all duration-500 ease-in-out flex flex-col
        ${isCollapsed ? "w-20" : "w-64"}
        overflow-x-hidden overflow-y-hidden h-screen transform-gpu will-change-[width]
      `}
      style={{
        transitionProperty: "width, padding, margin, opacity, transform",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Sidebar Header */}
      <div
        className={`p-4 border-b border-emerald-200/40 ${
          isCollapsed ? "px-2" : ""
        }`}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          {/* Clickable Logo */}
          <button
            onClick={onToggle}
            className="bg-white/95 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ease-in-out hover:scale-110 hover:shadow-xl hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60 w-12 h-12 cursor-pointer p-1 border border-white/50"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <img
              src={depedLogo}
              alt="DepEd Logo"
              className="w-full h-full object-contain transition-all duration-500 ease-in-out"
            />
          </button>

          {/* Title - Hidden when collapsed */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <div>
              <h2 className="text-lg font-bold text-teal-900 whitespace-nowrap drop-shadow-sm">
                EMUSS
              </h2>
              <p className="text-xs text-teal-700 whitespace-nowrap">
                Admin Panel
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = isRouteActive(route.path);

          return (
            <div key={route.id} className="relative group">
              <button
                onClick={() => handleRouteClick(route)}
                className={`
                  w-full flex items-center p-3 rounded-xl text-left transition-all duration-500 ease-in-out transform hover:scale-105 cursor-pointer overflow-hidden
                  ${
                    isActive
                      ? "bg-white/80 backdrop-blur-sm text-teal-800 shadow-lg border border-teal-300/60 scale-105"
                      : "text-slate-800 hover:bg-white/60 hover:backdrop-blur-sm hover:text-teal-800 hover:shadow-md"
                  }
                  ${isCollapsed ? "justify-center" : "justify-between"}
                `}
                title={isCollapsed ? route.name : ""}
                style={{
                  transitionProperty: "all",
                  transitionDuration: "500ms",
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div className="flex items-center">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-teal-700"
                        : "text-slate-600 group-hover:text-teal-700"
                    }`}
                  />
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    }`}
                  >
                    <span className="ml-3 font-medium text-sm whitespace-nowrap">
                      {route.name}
                    </span>
                  </div>
                </div>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {route.badge && (
                      <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full shadow-sm whitespace-nowrap">
                        {route.badge}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-4 h-4 transition-all duration-500 ${
                        isActive
                          ? "text-teal-600 rotate-90"
                          : "text-slate-500 group-hover:text-teal-600"
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {route.name}
                  {route.badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-orange-500 rounded-full">
                      {route.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-emerald-200/40 mt-auto">
        <div className="relative group">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center p-3 rounded-xl text-slate-800 hover:bg-white/70 hover:backdrop-blur-sm hover:text-pink-700 hover:shadow-md transition-all duration-500 group ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut className="w-5 h-5 group-hover:text-pink-500 transition-colors duration-300" />
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              <span className="ml-3 font-medium text-sm whitespace-nowrap">
                Logout
              </span>
            </div>
          </button>

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Sidebar;

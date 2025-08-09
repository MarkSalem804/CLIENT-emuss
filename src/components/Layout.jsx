import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    // Main flex row: sidebar and content are siblings
    <div className="flex h-screen bg-gray-50 overflow-x-hidden">
      {/* Sidebar as a flex child, never fixed */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />

      {/* Main content area fills remaining space */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for mobile */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="ml-3 text-lg font-semibold text-gray-900">
              MedSystem
            </h1>
          </div>

          {/* Desktop toggle button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:block p-2 rounded-md hover:bg-gray-100 ml-4"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Desktop toggle button */}
        <div className="hidden lg:block">
          <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-md hover:shadow-lg transition-shadow"
            style={{
              left: sidebarCollapsed ? "20px" : "272px",
              transition: "left 300ms ease-in-out",
            }}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">{children}</main>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

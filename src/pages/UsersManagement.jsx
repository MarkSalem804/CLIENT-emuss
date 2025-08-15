import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import { userService } from "../services/users-service";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import PropTypes from "prop-types";

// CSS Animations for Modal
const modalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInFromBottom {
    from { 
      transform: translateY(20px) scale(0.95);
      opacity: 0;
    }
    to { 
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  @keyframes slideOutToBottom {
    from { 
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    to { 
      transform: translateY(20px) scale(0.95);
      opacity: 0;
    }
  }
  
  .modal-backdrop {
    animation: fadeIn 0.3s ease-out;
  }
  
  .modal-content {
    animation: slideInFromBottom 0.3s ease-out;
  }
  
  .modal-backdrop.closing {
    animation: fadeOut 0.3s ease-in;
  }
  
  .modal-content.closing {
    animation: slideOutToBottom 0.3s ease-in;
  }

  @keyframes slideInFromRight {
    from { 
      transform: translateX(100%);
      opacity: 0;
    }
    to { 
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutToRight {
    from { 
      transform: translateX(0);
      opacity: 1;
    }
    to { 
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .snackbar-enter {
    animation: slideInFromRight 0.3s ease-out;
  }
  
  .snackbar-exit {
    animation: slideOutToRight 0.3s ease-in;
  }
`;

// Snackbar Component - Completely independent
const Snackbar = ({ message, type, isVisible }) => {
  const [internalVisible, setInternalVisible] = useState(isVisible);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      setInternalVisible(true);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Auto-hide after 4 seconds - NO CALLBACK
      timeoutRef.current = setTimeout(() => {
        setInternalVisible(false);
      }, 4000);
    } else {
      setInternalVisible(false);
    }

    // Cleanup timeout on unmount or when isVisible changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible]);

  if (!internalVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "info":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      default:
        return "text-blue-800";
    }
  };

  return createPortal(
    <div className={`fixed bottom-4 right-4 z-[99999] snackbar-enter`}>
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg max-w-sm ${getBgColor()}`}
      >
        {getIcon()}
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {message}
        </span>
        <button
          onClick={() => {
            setInternalVisible(false);
            // Don't call onClose - let the parent manage state
          }}
          className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
};

Snackbar.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "info"]).isRequired,
  isVisible: PropTypes.bool.isRequired,
};

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "",
    designation: "",
    schoolId: "",
    officeId: "",
    positionId: "",
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Inject modal styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = modalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Debug modal state changes
  useEffect(() => {
    console.log("Modal state changed:", { showRegistrationModal, isClosing });
  }, [showRegistrationModal, isClosing]);

  // Reset snackbar state when it becomes invisible
  useEffect(() => {
    if (!snackbar.isVisible) {
      // Reset snackbar after a short delay to allow for new messages
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, message: "", type: "success" }));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [snackbar.isVisible]);

  // Show snackbar function
  const showSnackbar = (message, type = "success") => {
    console.log("Showing snackbar:", message, type);
    setSnackbar({
      message,
      type,
      isVisible: true,
    });
  };

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const result = await userService.getAllUsers();
      if (result.success) {
        setUsers(result.data.users);
      } else {
        showSnackbar(result.error || "Failed to load users", "error");
      }
    } catch (error) {
      showSnackbar("Failed to load users", "error");
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterUser = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!newUser.email || !newUser.password) {
        showSnackbar("Email and password are required", "error");
        setIsLoading(false);
        return;
      }

      const result = await userService.registerUser(newUser);

      if (result.success) {
        // Add the new user to the local state
        setUsers((prevUsers) => [...prevUsers, result.data.user]);
        closeModal();
        resetForm();
        showSnackbar("User created successfully!", "success");
      } else {
        showSnackbar(result.error || "Failed to create user", "error");
        setIsLoading(false);
      }
    } catch (error) {
      showSnackbar("Failed to register user", "error");
      console.error("Error registering user:", error);
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setIsLoading(true);

      if (!selectedUser) return;

      const result = await userService.updateUser(selectedUser.id, newUser);

      if (result.success) {
        // Update the user in local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? result.data : user
          )
        );
        closeModal();
        setSelectedUser(null);
        resetForm();
        showSnackbar("User updated successfully!", "success");
      } else {
        showSnackbar(result.error || "Failed to update user", "error");
        setIsLoading(false);
      }
    } catch (error) {
      showSnackbar("Failed to update user", "error");
      console.error("Error updating user:", error);
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setIsLoading(true);
        const result = await userService.deleteUser(userId);

        if (result.success) {
          // Remove the user from local state
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId)
          );
          showSnackbar("User deleted successfully!", "success");
        } else {
          showSnackbar(result.error || "Failed to delete user", "error");
        }
      } catch (error) {
        showSnackbar("Failed to delete user", "error");
        console.error("Error deleting user:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setNewUser({
      email: "",
      password: "",
      role: "",
      designation: "",
      schoolId: "",
      officeId: "",
      positionId: "",
    });
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setNewUser({
      email: user.email,
      password: "", // Don't show password in edit mode
      role: user.role || "",
      designation: user.designation || "",
      schoolId: user.schoolId || "",
      officeId: user.officeId || "",
      positionId: user.positionId || "",
    });
    setShowRegistrationModal(true);
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    resetForm();
    console.log("Opening modal");
    setShowRegistrationModal(true);
    setIsClosing(false);
  };

  const closeModal = () => {
    console.log("closeModal called");
    setIsClosing(true);
    setTimeout(() => {
      setShowRegistrationModal(false);
      setIsClosing(false);
    }, 300);
  };

  // Tanstack Table columns definition
  const columns = useMemo(
    () => [
      {
        accessorKey: "email",
        header: "User",
        size: 280,
        cell: ({ getValue, row }) => (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {getValue()}
            </div>
            <div className="text-sm text-gray-500">ID: {row.original.id}</div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 140,
        cell: ({ getValue }) => {
          const role = getValue();
          const getRoleColor = (role) => {
            switch (role) {
              case "administrator":
                return "bg-red-100 text-red-800";
              case "doctor":
                return "bg-blue-100 text-blue-800";
              case "nurse":
                return "bg-green-100 text-green-800";
              case "teacher":
                return "bg-purple-100 text-purple-800";
              default:
                return "bg-gray-100 text-gray-800";
            }
          };

          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                role
              )}`}
            >
              {role || "No Role"}
            </span>
          );
        },
      },
      {
        accessorKey: "designation",
        header: "Designation",
        size: 200,
        cell: ({ getValue }) => (
          <div className="text-gray-900 truncate" title={getValue()}>
            {getValue() || "No Designation"}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        size: 140,
        cell: ({ getValue }) => (
          <div className="text-gray-500 text-sm">
            {getValue() ? new Date(getValue()).toLocaleDateString() : "N/A"}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        size: 120,
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => openEditModal(row.original)}
              className="text-primary-600 hover:text-primary-900"
              title="Edit User"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteUser(row.original.id)}
              className="text-red-600 hover:text-red-900"
              title="Delete User"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Tanstack Table instance
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: searchTerm,
      pagination: {
        pageIndex: currentPage,
        pageSize: pageSize,
      },
    },
    onGlobalFilterChange: setSearchTerm,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: currentPage,
          pageSize: pageSize,
        });
        setCurrentPage(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setCurrentPage(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    globalFilterFn: "includesString",
    initialState: {
      sorting: [{ id: "createdAt", desc: true }], // Sort by creation date descending
    },
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">
            Manage system users and their permissions
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Administrators</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter((u) => u.role === "administrator").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Teachers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter((u) => u.role === "teacher").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Other Roles</p>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  users.filter(
                    (u) =>
                      u.role && !["administrator", "teacher"].includes(u.role)
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by email, role, or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div style={{ minHeight: "450px" }}>
          {isLoading ? (
            <div
              className="flex flex-col items-center justify-center text-center p-12"
              style={{ height: "450px" }}
            >
              <div className="text-6xl mb-6">⏳</div>
              <h4 className="text-lg font-medium text-slate-800 mb-3">
                Loading users...
              </h4>
              <p className="text-slate-600">
                Please wait while we fetch your user data.
              </p>
            </div>
          ) : users.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center text-center p-12"
              style={{ height: "450px" }}
            >
              <div className="text-6xl mb-6">👥</div>
              <h4 className="text-lg font-medium text-slate-800 mb-3">
                No users found
              </h4>
              <p className="text-slate-600">
                Get started by creating your first user account.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto" style={{ minHeight: "500px" }}>
              <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-emerald-50">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="border border-gray-200 px-3 py-3 text-left text-sm font-semibold text-white cursor-pointer transition-colors bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                          style={{ width: header.getSize() }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center space-x-2">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() && (
                              <span className="text-emerald-600">
                                {header.column.getIsSorted() === "desc"
                                  ? "↓"
                                  : "↑"}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-emerald-50 transition-colors`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="border border-gray-200 px-3 py-3 text-sm"
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Fill remaining space if there are few users */}
                  {users.length < 8 &&
                    Array.from({ length: 8 - users.length }).map((_, index) => (
                      <tr key={`empty-${index}`} className="bg-white">
                        <td
                          className="border border-gray-200 px-3 py-3 text-sm"
                          colSpan={5}
                        >
                          <div style={{ height: "41px" }}></div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {users.length > 0 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0); // Reset to first page when changing page size
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300"
                >
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-700">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>

                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300"
                >
                  Next
                </button>
              </div>

              <div className="text-sm text-gray-700">
                Showing {table.getRowModel().rows.length} of {users.length}{" "}
                results
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Registration/Edit Modal */}
      {showRegistrationModal &&
        createPortal(
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 ease-in-out modal-backdrop ${
              isClosing ? "closing" : ""
            }`}
            style={{ zIndex: 99999 }}
            onClick={closeModal}
          >
            <div
              className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col transform transition-all duration-300 ease-out modal-content ${
                isClosing ? "closing" : ""
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  {selectedUser ? (
                    <>
                      <Edit className="w-6 h-6 text-emerald-600" />
                      Edit User
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-6 h-6 text-emerald-600" />
                      Create New User
                    </>
                  )}
                </h3>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {/* Error Display - Removed, replaced by Snackbar notifications */}

                  {/* Email and Password - Side by Side */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300"
                        placeholder="Enter user email"
                        disabled={!!selectedUser} // Disable email editing for existing users
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Password {selectedUser ? "" : "*"}
                      </label>
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300"
                        placeholder={
                          selectedUser
                            ? "Leave blank to keep current password"
                            : "Enter password"
                        }
                      />
                      {selectedUser && (
                        <p className="text-xs text-gray-500 mt-1">
                          Leave blank to keep the current password
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Role and Designation - Side by Side */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Role
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) =>
                          setNewUser({ ...newUser, role: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300"
                      >
                        <option value="">Select a role</option>
                        <option value="administrator">Administrator</option>
                        <option value="teacher">Teacher</option>
                        <option value="nurse">Nurse</option>
                        <option value="doctor">Doctor</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Designation
                      </label>
                      <select
                        value={newUser.designation}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            designation: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300"
                      >
                        <option value="">Select designation</option>
                        <option value="SDO - Imus City">SDO - Imus City</option>
                        <option value="School - Imus City">
                          School - Imus City
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* School ID, Office ID, and Position ID - Stacked */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        School ID
                      </label>
                      <input
                        type="number"
                        value={newUser.schoolId}
                        onChange={(e) =>
                          setNewUser({ ...newUser, schoolId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300"
                        placeholder="School ID (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Office ID
                      </label>
                      <input
                        type="number"
                        value={newUser.officeId}
                        onChange={(e) =>
                          setNewUser({ ...newUser, officeId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300"
                        placeholder="Office ID (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Position ID
                      </label>
                      <input
                        type="number"
                        value={newUser.positionId}
                        onChange={(e) =>
                          setNewUser({ ...newUser, positionId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300"
                        placeholder="Position ID (optional)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex-shrink-0 p-6 border-t border-gray-200 flex justify-between">
                <div>
                  {selectedUser && (
                    <button
                      onClick={() => handleDeleteUser(selectedUser.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      Delete User
                    </button>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      selectedUser ? handleUpdateUser : handleRegisterUser
                    }
                    disabled={
                      isLoading ||
                      (!selectedUser && !newUser.email) ||
                      (!selectedUser && !newUser.password)
                    }
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer"
                  >
                    {isLoading
                      ? "Processing..."
                      : selectedUser
                      ? "Update User"
                      : "Create User"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
      />
    </div>
  );
};

export default UsersManagement;

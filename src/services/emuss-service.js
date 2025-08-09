// Base API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} API response
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Dashboard services
export const getDashboardStats = () => apiRequest("/dashboard/stats");
export const getRecentActivity = () => apiRequest("/dashboard/activity");
export const getTodayOverview = () => apiRequest("/dashboard/today");

// Consultation services
export const getConsultations = () => apiRequest("/consultations");
export const getConsultationById = (id) => apiRequest(`/consultations/${id}`);
export const createConsultation = (data) =>
  apiRequest("/consultations", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateConsultation = (id, data) =>
  apiRequest(`/consultations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteConsultation = (id) =>
  apiRequest(`/consultations/${id}`, {
    method: "DELETE",
  });

// Pre-employment services
export const getPreemploymentChecks = () => apiRequest("/preemployment");
export const getPreemploymentById = (id) => apiRequest(`/preemployment/${id}`);
export const createPreemploymentCheck = (data) =>
  apiRequest("/preemployment", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updatePreemploymentCheck = (id, data) =>
  apiRequest(`/preemployment/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deletePreemploymentCheck = (id) =>
  apiRequest(`/preemployment/${id}`, {
    method: "DELETE",
  });

// Reinstatement services
export const getReinstatementCases = () => apiRequest("/reinstatement");
export const getReinstatementById = (id) => apiRequest(`/reinstatement/${id}`);
export const createReinstatementCase = (data) =>
  apiRequest("/reinstatement", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateReinstatementCase = (id, data) =>
  apiRequest(`/reinstatement/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteReinstatementCase = (id) =>
  apiRequest(`/reinstatement/${id}`, {
    method: "DELETE",
  });

// Appointments services
export const getAppointments = () => apiRequest("/appointments");
export const getAppointmentById = (id) => apiRequest(`/appointments/${id}`);
export const createAppointment = (data) =>
  apiRequest("/appointments", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateAppointment = (id, data) =>
  apiRequest(`/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteAppointment = (id) =>
  apiRequest(`/appointments/${id}`, {
    method: "DELETE",
  });

// Medical records services
export const getMedicalRecords = () => apiRequest("/records");
export const getMedicalRecordById = (id) => apiRequest(`/records/${id}`);
export const createMedicalRecord = (data) =>
  apiRequest("/records", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateMedicalRecord = (id, data) =>
  apiRequest(`/records/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteMedicalRecord = (id) =>
  apiRequest(`/records/${id}`, {
    method: "DELETE",
  });

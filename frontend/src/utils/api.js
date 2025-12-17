import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove("token");
      Cookies.remove("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (formData) =>
    api.post("/user/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  login: (data) => api.post("/user/login", data),
  getProfile: () => api.get("/user/profile"),
  checkAdminExists: () => api.get("/user/check-admin"),
};

// User APIs
export const userAPI = {
  getAllBooks: () => api.get("/user/allBooks"),
  getBook: (id) => api.get(`/user/book/${id}`),
  addToCart: (data) => api.post("/user/cart", data),
  getCart: () => api.get("/user/cart"),
  updateCartItem: (bookId, data) => api.put(`/user/cart/${bookId}`, data),
  removeFromCart: (bookId) => api.delete(`/user/cart/${bookId}`),
  clearCart: () => api.delete("/user/cart"),
  placeOrder: () => api.post("/user/order"),
  placeManualOrder: (data) => api.post("/user/order/manual", data),
  getOrders: () => api.get("/user/orders"),
  getOrder: (id) => api.get(`/user/orders/${id}`),
};

// Admin APIs
export const adminAPI = {
  addBook: (formData) =>
    api.post("/admin/addBook", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateBook: (id, formData) =>
    api.post(`/admin/updateBook/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteBook: (id) => api.delete(`/admin/deleteBook/${id}`),
  getAllBooks: () => api.get("/admin/allBooks"),
  getAllOrders: () => api.get("/admin/orders"),
  getOrder: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}`, data),

  // Complaint management
  getAllComplaints: (params) => api.get("/admin/complaints", { params }),
  getComplaintStats: () => api.get("/admin/complaints/stats"),
  getComplaint: (id) => api.get(`/admin/complaint/${id}`),
  updateComplaint: (id, data) => api.put(`/admin/complaint/${id}`, data),
  deleteComplaint: (id) => api.delete(`/admin/complaint/${id}`),
};

// Complaint APIs for users
export const complaintAPI = {
  submitComplaint: (data) => api.post("/user/complaint", data),
  getUserComplaints: () => api.get("/user/complaints"),
  getUserComplaint: (id) => api.get(`/user/complaint/${id}`),
};

export default api;

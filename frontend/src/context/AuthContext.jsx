import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { authAPI } from "../utils/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("token");
      const userData = Cookies.get("user");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Verify token is still valid
          await authAPI.getProfile();
        } catch (error) {
          console.error("Auth initialization error:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user: userData, token } = response.data;

      // Store in cookies
      Cookies.set("token", token, { expires: 7 }); // 7 days
      Cookies.set("user", JSON.stringify(userData), { expires: 7 });

      setUser(userData);
      setIsAuthenticated(true);

      toast.success("Login successful!");
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (formData) => {
    try {
      const response = await authAPI.register(formData);
      const { user: userData, token } = response.data;

      // Store in cookies
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(userData), { expires: 7 });

      setUser(userData);
      setIsAuthenticated(true);

      toast.success("Registration successful!");
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      const errorType = error.response?.data?.error;

      // Handle specific admin exists error
      if (errorType === "ADMIN_EXISTS") {
        toast.error(
          "Admin already exists! Only one admin is allowed in the system."
        );
      } else {
        toast.error(message);
      }

      return { success: false, message, errorType };
    }
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    setIsAuthenticated(false);
    toast.info("Logged out successfully");
  };

  const updateUser = (userData) => {
    setUser(userData);
    Cookies.set("user", JSON.stringify(userData), { expires: 7 });
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

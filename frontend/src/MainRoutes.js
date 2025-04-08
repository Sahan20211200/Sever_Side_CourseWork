import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import UserDashboard from "./components/Dashboard/UserDash/UserDash";
import AdminDashboard from "./components/Dashboard/AdminDash/AdminDash";
import { isTokenExpired } from "./utils/auth";
import { refreshToken } from "./utils/token";

const PrivateRoute = ({ children }) => {
  const username = localStorage.getItem("username");
  return username ? children : <Navigate to="/login" />;
};

const MainRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicPaths = ["/login", "/register"];
    
    // Skip refresh check for public routes
    if (publicPaths.includes(location.pathname)) return;

    if (isTokenExpired()) {
      refreshToken()
        .catch(() => {
          localStorage.clear();
          navigate("/register");
        });
    }
  }, [navigate, location.pathname]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/user-dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
      <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default MainRoutes;

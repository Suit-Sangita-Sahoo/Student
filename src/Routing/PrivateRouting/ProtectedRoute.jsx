import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authtoken"); 

  if (!token) {
    
    return <Navigate to="/login" replace />;
  }

  // ✅ render the child page
  return children;
};

export default ProtectedRoute;

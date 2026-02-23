import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleHome = {
  admin:    "/admin/dashboard",
  employee: "/employee/projects",
  client:   "/client/services",
};

// Requires user to be logged in AND have the correct role
export const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== role) return <Navigate to={roleHome[user.role] || "/login"} replace />;

  return children;
};

// Only for guests — logged in users get redirected to their home
export const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) return <Navigate to={roleHome[user.role] || "/login"} replace />;

  return children;
};
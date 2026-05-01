import { Navigate } from "react-router-dom";

// role prop is optional — if passed, also checks role match
const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (role && userRole !== role) {
    // Redirect to correct dashboard if wrong role
    return <Navigate to={userRole === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return children;
};

export default PrivateRoute;

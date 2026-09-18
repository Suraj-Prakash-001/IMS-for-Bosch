import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, isAdmin, isCustomer, isManager } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === "Admin" && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  if (role === "Manager" && !isManager) {
    return <Navigate to="/home" replace />;
  }

  if (role === "Customer" && !isCustomer) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
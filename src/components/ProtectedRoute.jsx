import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../services/SnackBar";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");
  const { showSnackBar } = useSnackbar();

  useEffect(() => {
    if (role && allowedRoles.includes(role)) {
      // If the role is allowed, show the content
      return;
    } else if (role === "Admin" || role === "Staff") {
      // If the user is Admin or Staff but trying to access the other's route, show a warning
      showSnackBar(
        `You do not have permission to access this route`,
        "warning"
      );
    } else {
      // If the user is neither Admin nor Staff, redirect to login and remove role from sessionStorage
      showSnackBar(`You do not have the permission`, "error");
      sessionStorage.removeItem("role");
      navigate("/login");
    }
  }, [role, allowedRoles, navigate, showSnackBar]);

  return allowedRoles.includes(role) ? children : null;
};

export default ProtectedRoute;

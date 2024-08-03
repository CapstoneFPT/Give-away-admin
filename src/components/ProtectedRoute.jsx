import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../services/SnackBar";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");
  const { showSnackBar } = useSnackbar();
  useEffect(() => {
    if (!role || !allowedRoles.includes(role)) {
      showSnackBar(`You do not have the permission`, "error");
      navigate("/login");
      sessionStorage.removeItem("role");
    }
  }, [role, allowedRoles, navigate, showSnackBar]);

  return allowedRoles.includes(role) ? children : null;
};

export default ProtectedRoute;

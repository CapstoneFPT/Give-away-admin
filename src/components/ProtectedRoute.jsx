import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!role || !allowedRoles.includes(role)) {
      alert("You do not have the permission");
      navigate("/login");
      localStorage.removeItem("role");
    }
  }, [role, allowedRoles, navigate]);

  return allowedRoles.includes(role) ? children : null;
};

export default ProtectedRoute;

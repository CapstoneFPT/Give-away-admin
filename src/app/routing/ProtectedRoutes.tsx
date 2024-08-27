import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth";
import {Roles} from "../../api";

interface ProtectedRouteProps {
  roles: Roles[];
  children: ReactNode; // Ensure children is typed correctly
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  if (!roles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" />; // You can redirect to an unauthorized page
  }

  return <>{children}</>;
};

export default ProtectedRoute;

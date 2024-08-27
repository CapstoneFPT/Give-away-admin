import { FC } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { ErrorsPage } from "../modules/errors/ErrorsPage";
import { Logout, AuthPage, useAuth } from "../modules/auth";
import { App } from "../App";
import ProtectedRoute from "./ProtectedRoutes"; // Import the ProtectedRoute component
import ProductPage from "../";
const { BASE_URL } = import.meta.env;

const AppRoutes: FC = () => {
  const { currentUser } = useAuth(); // Get the current user

  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>
          {/* Error handling and logout routes */}
          <Route path="error/*" element={<ErrorsPage />} />
          <Route path="logout" element={<Logout />} />

          {currentUser ? (
            <>
              {/* Private routes for authenticated users */}
              <Route path="/*" element={<PrivateRoutes />} />
              <Route index element={<Navigate to="/dashboard" />} />

              {/* Example of a protected route with specific roles */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute roles={["Admin"]}>
                    <ProductPage />
                    {/* Replace with your actual component */}
                  </ProtectedRoute>
                }
              />
            </>
          ) : (
            <>
              {/* Authentication routes */}
              <Route path="auth/*" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/auth" />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };

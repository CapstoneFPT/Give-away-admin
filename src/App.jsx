import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import AdminSideBar from "./scenes/global/AdminSideBar";
import StaffSideBar from "./scenes/global/StaffSideBar.jsx";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ItemsManagement from "./scenes/items/ItemsManagement.jsx";
import Login from "./scenes/login/login";
import ProtectedRoute from "./components/ProtectedRoute";
import AccountManagement from "./scenes/accounts/AccountsManagement.jsx";
import AccountDetail from "./scenes/accounts/AccountDetail";
import ConsignManagement from "./scenes/consigns/ConsignManagement.jsx";
import ConsignDetail from "./scenes/consigns/ConsignDetail";
import OrderManagement from "./scenes/orders/OrdersManagement.jsx";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPath = location.pathname === "/login";
  const role = localStorage.getItem("role");

  useEffect(() => {
    const shopId = localStorage.getItem("shopId");
    if (role && shopId && isLoginPath) {
      // User is logged in and on login page, navigate to home
      navigate("/home");
    }
  }, [navigate, isLoginPath, role]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          className="app"
          style={{
            display: "flex",
            minHeight: "100vh",
          }}
        >
          {!isLoginPath &&
            (role === "Admin" ? (
              <AdminSideBar isSidebar={isSidebar} />
            ) : (
              <StaffSideBar isSidebar={isSidebar} />
            ))}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {!isLoginPath && <Topbar setIsSidebar={setIsSidebar} />}
            <main style={{ flex: 1, padding: isLoginPath ? 0 : "20px" }}>
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/order-staff"
                  element={
                    <ProtectedRoute allowedRoles={["Staff"]}>
                      <OrderManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consign/"
                  element={
                    <ProtectedRoute allowedRoles={["Staff"]}>
                      <ConsignManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consign/:consignSaleCode"
                  element={
                    <ProtectedRoute allowedRoles={["Staff"]}>
                      <ConsignDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-accounts/:accountId"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <AccountDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-accounts"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <AccountManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-items"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
                      <ItemsManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <Team />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

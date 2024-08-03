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
import OrderDetail from "./scenes/orders/OrderDetail.jsx";
import CreateOrder from "./components/CreateOrder.jsx";
import RefundManagement from "./scenes/refunds/RefundManagement.jsx";
import AuctionManagement from "./scenes/auctions/AuctionsManagement.jsx";
import { SnackbarProvider } from "./services/SnackBar.jsx";
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPath = location.pathname === "/login";
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const shopId = sessionStorage.getItem("shopId");
    if (role && shopId && isLoginPath) {
      // User is logged in and on login page, navigate to home
      navigate("/home");
    }
  }, [navigate, isLoginPath, role]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div
            className="app"
            style={{
              display: "flex",
              minHeight: "100vh",
              height: "100vh",
              overflow: "hidden",
              backgroundColor: "#f4f6f8", // Light background for better contrast
            }}
          >
            {!isLoginPath &&
              (role === "Admin" ? (
                <AdminSideBar
                  isSidebar={isSidebar}
                  style={{
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    borderRight: "1px solid #e0e0e0", // Border to separate sidebar from content
                  }}
                />
              ) : (
                <StaffSideBar
                  isSidebar={isSidebar}
                  style={{
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    borderRight: "50px solid #e0e0e0", // Border to separate sidebar from content
                  }}
                />
              ))}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                backgroundColor: "#fff", // White background for content
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Shadow for main content area
                borderRadius: "8px",
              }}
            >
              {!isLoginPath && (
                <Topbar
                  setIsSidebar={setIsSidebar}
                  style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                />
              )}
              <main
                style={{
                  flex: 1,
                  padding: isLoginPath ? 0 : "20px",
                  overflow: "auto",
                  backgroundColor: "#fff", // Ensure consistent background color
                }}
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/auction"
                    element={
                      <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
                        <AuctionManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/refund"
                    element={
                      <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
                        <RefundManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order/create-order"
                    element={
                      <ProtectedRoute allowedRoles={["Staff"]}>
                        <CreateOrder />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order/:orderId"
                    element={
                      <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
                        <OrderDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order"
                    element={
                      <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
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
                    path="/consign/:consignSaleId"
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
      </SnackbarProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

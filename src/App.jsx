import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ItemsManagement from "./components/ItemsManagement";
import Login from "./scenes/login/login";
import { Navigate, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AccountManagement from "./components/AccountsManagement";
import AccountDetail from "./scenes/accounts/AccountDetail";
import ConsignManagement from "./components/ConsignManagement";
import ConsignDetail from "./scenes/consigns/ConsignDetail";
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPath = location.pathname === "/login";
  useEffect(() => {
    const role = localStorage.getItem("role");
    const shopId = localStorage.getItem("shopId");
    if (role && shopId && isLoginPath) {
      // User is logged in and on login page, navigate to home
      navigate("/home");
    }
  }, [navigate, isLoginPath]);
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
          {!isLoginPath && <Sidebar isSidebar={isSidebar} />}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {!isLoginPath && <Topbar setIsSidebar={setIsSidebar} />}
            <main style={{ flex: 1, padding: isLoginPath ? 0 : "20px" }}>
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/consign/"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
                      <ConsignManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consign/:consignSaleCode"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
                      <ConsignDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-accounts/:accountId"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
                      <AccountDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-accounts"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
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
              {/* <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/home" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/form" element={<Form />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/geography" element={<Geography />} />
                <Route path="/login" element={<Login />} />
              </Routes> */}
            </main>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

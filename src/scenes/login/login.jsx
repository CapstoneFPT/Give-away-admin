import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CssBaseline,
  Paper,
} from "@mui/material";
import ApiService from "../../services/apiServices";
import { useSnackbar } from "../../services/SnackBar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  useEffect(() => {
    const role = sessionStorage.getItem("role");

    if (role && (role === "Admin" || role === "Staff")) {
      navigate("/home");
    } else {
      sessionStorage.removeItem("role");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = await ApiService.authLogin(email, password);
      const shopId = data.data.shopId;
      const role = data.data.role;
      const id = data.data.id;

      // Check if the role is admin or staff
      if (role !== "Admin" && role !== "Staff") {
        setError("Only admin and staff roles are allowed");
        throw new Error("Unauthorized access");
      }
      sessionStorage.setItem("shopId", shopId);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("userId", id);

      showSnackbar(`Login successful`, `success`);
      navigate("/home");
    } catch (error) {
      showSnackbar(`Login fail `, `error`);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Welcome to Give Away Admin Dashboard
            </Typography>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Typography color="error" variant="body2" align="center">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;

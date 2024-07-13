import { Box, IconButton, useTheme, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useNavigate } from "react-router-dom";
import React from "react";

const Topbar = ({ onSearch }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  console.log(colors);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (path) => {
    setAnchorEl(null);
    if (path) {
      navigate(path);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("shopId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "light" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>

        <IconButton onClick={handleClick}>
          <PersonOutlinedIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleClose(null)}
        >
          <MenuItem onClick={() => handleClose("/profile")}>Profile</MenuItem>
          <MenuItem onClick={() => handleClose("/my-account")}>
            My account
          </MenuItem>
          <MenuItem onClick={handleLogOut}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;

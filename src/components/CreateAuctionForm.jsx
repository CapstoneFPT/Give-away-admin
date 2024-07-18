// src/components/AuctionForm.jsx
import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const AuctionForm = ({ open, onClose, onSubmit, item }) => {
  const shopId = localStorage.getItem("shopId");
  const [auctionData, setAuctionData] = useState({
    title: "",
    scheduleDate: "",
    timeslotId: "",
    stepIncrementPercentage: 0,
    depositFee: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "stepIncrementPercentage" && value > 100) {
      return; // Limit to 100
    }
    setAuctionData({
      ...auctionData,
      [name]: name === "stepIncrementPercentage" ? Math.min(value, 100) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...auctionData,
      shopId,
      auctionItemId: item.itemId,
    });
    console.log(item.itemId);
  };

  const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Create Auction
        </Typography>
        <TextField
          name="title"
          label="Title"
          fullWidth
          margin="normal"
          value={auctionData.title}
          onChange={handleChange}
        />
        <TextField
          name="scheduleDate"
          label="Schedule Date"
          type="date"
          fullWidth
          margin="normal"
          value={auctionData.scheduleDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: today, // Đặt ngày tối thiểu là ngày hiện tại
          }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Timeslot</InputLabel>
          <Select
            name="timeslotId"
            value={auctionData.timeslotId}
            onChange={handleChange}
          >
            <MenuItem value="8223103b-8bf5-7804-f63b-32d845d948f4">
              Timeslot 1
            </MenuItem>
            <MenuItem value="8223103b-8bf5-7804-f63b-32d845d948f4">
              Timeslot 2
            </MenuItem>
            <MenuItem value="8223103b-8bf5-7804-f63b-32d845d948f4">
              Timeslot 3
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          name="stepIncrementPercentage"
          label="Step Increment Percentage"
          type="number"
          fullWidth
          margin="normal"
          value={auctionData.stepIncrementPercentage}
          onChange={handleChange}
        />
        <TextField
          name="depositFee"
          label="Deposit Fee"
          type="number"
          fullWidth
          margin="normal"
          value={auctionData.depositFee}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default AuctionForm;

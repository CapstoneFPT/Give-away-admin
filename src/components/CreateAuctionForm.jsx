// src/components/AuctionForm.jsx
import React, { useState } from "react";
import { Modal, Box, Button, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers";

const AuctionForm = ({ open, onClose, onSubmit, item }) => {
  const shopId = sessionStorage.getItem("shopId");
  const [auctionData, setAuctionData] = useState({
    title: "",
    scheduleDate: "",
    startTime: null,
    endTime: null,
    stepIncrementPercentage: 0,
    depositFee: 0,
    shopId,
  });

  console.log(auctionData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "stepIncrementPercentage" && value > 100) {
      return;
    }
    setAuctionData({
      ...auctionData,
      [name]: name === "stepIncrementPercentage" ? Math.min(value, 100) : value,
    });
  };

  const handleDateTimeChange = (name) => (date) => {
    setAuctionData({
      ...auctionData,
      [name]: date,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...auctionData,
      auctionItemId: item.itemId,
    });
  };

  const today = new Date();
  console.log(today);
  const minDateTime = today.toISOString().split(".")[0]; // Current time in ISO format

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
          borderRadius: 2, // Add rounded corners
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
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
            min: today.toISOString().split("T")[0],
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Start Time"
            value={auctionData.startTime}
            onChange={handleDateTimeChange("startTime")}
            minDateTime={minDateTime}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                InputProps={{
                  style: { borderRadius: 4, backgroundColor: "#f5f5f5" }, // Add background color and rounded corners
                }}
              />
            )}
          />
          <DateTimePicker
            label="End Time"
            value={auctionData.endTime}
            onChange={handleDateTimeChange("endTime")}
            minDateTime={minDateTime}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                InputProps={{
                  style: { borderRadius: 4, backgroundColor: "#f5f5f5" }, // Add background color and rounded corners
                }}
              />
            )}
          />
        </LocalizationProvider>
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

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import ApiService from "../../services/apiServices"; // Ensure the path is correct

const formatCurrency = (value) => {
  if (typeof value !== "number") return value;
  return value.toLocaleString("vn-VN", { style: "currency", currency: "VND" });
};

const RefundManagement = () => {
  const [refunds, setRefunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today
  console.log(refunds);
  const shopId = localStorage.getItem("shopId");

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const formattedDate = selectedDate.toISOString(); // Format date to ISO string
        const data = await ApiService.getRefundByShopId(shopId, formattedDate);
        setRefunds(data.data.items);
      } catch (error) {
        console.error("Failed to fetch refunds:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRefunds();
  }, [shopId, selectedDate]);

  const handleViewRefund = (refund) => {
    setSelectedRefund(refund);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRefund(null);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Refund Management
      </Typography>
      <Box mb={2}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Date to filter"
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Refund ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Order Detail ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refunds.map((refund) => (
              <TableRow key={refund.refundId}>
                <TableCell>{refund.refundId}</TableCell>
                <TableCell>{refund.description}</TableCell>
                <TableCell>
                  {new Date(refund.createdDate).toLocaleString()}
                </TableCell>
                <TableCell>{refund.orderDetailId}</TableCell>
                <TableCell>{refund.refundStatus}</TableCell>
                <TableCell>
                  {formatCurrency(refund.orderDetailsResponse.unitPrice)}
                </TableCell>{" "}
                {/* Format amount */}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewRefund(refund)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Refund Details</DialogTitle>
        <DialogContent>
          {selectedRefund && (
            <Box>
              <Typography variant="h6">
                Refund ID: {selectedRefund.refundId}
              </Typography>
              <Typography>Description: {selectedRefund.description}</Typography>
              <Typography>
                Created Date:{" "}
                {new Date(selectedRefund.createdDate).toLocaleString()}
              </Typography>
              <Typography>
                Order Detail ID: {selectedRefund.orderDetailId}
              </Typography>
              <Typography>Status: {selectedRefund.refundStatus}</Typography>
              <Typography>
                Refund Expiration Date:{" "}
                {new Date(
                  selectedRefund.orderDetailsResponse.refundExpirationDate
                ).toLocaleString()}
              </Typography>
              <Typography>
                Item Name: {selectedRefund.orderDetailsResponse.itemName}
              </Typography>
              <Typography>
                Amount:{" "}
                {formatCurrency(selectedRefund.orderDetailsResponse.unitPrice)}
              </Typography>
              {selectedRefund.images.length > 0 && (
                <Box mt={2}>
                  <Typography>Images:</Typography>
                  {selectedRefund.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Refund ${index}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        marginRight: 10,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RefundManagement;

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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import ApiService from "../../services/apiServices"; // Ensure the path is correct
import { useSnackbar } from "../../services/SnackBar";

const formatCurrency = (value) => {
  if (typeof value !== "number") return value;
  return value.toLocaleString("vn-VN", { style: "currency", currency: "VND" });
};

const RefundManagement = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [refunds, setRefunds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today
  const [refundStatus, setRefundStatus] = useState("");
  const [description, setDescription] = useState("");
  const [refundPercentage, setRefundPercentage] = useState(0);
  const [isRejecting, setIsRejecting] = useState(false);
  const shopId = sessionStorage.getItem("shopId");
  const userRole = sessionStorage.getItem("role");
  const { showSnackBar } = useSnackbar();
  useEffect(() => {
    const fetchRefunds = async () => {
      setIsLoading(true); // Set loading state
      try {
        const formattedDate = selectedDate.toISOString(); // Format date to ISO string
        let data;

        if (userRole === "Admin") {
          data = await ApiService.getAllRefunds(formattedDate);
        } else {
          data = await ApiService.getRefundByShopId(shopId, formattedDate);
        }

        setRefunds(data.data.items);
      } catch (error) {
        console.error("Failed to fetch refunds:", error);
      } finally {
        setIsLoading(false); // Reset loading state
      }
    };

    fetchRefunds();
  }, [shopId, selectedDate, userRole]);

  const handleViewRefund = (refund) => {
    setSelectedRefund(refund);
    setRefundStatus(refund.refundStatus); // Set initial status
    setDescription(""); // Clear description
    setRefundPercentage(refund.refundPercentage || 0); // Set refund percentage or default to 0
    setIsRejecting(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRefund(null);
  };

  const handleUpdateRefundStatus = async () => {
    if (
      refundStatus === "Approved" &&
      (refundPercentage < 0 || refundPercentage > 100)
    ) {
      showSnackBar(`Refund percentage must be between 0 and 100`, `info`);
      return;
    }

    if (refundStatus === "Rejected" && description.trim() === "") {
      showSnackBar(`Description is required for rejection.`, `info`);
      return;
    }

    try {
      const refundData = {
        status: refundStatus,
        refundPercentage: refundStatus === "Approved" ? refundPercentage : 0,
        description: refundStatus === "Rejected" ? description : "",
      };

      await ApiService.updateRefundStatus(selectedRefund.refundId, refundData);
      showSnackBar(`Refund status updated successfully.`, `success`);
      handleCloseDialog();
      navigate("/refund"); // Redirect to /refund page after update
    } catch (error) {
      showSnackBar(`Failed to update refund status: ${error.message}`, `error`);
    }
  };

  const handleConfirmRefund = async () => {
    try {
      await ApiService.confirmRefundStatus(selectedRefund.refundId);
      showSnackBar("Refund delivery confirmed.", `success`);
      handleCloseDialog();
      navigate("/refund"); // Redirect to /refund page after confirmation
    } catch (error) {
      showSnackBar(
        `Failed to confirm refund delivery: ${error.message}`,
        `error`
      );
    }
  };

  const handleRejectRefund = async () => {
    if (description.trim() === "") {
      showSnackBar(`Description is required for rejection.`, `info`);
      return;
    }

    try {
      await ApiService.updateRefundStatus(selectedRefund.refundId, {
        status: "Rejected",
        description,
      });
      showSnackBar(`Refund rejected successfully.`, `success`);
      handleCloseDialog();
      navigate("/refund"); // Redirect to /refund page after rejection
    } catch (error) {
      showSnackBar(`Failed to reject refund: ${error.message}`, `error`);
    }
  };

  const handleRequestRefund = () => {
    showSnackBar(
      `Refund request functionality will be implemented here.`,
      `info`
    );
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography
        component="h1"
        variant="h1"
        align="center"
        sx={{ mb: 5 }}
        fontWeight={"bold"}
      >
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
      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : refunds.length === 0 ? (
        <Box>
          <Typography variant="h6">No refunds available</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRequestRefund}
          >
            Request Refund
          </Button>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <h2>Refund ID</h2>
                </TableCell>
                <TableCell>
                  <h2>Description</h2>
                </TableCell>
                <TableCell>
                  <h2>Created Date</h2>
                </TableCell>
                <TableCell>
                  <h2>Order Detail ID</h2>
                </TableCell>
                <TableCell>
                  <h2>Status</h2>
                </TableCell>
                <TableCell>
                  <h2>Amount</h2>
                </TableCell>
                <TableCell>
                  <h2>Actions</h2>
                </TableCell>
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
                  </TableCell>
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
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Refund Details</DialogTitle>
        <DialogContent>
          {selectedRefund && (
            <Box>
              {/* Display Refund Details */}
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
                Item Status: {selectedRefund.orderDetailsResponse.itemStatus}
              </Typography>
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

              {selectedRefund.refundStatus === "Pending" && (
                <Box mt={2}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={refundStatus}
                      onChange={(e) => {
                        const status = e.target.value;
                        setRefundStatus(status);
                        if (status === "Rejected") {
                          setRefundPercentage(0);
                        }
                      }}
                      label="Status"
                    >
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                  {refundStatus === "Approved" && (
                    <Box>
                      <TextField
                        label="Refund Percentage"
                        type="number"
                        value={refundPercentage}
                        onChange={(e) =>
                          setRefundPercentage(Number(e.target.value))
                        }
                        fullWidth
                        margin="normal"
                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                      />
                      <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                    </Box>
                  )}
                  {refundStatus === "Rejected" && (
                    <TextField
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateRefundStatus}
                    style={{ marginTop: 10 }}
                  >
                    Update Status
                  </Button>
                </Box>
              )}

              {selectedRefund.refundStatus === "Approved" && (
                <Box mt={2}>
                  {!isRejecting ? (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setIsRejecting(true)}
                        style={{ marginRight: 10 }}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirmRefund}
                      >
                        Confirm Delivery
                      </Button>
                    </>
                  ) : (
                    <Box mt={2}>
                      <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleRejectRefund}
                        style={{ marginTop: 10 }}
                      >
                        Update Status
                      </Button>
                    </Box>
                  )}
                </Box>
              )}

              {(selectedRefund.refundStatus === "Completed" ||
                selectedRefund.refundStatus === "Rejected") && (
                <Box mt={2}>
                  <Typography>
                    No actions available for this refund status.
                  </Typography>
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

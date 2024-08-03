import React, { useState } from "react";
import { useCart } from "../../../services/context";
import ApiService from "../../../services/apiServices";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../../services/SnackBar";

const Step3 = ({ prevStep }) => {
  const { cartItems, customerInfo, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [amountGiven, setAmountGiven] = useState("");
  const [change, setChange] = useState(null);
  const { showSnackBar } = useSnackbar();
  const [orderId, setOrderId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  console.log(cartItems);
  const handleBack = () => {
    clearCart();
    prevStep();
  };

  const handleCreateOrder = async () => {
    const shopId = sessionStorage.getItem("shopId");
    const orderData = {
      address: customerInfo.address || "",
      recipientName: customerInfo.fullname,
      phone: customerInfo.phone,
      email: customerInfo.email,
      itemIds: cartItems.map((item) => item.itemId),
    };
    console.log(shopId);
    console.log(orderData);
    try {
      setIsLoading(true);

      const orderResponse = await ApiService.createOrderbyStaff(
        shopId,
        orderData
      );
      setOrderId(orderResponse.data.orderId);
      setOpenModal(true);
    } catch (error) {
      showSnackBar(`Failed to create order:  + ${error.message}`, `error`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!orderId) {
      showSnackBar(`No order ID found. Please create an order first.`, `error`);
      return;
    }

    const shopId = sessionStorage.getItem("shopId");
    const totalAmount = getTotalPrice();
    const amountGivenFormatted = parseFloat(amountGiven.replace(/\./g, ""));

    if (amountGivenFormatted < totalAmount) {
      showSnackBar(`Not enough money provided.`, `error`);
      return;
    }

    try {
      setIsLoading(true);

      const checkoutResponse = await ApiService.checkOutWithCash(
        shopId,
        orderId,
        { amountGiven: amountGivenFormatted }
      );

      const changeAmount = checkoutResponse.change;
      setChange(changeAmount);
      setOpenModal(false);
      navigate("/order");
      showSnackBar(
        `Checked out successfully! Change:  +
          ${formatCurrency(changeAmount.toString())}`,
        `info`
      );
      clearCart();
    } catch (error) {
      if (error.response && error.response.data.detail === "not enough money") {
        showSnackBar(`Not enough money provided.`, `error`);
      } else {
        showSnackBar(
          `Failed to complete checkout:  + ${error.message}`,
          `error`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.sellingPrice, 0);
  };

  const formatCurrency = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <Box sx={{ mt: 4, mb: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Review Order
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography>Name: {customerInfo.fullname}</Typography>
        <Typography>Phone: {customerInfo.phone}</Typography>
        <Typography>Email: {customerInfo.email}</Typography>
        <Typography>Address: {customerInfo.address}</Typography>
      </Box>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.itemId}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>
                      {formatCurrency(item.sellingPrice.toString())}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Typography variant="h6">
              Total Price: {formatCurrency(getTotalPrice().toString())}
            </Typography>
          </Box>
          {!orderId ? (
            <Box sx={{ mt: 2, textAlign: "right" }}>
              <Button
                variant="contained"
                onClick={handleCreateOrder}
                disabled={isLoading}
              >
                Create Order
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ mt: 2, textAlign: "right" }}>
                <TextField
                  label="Amount Given"
                  value={formatCurrency(amountGiven)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\./g, "");
                    setAmountGiven(value);
                  }}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₫</InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Button
                  variant="contained"
                  onClick={handleCheckOut}
                  disabled={isLoading}
                >
                  Checkout
                </Button>
              </Box>
            </>
          )}
          {change !== null && (
            <Box sx={{ mt: 2, textAlign: "right" }}>
              <Typography variant="h6">
                Change: {formatCurrency(change.toString())}
              </Typography>
            </Box>
          )}
        </>
      )}
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          sx={{ mr: 1 }}
          disabled={isLoading}
        >
          Back
        </Button>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Order</DialogTitle>
        <DialogContent>
          <Box>
            <Typography>Name: {customerInfo.fullname}</Typography>
            <Typography>Phone: {customerInfo.phone}</Typography>
            <Typography>Email: {customerInfo.email}</Typography>
            <Typography>Address: {customerInfo.address}</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.itemId}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.brand}</TableCell>

                    <TableCell>
                      {formatCurrency(item.sellingPrice.toString())}
                    </TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Typography variant="h6">
              Total Price: {formatCurrency(getTotalPrice().toString())} VND
            </Typography>
          </Box>
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <TextField
              label="Amount Given"
              value={formatCurrency(amountGiven)}
              onChange={(e) => {
                const value = e.target.value.replace(/\./g, "");
                setAmountGiven(value);
              }}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₫</InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCheckOut} color="primary" variant="contained">
            Checkout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Step3;

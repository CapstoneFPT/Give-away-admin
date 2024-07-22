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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Step3 = ({ prevStep }) => {
  const { cartItems, customerInfo, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleBack = () => {
    clearCart();
    prevStep();
  };

  const handleSubmit = async () => {
    const shopId = localStorage.getItem("shopId");
    const orderData = {
      paymentMethod: "Cash",
      address: customerInfo.address || "",
      fullname: customerInfo.fullname,
      phone: customerInfo.phone,
      email: customerInfo.email,
      listItemId: cartItems.map((item) => item.itemId),
    };
    console.log(orderData);
    try {
      setIsLoading(true);
      await ApiService.createOrderbyStaff(shopId, orderData);
      alert("Order created successfully");
      clearCart();
      navigate("/order-staff");
    } catch (error) {
      alert("Failed to create order: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.sellingPrice, 0);
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
                    <TableCell>{item.sellingPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Typography variant="h6">Total Price: {getTotalPrice()}</Typography>
          </Box>
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
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default Step3;

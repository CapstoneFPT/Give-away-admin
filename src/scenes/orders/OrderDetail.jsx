import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import ApiService from "../../services/apiServices";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const shopId = localStorage.getItem("shopId");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await ApiService.getOrderDetailbyShopId(
          orderId,
          shopId
        );
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, shopId]);

  const calculateTotalPrice = () => {
    if (!orderDetails || !orderDetails.items) {
      return 0;
    }
    return orderDetails.items.reduce(
      (total, item) => total + item.unitPrice,
      0
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE").format(price);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!orderDetails || !orderDetails.items || orderDetails.items.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>No order details found.</Typography>
      </Box>
    );
  }

  const totalPrice = calculateTotalPrice();

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Information
        </Typography>
        <Typography>
          <strong>Order ID:</strong> {orderDetails.items[0].orderId}
        </Typography>
        <Typography>
          <strong>Shop ID:</strong>{" "}
          {orderDetails.items[0].fashionItemDetail.shopId}
        </Typography>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Items
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {orderDetails.items.map((detail) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={detail.orderDetailId}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6">
                {detail.fashionItemDetail.name}
              </Typography>
              <Typography>
                <strong>Price:</strong> {formatPrice(detail.unitPrice)} VND
              </Typography>
              <Typography>
                <strong>Size:</strong> {detail.fashionItemDetail.size}
              </Typography>
              <Typography>
                <strong>Color:</strong> {detail.fashionItemDetail.color}
              </Typography>
              <Typography>
                <strong>Brand:</strong> {detail.fashionItemDetail.brand}
              </Typography>
              <Typography>
                <strong>Status:</strong> {detail.fashionItemDetail.status}
              </Typography>
              <Typography>
                <strong>Condition:</strong> {detail.fashionItemDetail.condition}
              </Typography>
              <Typography>
                <strong>Note:</strong> {detail.fashionItemDetail.note}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6">
          <strong>Total Price: {formatPrice(totalPrice)} VND</strong>
        </Typography>
      </Paper>
    </Box>
  );
};

export default OrderDetail;

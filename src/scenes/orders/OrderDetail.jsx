import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import ApiService from "../../services/apiServices";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const shopId = localStorage.getItem("shopId");
  console.log(shopId);
  console.log(orderId);
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

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!orderDetails) {
    return <Typography>No order details found.</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Order Details
      </Typography>
      <List>
        {orderDetails.items.map((detail) => (
          <ListItem key={detail.orderDetailId}>
            <ListItemText
              primary={detail.fashionItemDetail.name}
              secondary={
                <>
                  <Typography component="span">
                    Price: VND{detail.unitPrice}
                  </Typography>
                  <br />
                  <Typography component="span">
                    Size: {detail.fashionItemDetail.size}
                  </Typography>
                  <br />
                  <Typography component="span">
                    Color: {detail.fashionItemDetail.color}
                  </Typography>
                  <br />
                  <Typography component="span">
                    Brand: {detail.fashionItemDetail.brand}
                  </Typography>
                  <br />
                  <Typography component="span">
                    Status: {detail.fashionItemDetail.status}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default OrderDetail;

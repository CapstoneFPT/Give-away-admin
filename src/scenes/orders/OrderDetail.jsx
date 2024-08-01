import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  Paper,
  Divider,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import ApiService from "../../services/apiServices";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const shopId = localStorage.getItem("shopId");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [purchaseType, setPurchaseType] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [status, setStatus] = useState("");

  const handleClickOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    const fetchUserDetail = async (orderCode) => {
      try {
        const response = await ApiService.getOneOrder(orderCode);
        setStatus(response.data.items[0].status);
        setUserName(response.data.items[0].customerName);
        setUserPhone(response.data.items[0].contactNumber);
        setUserAddress(response.data.items[0].address);
        setPurchaseType(response.data.items[0].purchaseType);
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOrderDetails = async () => {
      try {
        const response = await ApiService.getOrderDetailbyShopId(
          orderId,
          shopId
        );
        setOrderDetails(response.data);

        if (response.data && response.data.items.length > 0) {
          const orderCode = response.data.items[0].orderCode;
          await fetchUserDetail(orderCode);
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, shopId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const formattedDate = date.toLocaleDateString(undefined, options);
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

    return `${formattedDate} ---- ${formattedTime}`;
  };

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

  const statusStyles = {
    AwaitingPayment: {
      background: "rgba(255, 193, 7, 0.2)", // Dark yellow with opacity
      color: "#FFC107", // Dark yellow color
    },
    OnDelivery: {
      background: "rgba(255, 255, 0, 0.2)", // Yellow with opacity
      color: "#FFEB3B", // Yellow color
    },
    Completed: {
      background: "rgba(56, 142, 60, 0.2)", // Dark green with opacity
      color: "#388E3C", // Dark green color
    },
    Cancelled: {
      background: "rgba(244, 67, 54, 0.2)", // Red with opacity
      color: "#F44336", // Red color
    },
    Pending: {
      background: "rgba(76, 175, 80, 0.2)", // Light green with opacity
      color: "#4CAF50", // Light green color
    },
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
  const currentStatusStyle = statusStyles[status] || {}; // Default to empty if status is not found

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h6"
            style={{ fontSize: "30px", fontWeight: "bold" }}
          >
            Order Code: {orderDetails.items[0].orderCode}{" "}
            <Box
              sx={{
                ...currentStatusStyle,
                borderColor: "transparent",
                padding: "10px",
                borderRadius: "4px",
                borderStyle: "solid",
                borderWidth: "1px",
                display: "inline-block",
                margin: "10px",
              }}
            >
              {status}
            </Box>
          </Typography>

          <Typography>
            <strong>Date of creation:</strong>
            {formatDate(orderDetails.items[0].createdDate)}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="stretch">
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 3,
              flex: 1,
              mr: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" style={{ fontSize: "20px" }}>
              User Information
            </Typography>
            <Typography>{userName}</Typography>
            <Typography>{userPhone}</Typography>
            <Typography>{userAddress}</Typography>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 3,
              flex: 1,
              mx: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" style={{ fontSize: "20px" }}>
              Purchase Type:
            </Typography>
            <Typography>{purchaseType}</Typography>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 3,
              flex: 1,
              ml: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" style={{ fontSize: "20px" }}>
              Total:
            </Typography>
            <Typography>
              <strong>Total Price: {formatPrice(totalPrice)} VND</strong>
            </Typography>
          </Paper>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <h1>Order detail</h1>
        </Typography>
        <Typography>Total item</Typography>
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Refund Expiration</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderDetails.items.map((item, index) => (
              <TableRow
                key={index}
                onClick={() => handleClickOpen(item)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>
                  <img
                    src={item.itemImage[0]}
                    alt={item.itemName}
                    width="100"
                  />
                </TableCell>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{formatDate(item.refundExpirationDate)}</TableCell>
                <TableCell>{formatPrice(item.unitPrice)} VND</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}>
                <strong>Total</strong>
              </TableCell>

              <TableCell>
                <strong>{formatPrice(totalPrice)} VND</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <Typography sx={{ fontWeight: "bold" }}>
          Item Details <InfoOutlined sx={{ mr: 1, color: "primary.main" }} />
        </Typography>
        <DialogContent>
          {selectedItem && (
            <Box>
              <img
                src={selectedItem.itemImage[0]}
                alt={selectedItem.itemName}
                width="200"
              />
              <Typography
                style={{
                  color: "#10771A",
                  fontWeight: "bold",
                  fontSize: "30px",
                }}
              >
                Status: {selectedItem.itemStatus}
              </Typography>
              <Typography variant="h6">
                <strong>Item Name:</strong> {selectedItem.itemName}
              </Typography>

              <Typography>
                <strong>Price:</strong> {formatPrice(selectedItem.unitPrice)}{" "}
                VND
              </Typography>
              <Typography>
                <strong>Category:</strong> {selectedItem.categoryName}
              </Typography>
              <Typography>
                <strong>Size:</strong> {selectedItem.itemSize}
              </Typography>
              <Typography>
                <strong>Color:</strong> {selectedItem.itemColor}
              </Typography>
              <Typography>
                <strong>Brand:</strong> {selectedItem.itemBrand}
              </Typography>
              <Typography>
                <strong>Gender:</strong> {selectedItem.itemGender}
              </Typography>
              <Typography>
                <strong>Condition:</strong> {selectedItem.condition}%
              </Typography>
              <Typography>
                <strong>Note:</strong> {selectedItem.itemNote}
              </Typography>

              <Typography>
                <strong>Shop Address:</strong> {selectedItem.shopAddress}
              </Typography>
              <Typography>
                <strong>Created Date:</strong>{" "}
                {formatDate(selectedItem.createdDate)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetail;

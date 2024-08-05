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
import Slider from "react-slick";
import { useSnackbar } from "../../services/SnackBar";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [purchaseType, setPurchaseType] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [status, setStatus] = useState("");
  const userRole = sessionStorage.getItem("role");
  const shopId = userRole === "Admin" ? "" : sessionStorage.getItem("shopId");
  const { showSnackBar } = useSnackbar();

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
    AwaitingPayment: { background: "lightgreen", color: "#e27bb1" },
    OnDelivery: { background: "lightgreen", color: "#567de8" },
    Completed: { background: "lightgreen", color: "#388E3C" },
    Cancelled: { background: "rgba(244, 67, 54, 0.2)", color: "#F44336" },
    Pending: { background: "lightgreen", color: "#4CAF50" },
  };

  const carouselSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const handleApprovedOrder = async (orderId, orderDetailId) => {
    try {
      await ApiService.confirmOrderByStaff(orderId, orderDetailId);
      window.location.reload();

      showSnackBar("Order confirmed to delivery!", "success");
    } catch (error) {
      showSnackBar(`Failed to confirm: ${error.message}`, "error");
    }
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
  const currentStatusStyle = statusStyles[status] || {};
  console.log(selectedItem);
  console.log(orderDetails);
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
            <strong>Date of creation:</strong>{" "}
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
      {orderDetails.items[0].pointPackageId === null && (
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
                <TableCell>Type</TableCell>
                <TableCell>Price</TableCell>
                {status === "Pending" && userRole === "Staff" && (
                  <TableCell>Action</TableCell>
                )}
                <TableCell>View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <img
                      src={item.itemImage[0]}
                      alt={item.itemName}
                      width="100"
                    />
                  </TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.itemType}</TableCell>
                  <TableCell>{item.itemNote}</TableCell>
                  <TableCell>{formatPrice(item.unitPrice)} VND</TableCell>
                  {status === "Pending" && userRole === "Staff" && (
                    <TableCell>
                      <Button
                        onClick={() =>
                          handleApprovedOrder(orderId, item.orderDetailId)
                        }
                        variant="contained"
                        color="primary"
                      >
                        Approve
                      </Button>
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      onClick={() => handleClickOpen(item)}
                      variant="contained"
                      color="secondary"
                      style={{ marginLeft: "10px" }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      {orderDetails.items[0].pointPackageId !== null && (
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            <h1>Package detail</h1>
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Create date</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(item.createdDate)}</TableCell>
                  <TableCell>{formatPrice(item.unitPrice)} VND</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {selectedItem && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogContent>
            <Typography
              justifyContent={"center"}
              display={"flex"}
              fontSize={50}
              fontWeight={"bold"}
              variant="h1"
            >
              Item Details
            </Typography>
            <Typography fontSize={20} variant="subtitle1">
              <strong>Name:</strong> {selectedItem.itemName}
            </Typography>
            <Typography fontSize={20} variant="subtitle1">
              <strong>Price:</strong> {formatPrice(selectedItem.unitPrice)} VND
            </Typography>
            <Typography fontSize={20} variant="subtitle1">
              <strong>Refund Expiration</strong>
            </Typography>
            <Typography fontSize={20} variant="subtitle1"></Typography>
            <Box overflow={"hidden"} maxHeight={600}>
              <Slider {...carouselSettings}>
                {selectedItem.itemImage.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`Image ${index}`}
                      style={{ width: "100%" }}
                    />
                  </div>
                ))}
              </Slider>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default OrderDetail;

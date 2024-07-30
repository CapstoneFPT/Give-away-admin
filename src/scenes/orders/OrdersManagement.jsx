import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  InputBase,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";
import ApiService from "../../services/apiServices";
import { useNavigate } from "react-router-dom";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [shopId, setShopId] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  const fetchOrdersForStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getOrderByShopId(
        shopId,
        page + 1,
        pageSize,
        status,
        searchQuery
      );
      const data = response.data;
      if (data && data.items) {
        setOrders(data.items);
        setPage(data.pageNumber - 1);
        setPageSize(data.pageSize);
        setTotalCount(data.totalCount);
      } else {
        setOrders([]);
        setTotalCount(0);
      }
    } catch (error) {
      alert("Failed to fetch orders: " + error.message);
      setOrders([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [shopId, page, pageSize, status, searchQuery]);

  const fetchOrdersForAdmin = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getOrderByAdmin(
        page + 1,
        pageSize,
        status,
        searchQuery
      );
      const data = response.data;
      if (data && data.items) {
        setOrders(data.items);
        setPage(data.pageNumber - 1);
        setPageSize(data.pageSize);
        setTotalCount(data.totalCount);
      } else {
        setOrders([]);
        setTotalCount(0);
      }
    } catch (error) {
      alert("Failed to fetch orders: " + error.message);
      setOrders([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, status, searchQuery]);

  const getOrders = useCallback(() => {
    if (userRole === "Admin") {
      fetchOrdersForAdmin();
    } else {
      fetchOrdersForStaff();
    }
  }, [userRole, fetchOrdersForAdmin, fetchOrdersForStaff]);

  useEffect(() => {
    // Fetch the shopId and userRole from localStorage
    const id = localStorage.getItem("shopId");
    const role = localStorage.getItem("role");
    setShopId(id || "");
    setUserRole(role);
  }, []);

  useEffect(() => {
    // Ensure userRole is set before calling getOrders
    if (userRole) {
      getOrders();
    }
  }, [getOrders, userRole]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(0);
  };

  const handleDetailClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleSearchChange = debounce((event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  }, 300);

  const handleCreateOrder = () => {
    navigate("/order/create-order");
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await ApiService.cancelOrderByStaff(orderId);
      alert("Order cancelled successfully.");
      getOrders();
    } catch (error) {
      alert("Failed to cancel order: " + error.message);
    }
  };

  const handleConfirmDelivery = async (orderId) => {
    try {
      await ApiService.updateOrderByStaff(orderId);
      alert("Order confirmed as delivered successfully.");
      getOrders();
    } catch (error) {
      alert("Failed to confirm delivery: " + error.message);
    }
  };

  const renderTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <h2>Total Price</h2>
            </TableCell>
            <TableCell>
              <h2>Order Code</h2>
            </TableCell>
            <TableCell>
              <h2>Customer Name</h2>
            </TableCell>
            <TableCell>
              <h2>Recipient Name</h2>
            </TableCell>
            <TableCell>
              <h2>Status</h2>
            </TableCell>
            <TableCell>
              <h2>Payment Method</h2>
            </TableCell>
            <TableCell>
              <h2>Created Date</h2>
            </TableCell>
            <TableCell>
              <h2>Purchase Type</h2>
            </TableCell>
            <TableCell>
              <h2>Details</h2>
            </TableCell>
            <TableCell style={{ display: "flex", justifyContent: "center" }}>
              <h2>Actions</h2>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.totalPrice.toLocaleString()} VND</TableCell>
                <TableCell>{order.orderCode}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.recipientName}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>
                  {new Date(order.createdDate).toLocaleString()}
                </TableCell>
                <TableCell>{order.purchaseType}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDetailClick(order.orderId)}
                  >
                    Detail
                  </Button>
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex" }}>
                    {order.status === "OnDelivery" && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleConfirmDelivery(order.orderId)}
                        sx={{ ml: 1 }}
                      >
                        Confirm Delivery
                      </Button>
                    )}
                    {order.status === "AwaitingPayment" && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleCancelOrder(order.orderId)}
                        sx={{ ml: 1 }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} align="center">
                {isLoading
                  ? "Loading orders..."
                  : searchQuery || status
                  ? "No orders match your search or filter."
                  : "No orders available."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );

  return (
    <Container component="main" maxWidth="lg">
      <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
        Order Management
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box
          display="flex"
          backgroundColor="white"
          borderRadius="3px"
          border={1}
          p={1}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            defaultValue={searchQuery}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="space-between" gap={5} mb={3}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              value={status}
              onChange={handleStatusChange}
              labelId="status-select-label"
              label="Status"
              id="status-select"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="AwaitingPayment">Awaiting Payment</MenuItem>
              <MenuItem value="OnDelivery">On Delivery</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateOrder}
          >
            Create Order
          </Button>
        </Box>
      </Box>
      <Paper elevation={3}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          renderTable()
        )}
      </Paper>
    </Container>
  );
};

export default OrderManagement;

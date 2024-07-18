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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ApiService from "../services/apiServices";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const getOrders = useCallback(async (page, pageSize, status, searchQuery) => {
    try {
      setIsLoading(true);
      const response = await ApiService.getOrders(
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
  }, []);

  useEffect(() => {
    getOrders(page, pageSize, statusFilter, searchQuery);
  }, [getOrders, page, pageSize, statusFilter, searchQuery]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const renderTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order Code</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Recipient Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Created Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderCode}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.recipientName}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>
                  {new Date(order.createdDate).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                {searchQuery
                  ? "No orders match your search."
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
        <Box display="flex" backgroundColor="white" borderRadius="3px" p={1}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="AwaitingPayment">Awaiting Payment</MenuItem>
            <MenuItem value="OnDelivery">On Delivery</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
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

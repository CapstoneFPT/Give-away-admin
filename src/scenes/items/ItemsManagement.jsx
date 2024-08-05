import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
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
  Tabs,
  Tab,
  InputBase,
  IconButton,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ApiService from "../../services/apiServices";
import AddItem from "../../components/AddItem";
import AuctionForm from "../../components/CreateAuctionForm";
import { useSnackbar } from "../../services/SnackBar";

const ItemsManagement = () => {
  const [fashionItems, setFashionItems] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const { showSnackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddItem, setOpenAddItem] = useState(false);
  const [type, setType] = useState("ItemBase");
  const [openAuctionForm, setOpenAuctionForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [statusFilter, setStatusFilter] = useState("Available");
  console.log(fashionItems);
  const userRole = sessionStorage.getItem("role");
  const shopId = userRole === "Admin" ? "" : sessionStorage.getItem("shopId");
  console.log(fashionItems);
  const statusOptions = {
    ConsignedForSale: [
      "Available",
      "Unavailable",
      "OnDelivery",
      "Sold",
      "Pending",
      "Refundable",
      "Rejected",
      "Returned",
    ],
    ItemBase: [
      "Available",
      "Unavailable",
      "OnDelivery",
      "Sold",
      "Refundable",
      "Returned",
    ],
    ConsignedForAuction: [
      "Available",
      "Unavailable",

      "PendingAuction",
      "AwaitingAuction",
      "Bidding",
      "Won",
      "Rejected",
      "Returned",
    ],
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const getFashionItems = useCallback(
    async (page, pageSize, status, searchQuery, type) => {
      try {
        setIsLoading(true);
        const response = await ApiService.getItemsByShopId(
          page + 1,
          pageSize,
          status,
          searchQuery,
          type,
          shopId
        );

        const data = response.data;
        if (data && data.items) {
          setFashionItems(data.items);
          setPage(data.pageNumber - 1);
          setPageSize(data.pageSize);
          setTotalCount(data.totalCount);
        } else {
          setFashionItems([]);
          setTotalCount(0);
        }
      } catch (error) {
        setSearchQuery("");
        setFashionItems([]);
        setTotalCount(0);

        showSnackBar(`Failed to fetch items: ${error.message}`, "error");
      } finally {
        setIsLoading(false);
      }
    },
    [shopId, showSnackBar]
  );

  useEffect(() => {
    getFashionItems(page, pageSize, statusFilter, searchQuery, type);
  }, [
    getFashionItems,
    page,
    pageSize,
    tabIndex,
    statusFilter,
    searchQuery,
    type,
  ]);

  const toggleStatus = async (itemId, currentStatus) => {
    if (currentStatus !== "Available" && currentStatus !== "Unavailable") {
      showSnackBar(
        "Only items with status 'Available' or 'Unavailable' can be changed.",
        "info"
      );
      return;
    }

    const newStatus =
      currentStatus === "Available" ? "Unavailable" : "Available";
    try {
      setIsLoading(true);
      await ApiService.updateItemStatus(itemId, newStatus);

      showSnackBar(`Status updated to ${newStatus} successfully`, `success`);
      getFashionItems(page, pageSize, statusFilter, searchQuery, type);
    } catch (error) {
      showSnackBar(`Failed to update status`, "error");
    } finally {
      setIsLoading(false);
    }
  };

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
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setStatusFilter("Available");
    setPage(0);
    if (newValue === 0) {
      setType("ItemBase");
    } else if (newValue === 1) {
      setType("ConsignedForSale");
    } else if (newValue === 2) {
      setType("ConsignedForAuction");
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleAddItemSuccess = () => {
    getFashionItems(page, pageSize, statusFilter, searchQuery, type);
  };

  const handleCreateAuction = (item) => {
    setSelectedItem(item);
    setOpenAuctionForm(true);
  };

  const handleAuctionSubmit = async (auctionData) => {
    try {
      await ApiService.createAuction(auctionData);

      showSnackBar(`Auction created successfully`, "success");
      setOpenAuctionForm(false);
      getFashionItems(page, pageSize, statusFilter, searchQuery, type);
    } catch (error) {
      showSnackBar(`Fail to create auction: +${error.message}`, "error");
    }
  };

  const renderTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <h2>Category</h2>
            </TableCell>
            <TableCell>
              <h2>Name</h2>
            </TableCell>
            <TableCell>
              <h2>Description</h2>
            </TableCell>
            {tabIndex !== 2 && (
              <TableCell>
                <h2>Price</h2>
              </TableCell>
            )}
            <TableCell>
              <h2>Status</h2>
            </TableCell>
            <TableCell>
              <h2>Type</h2>
            </TableCell>
            {tabIndex === 2 && (
              <TableCell>
                <h2>Action</h2>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {fashionItems.length >= 0 ? (
            fashionItems.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell>{item.categoryName}</TableCell>
                <TableCell>{item.name}</TableCell>
                {item.description !== `` && (
                  <TableCell>{item.description}</TableCell>
                )}
                {item.description === `` && <TableCell>N/A</TableCell>}
                {item.type !== "ConsignedForAuction" && (
                  <TableCell>
                    {item.sellingPrice !== 0 && (
                      <>{formatCurrency(item.sellingPrice)}</>
                    )}
                    {item.sellingPrice === 0 && <Typography>None</Typography>}
                  </TableCell>
                )}
                <TableCell>
                  {item.status === "Available" ||
                  item.status === "Unavailable" ? (
                    <Button
                      variant={
                        item.status === "Available" ? "contained" : "outlined"
                      }
                      color={
                        item.status === "Available" ? "primary" : "secondary"
                      }
                      onClick={() => toggleStatus(item.itemId, item.status)}
                      disabled={isLoading}
                    >
                      {item.status === "Available" ? "Take down" : "Post"}
                    </Button>
                  ) : (
                    item.status
                  )}
                </TableCell>
                <TableCell>{item.type}</TableCell>
                {item.type === "ConsignedForAuction" &&
                  item.status === "Available" && (
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCreateAuction(item)}
                      >
                        Create Auction
                      </Button>
                    </TableCell>
                  )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No items available
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
      <Typography
        component="h1"
        variant="h1"
        align="center"
        sx={{ mb: 15 }}
        fontWeight={"bold"}
      >
        Item Management
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
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            labelId="status-select-label"
            label="Status"
            id="status-select"
          >
            {statusOptions[type].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {userRole !== "Admin" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenAddItem(true)}
          >
            Add New Item
          </Button>
        )}
      </Box>
      <Paper elevation={3}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Item Base" />
          <Tab label="Consigned For Sale" />
          <Tab label="Consigned For Auction" />
        </Tabs>
        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          renderTable()
        )}
      </Paper>

      <AddItem
        open={openAddItem}
        onClose={() => setOpenAddItem(false)}
        onAddSuccess={handleAddItemSuccess}
      />
      <AuctionForm
        open={openAuctionForm}
        onClose={() => setOpenAuctionForm(false)}
        onSubmit={handleAuctionSubmit}
        item={selectedItem}
      />
    </Container>
  );
};

export default ItemsManagement;

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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ApiService from "../services/apiServices";
import AuctionForm from "./CreateAuctionForm";
import AddItem from "./AddItem"; // Import AddItem component

const ItemsManagement = () => {
  const [fashionItems, setFashionItems] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const shopId = localStorage.getItem("shopId");
  console.log(shopId);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [openAuctionForm, setOpenAuctionForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddItem, setOpenAddItem] = useState(false); // Thêm trạng thái để quản lý form AddItem

  const getFashionItems = useCallback(
    async (page, pageSize, searchQuery) => {
      try {
        setIsLoading(true);
        const response = await ApiService.getItemsByShopId(
          shopId,
          page + 1,
          pageSize,
          searchQuery
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
        alert("Failed to fetch items: " + error.message);
        setFashionItems([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [shopId]
  );

  const getAuctionItems = useCallback(
    async (page, pageSize, status, searchQuery) => {
      try {
        setIsLoading(true);
        const response = await ApiService.getAunctionItemById(
          shopId,
          page + 1,
          pageSize,
          status,
          searchQuery
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
        alert("Failed to fetch items: " + error.message);
        setFashionItems([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [shopId]
  );

  useEffect(() => {
    if (tabIndex === 0) {
      getFashionItems(page, pageSize, searchQuery);
    } else if (tabIndex === 1) {
      getAuctionItems(page, pageSize, "PendingAuction", searchQuery);
    } else if (tabIndex === 2) {
      getAuctionItems(page, pageSize, "AwaitingAuction", searchQuery);
    }
  }, [getFashionItems, getAuctionItems, page, pageSize, tabIndex, searchQuery]);

  const toggleStatus = async (itemId, currentStatus) => {
    const newStatus =
      currentStatus === "Available" ? "Unavailable" : "Available";
    try {
      setIsLoading(true);
      await ApiService.updateItemStatus(itemId, newStatus);
      alert(`Status updated to ${newStatus} successfully`);
      getFashionItems(page, pageSize, searchQuery);
    } catch (error) {
      alert("Failed to update status: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToAuction = (item) => {
    setSelectedItem(item);
    setOpenAuctionForm(true);
  };

  const handleAuctionSubmit = async (auctionData) => {
    try {
      setIsLoading(true);
      await ApiService.createAuction(auctionData);
      alert("Auction created successfully");
      setOpenAuctionForm(false);
      getFashionItems(page, pageSize, searchQuery);
    } catch (error) {
      alert("Failed to create auction: " + error.message);
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

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleAddItemSuccess = () => {
    getFashionItems(page, pageSize, searchQuery);
  };

  const renderTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Type</TableCell>
            {tabIndex === 0 && <TableCell>Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {fashionItems.length > 0 ? (
            fashionItems.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell>{item.categoryName}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    noWrap
                    sx={{ maxWidth: 300 }}
                  >
                    {item.note}
                  </Typography>
                </TableCell>
                <TableCell>{item.sellingPrice}</TableCell>
                <TableCell>
                  {tabIndex === 0 ? (
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
                      {item.status}
                    </Button>
                  ) : (
                    item.status
                  )}
                </TableCell>
                <TableCell>{item.type}</TableCell>
                {tabIndex === 0 && (
                  <TableCell>
                    {item.status === "Available" &&
                      item.type === "ConsignedForAuction" && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddToAuction(item)}
                          disabled={isLoading}
                        >
                          Add to Auction
                        </Button>
                      )}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={tabIndex === 0 ? 7 : 6} align="center">
                {searchQuery
                  ? "No items match your search."
                  : "No items available."}
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
        Item Management
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddItem(true)}
        >
          Add New Item
        </Button>
      </Box>
      <Paper elevation={3}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All Items" />
          <Tab label="Pending Auction" />
          <Tab label="Awaiting Auction" />
        </Tabs>
        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          renderTable()
        )}
      </Paper>
      {openAuctionForm && (
        <AuctionForm
          open={openAuctionForm}
          onClose={() => setOpenAuctionForm(false)}
          item={selectedItem}
          onSubmit={handleAuctionSubmit}
        />
      )}
      <AddItem
        open={openAddItem}
        onClose={() => setOpenAddItem(false)}
        onAddSuccess={handleAddItemSuccess}
      />
    </Container>
  );
};

export default ItemsManagement;

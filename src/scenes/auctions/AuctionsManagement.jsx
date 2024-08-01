import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TablePagination,
  Button,
} from "@mui/material";
import ApiService from "../../services/apiServices";

const AuctionManagement = () => {
  const [auctions, setAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const userRole = localStorage.getItem("role");

  const fetchAuctions = async (searchTerm, page, pageSize) => {
    setIsLoading(true);
    try {
      const data = await ApiService.getAuction(searchTerm, page + 1, pageSize);
      setAuctions(data.items);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Failed to fetch auctions:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions(searchTerm, page, pageSize);
  }, [searchTerm, page, pageSize]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to the first page on search term change
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApprove = async (auctionId) => {
    try {
      await ApiService.approveAuctionByAdmin(auctionId);
      alert("Auction approved successfully");
      fetchAuctions(searchTerm, page, pageSize); // Refresh auctions
    } catch (error) {
      console.error("Failed to approve auction:", error.message);
      alert("Failed to approve auction: " + error.message);
    }
  };

  const handleReject = async (auctionId) => {
    try {
      await ApiService.rejectAuctionByAdmin(auctionId);
      alert("Auction rejected successfully");
      fetchAuctions(searchTerm, page, pageSize); // Refresh auctions
    } catch (error) {
      console.error("Failed to reject auction:", error.message);
      alert("Failed to reject auction: " + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Rejected":
        return "red";
      case "Pending":
        return "#FFA700";
      case "OnGoing":
        return "#567de8";
      default:
        return "text.secondary";
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Auction Management
      </Typography>
      <TextField
        fullWidth
        label="Search by Title"
        value={searchTerm}
        onChange={handleSearchChange}
        variant="outlined"
        margin="normal"
      />

      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {auctions.map((auction) => (
            <Grid item xs={12} sm={6} md={4} key={auction.auctionId}>
              <Card style={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={auction.imageUrl}
                  alt={auction.title}
                />
                <CardContent style={{ flex: "1 0 auto" }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {auction.title}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" component="span">
                      <strong>Status: </strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      ml={1}
                      fontSize={15}
                      style={{ color: getStatusColor(auction.status) }}
                    >
                      {auction.status}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong> Start Date: </strong>{" "}
                    {new Date(auction.startDate).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong> End Date: </strong>{" "}
                    {new Date(auction.endDate).toLocaleString()}
                  </Typography>
                  {userRole === "Admin" && auction.status === "Pending" && (
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleApprove(auction.auctionId)}
                        style={{ marginRight: "10px" }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleReject(auction.auctionId)}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Box display="flex" justifyContent="center" marginTop={2}>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15, 20]}
        />
      </Box>
    </Container>
  );
};

export default AuctionManagement;

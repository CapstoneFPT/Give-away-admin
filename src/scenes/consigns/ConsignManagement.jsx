import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import ApiService from "../../services/apiServices";
import AddConsignment from "../../components/AddConsignment";

const ConsignManagement = () => {
  const [consignments, setConsignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [open, setOpen] = useState(false);
  const shopId = localStorage.getItem("shopId");
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const statusTabs = useMemo(
    () => [
      { label: "All", value: "" },
      { label: "Pending", value: "Pending" },
      { label: "AwaitDelivery", value: "AwaitDelivery" },
      { label: "Received", value: "Received" },
      { label: "Complete", value: "Complete" },
      { label: "Rejected", value: "Rejected" },
      { label: "Cancelled", value: "Cancelled" },
    ],
    []
  );

  const fetchConsignments = useCallback(
    async (page, pageSize, status, searchTerm) => {
      setIsLoading(true);
      try {
        const response = await ApiService.getAllConsignments(
          shopId,
          page,
          pageSize,
          status,
          searchTerm
        );
        const data = response.data;
        if (data && data.items) {
          setConsignments(data.items);
          setTotalPage(data.totalPages);
          setPageSize(data.pageSize);
        } else {
          setConsignments([]);
        }
      } catch (error) {
        console.error("Failed to fetch consignments:", error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [shopId]
  );

  useEffect(() => {
    fetchConsignments(page, pageSize, statusTabs[tabIndex].value, searchTerm);
  }, [fetchConsignments, page, pageSize, tabIndex, searchTerm, statusTabs]);

  const handleDetailClick = (consignSaleCode) => {
    navigate(`/consign/${consignSaleCode}`);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddSuccess = async () => {
    handleClose();
    fetchConsignments(page, pageSize, statusTabs[tabIndex].value, searchTerm); // Fetch consignments again after adding a new one
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setPage(1); // Reset to first page when tab changes
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value); // Update searchTerm state on input change
  };

  const handleStatusChange = async (consignSaleId, status) => {
    if (status === "Received") {
      const confirmed = window.confirm(
        "Are you sure you want to mark this consignment as received?"
      );
      if (!confirmed) {
        return;
      }
    }

    try {
      if (status === "Received") {
        await ApiService.updateConsignStatusToRecieved(consignSaleId);
      } else {
        await ApiService.updateConsignStatus(consignSaleId, status);
      }
      fetchConsignments(page, pageSize, statusTabs[tabIndex].value, searchTerm); // Fetch consignments again after updating status
    } catch (error) {
      console.error(`Failed to update consignment status: ${error.message}`);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Consignment Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add Consignment
      </Button>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchInputChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
        {statusTabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : consignments.length === 0 ? (
        <Typography variant="h6">No consignments available</Typography>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Consignment Code</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Sold Price</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Detail</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consignments.map((consign) => (
                <TableRow key={consign.consignSaleId}>
                  <TableCell>{consign.consignSaleCode}</TableCell>
                  <TableCell>
                    {new Date(consign.startDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(consign.endDate).toLocaleString()}
                  </TableCell>
                  <TableCell>{consign.status}</TableCell>
                  <TableCell>{consign.totalPrice}</TableCell>
                  <TableCell>{consign.soldPrice}</TableCell>
                  <TableCell>{consign.type}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDetailClick(consign.consignSaleCode)}
                      sx={{ marginRight: "10px" }}
                    >
                      Detail
                    </Button>
                  </TableCell>
                  <TableCell>
                    {consign.status === "Pending" && (
                      <>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() =>
                            handleStatusChange(
                              consign.consignSaleId,
                              "Rejected"
                            )
                          }
                          sx={{ marginRight: "10px" }}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleStatusChange(
                              consign.consignSaleId,
                              "AwaitDelivery"
                            )
                          }
                        >
                          Approve
                        </Button>
                      </>
                    )}
                    {consign.status === "AwaitDelivery" && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleStatusChange(consign.consignSaleId, "Received")
                        }
                      >
                        Mark as Received
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variant="contained"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Typography variant="body1">
              Page {page} of {totalPage}
            </Typography>
            <Button
              variant="contained"
              disabled={page === totalPage}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </Box>
        </>
      )}
      <AddConsignment
        open={open}
        onClose={handleClose}
        onAddSuccess={handleAddSuccess}
      />
    </Box>
  );
};

export default ConsignManagement;

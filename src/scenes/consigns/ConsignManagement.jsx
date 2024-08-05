import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/apiServices";
import AddConsignment from "../../components/AddConsignment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useSnackbar } from "../../services/SnackBar";

const ConsignManagement = () => {
  const [consignments, setConsignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { showSnackBar } = useSnackbar();
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("role");
  const shopId = userRole === "Admin" ? "" : sessionStorage.getItem("shopId");
  const statusTabs = useMemo(
    () => [
      { label: "All", value: "" },
      { label: "Pending", value: "Pending" },
      { label: "Await Delivery", value: "AwaitDelivery" },
      { label: "Received", value: "Received" },
      { label: "Completed", value: "Completed" },
      { label: "On Sale ", value: "OnSale" },
      { label: "Rejected", value: "Rejected" },
      { label: "Cancelled", value: "Cancelled" },
    ],
    []
  );

  const fetchConsignments = useCallback(
    async (page, pageSize, status, startDate, endDate, searchTerm) => {
      setIsLoading(true);
      try {
        let response;

        if (startDate && endDate) {
          response = await ApiService.getConsignmentsByBothDate(
            shopId,
            page,
            pageSize,
            status,
            startDate.toISOString(),
            endDate.toISOString(),
            searchTerm
          );
        } else if (startDate) {
          response = await ApiService.getConsignmentsByStartDate(
            shopId,
            page,
            pageSize,
            status,
            startDate.toISOString(),
            searchTerm
          );
        } else if (endDate) {
          response = await ApiService.getConsignmentsByEndDate(
            shopId,
            page,
            pageSize,
            status,
            endDate.toISOString(),
            searchTerm
          );
        } else {
          response = await ApiService.getAllConsignments(
            shopId,
            page,
            pageSize,
            status,
            searchTerm
          );
        }

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
    fetchConsignments(
      page,
      pageSize,
      statusTabs[tabIndex].value,
      startDate,
      endDate,
      searchTerm
    );
  }, [
    fetchConsignments,

    page,
    pageSize,
    tabIndex,
    startDate,
    endDate,
    searchTerm,
    statusTabs,
  ]);

  const handleDetailClick = (consignSaleId) => {
    navigate(`/consign/${consignSaleId}`);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddSuccess = async () => {
    handleClose();
    fetchConsignments(
      page,
      pageSize,
      statusTabs[tabIndex].value,
      startDate,
      endDate,
      searchTerm
    );
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setPage(1);
  };

  const handleSearchInputChange = debounce((event) => {
    setSearchTerm(event.target.value || "");
    setPage(1);
  }, 300);

  const handleStatusChange = async (consignSaleId) => {
    try {
      await ApiService.updateConsignStatusToRecieved(consignSaleId);
      fetchConsignments(
        page,
        pageSize,
        statusTabs[tabIndex].value,
        startDate,
        endDate,
        searchTerm
      );
      showSnackBar("Status changed successfully", "success");
    } catch (error) {
      console.error(`Failed to update consignment status: ${error.message}`);
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString("vn", { minimumFractionDigits: 0 });
  };

  return (
    <Box p={2}>
      <Typography
        component="h1"
        variant="h1"
        align="center"
        sx={{ mb: 5 }}
        fontWeight={"bold"}
      >
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
        onChange={handleSearchInputChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Box mb={2} display="flex" gap={2}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(date) => setStartDate(date)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(date) => setEndDate(date)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>
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
                <TableCell>Created Date</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Sold Price</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Detail</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consignments.map((consign) => (
                <TableRow key={consign.consignSaleId}>
                  <TableCell>{consign.consignSaleCode}</TableCell>

                  <TableCell>
                    {new Date(consign.createdDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(consign.startDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(consign.endDate).toLocaleString()}
                  </TableCell>
                  <TableCell>{consign.status}</TableCell>
                  <TableCell>{formatNumber(consign.totalPrice)} VND</TableCell>
                  <TableCell>{formatNumber(consign.soldPrice)} VND </TableCell>
                  <TableCell>{consign.type}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDetailClick(consign.consignSaleId)}
                      sx={{ marginRight: "10px" }}
                    >
                      Detail
                    </Button>
                  </TableCell>
                  <TableCell>
                    {consign.status === "AwaitDelivery" && (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleStatusChange(consign.consignSaleId)
                          }
                        >
                          Confirm Received
                        </Button>
                      </>
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

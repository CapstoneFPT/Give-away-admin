import React, { useState, useEffect } from "react";
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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
} from "@mui/material";
import ApiService from "../../services/apiServices";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce 500ms
  const debouncedStatusFilter = useDebounce(statusFilter, 500); // Debounce 500ms
  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        const data = await ApiService.getAllAccounts(
          page,
          pageSize,
          debouncedSearchQuery,
          debouncedStatusFilter
        );
        console.log(data);
        setAccounts(data.items);
        setTotalPage(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch accounts:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccounts();
  }, [page, debouncedSearchQuery, debouncedStatusFilter]);

  const handleDetailClick = (accountId) => {
    navigate(`/manage-accounts/${accountId}`);
  };

  const toggleAccountStatus = async (accountId, currentStatus) => {
    try {
      await ApiService.updateAccountStatus(accountId);
      setAccounts(
        accounts.map((acc) =>
          acc.accountId === accountId
            ? {
                ...acc,
                status: currentStatus === "Active" ? "Inactive" : "Active",
              }
            : acc
        )
      );
    } catch (error) {
      console.error("Failed to update account status:", error.message);
    }
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to page 1 when status filter changes
  };

  return (
    <Box p={2}>
      <Typography
        fontWeight={"bold"}
        fontSize={40}
        variant="h1"
        justifyContent={"center"}
        display={"flex"}
        mb={10}
      >
        Account Management
      </Typography>
      <Box mb={2} display="flex" justifyContent="space-between">
        <TextField
          label="Search by Phone"
          variant="outlined"
          placeholder="Enter phone number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "48%" }}
        />
        <FormControl variant="outlined" sx={{ width: "48%" }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="NotVerified">Not verify</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          border={1}
        >
          <CircularProgress />
        </Box>
      ) : accounts.length === 0 ? (
        <Typography variant="h6" align="center">
          No accounts available
        </Typography>
      ) : (
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <h2>Full Name</h2>
                </TableCell>
                <TableCell>
                  <h2>Email</h2>
                </TableCell>
                <TableCell>
                  <h2>Phone</h2>
                </TableCell>
                <TableCell>
                  <h2>Role</h2>
                </TableCell>
                <TableCell>
                  <h2>Status</h2>
                </TableCell>
                <TableCell>
                  <h2>Actions</h2>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.accountId}>
                  <TableCell>{account.fullname}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.phone}</TableCell>
                  <TableCell>{account.role}</TableCell>
                  <TableCell>{account.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDetailClick(account.accountId)}
                      sx={{ marginRight: "10px" }}
                    >
                      Detail
                    </Button>
                    {statusFilter === "NotVerified"}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor:
                          account.status === "Active" ? "#f44336" : "#4caf50", // Red for Active, Green for Inactive
                        "&:hover": {
                          backgroundColor:
                            account.status === "Active" ? "#d32f2f" : "#388e3c", // Darker Red/Green on hover
                        },
                      }}
                      onClick={() =>
                        toggleAccountStatus(account.accountId, account.status)
                      }
                    >
                      {account.status === "Active" ? "Ban" : "Unban"}
                    </Button>
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
              sx={{ ml: 3, mb: 2 }}
            >
              Previous
            </Button>
            <Typography>
              Page {page} / {totalPage}
            </Typography>
            <Button
              variant="contained"
              disabled={page === totalPage}
              onClick={() => setPage(page + 1)}
              sx={{ mr: 3, mb: 2 }}
            >
              Next
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default AccountManagement;

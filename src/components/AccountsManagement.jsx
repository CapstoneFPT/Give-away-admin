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
} from "@mui/material";
import ApiService from "../services/apiServices";

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        const data = await ApiService.getAllAccounts(
          page,
          pageSize,
          searchQuery
        );
        setAccounts(data.items);
        setTotalPage(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch accounts:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccounts();
  }, [page, searchQuery]);

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

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Account Management
      </Typography>
      <Box mb={2}>
        <TextField
          label="Search"
          variant="outlined"
          placeholder="Enter username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "100%" }}
        />
      </Box>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : accounts.length === 0 ? (
        <Typography variant="h6" align="center">
          No accounts available
        </Typography>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
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
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AccountManagement;

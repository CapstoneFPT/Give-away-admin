import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ApiService from "../../services/apiServices"; // Import your API function for fetching account details

const AccountDetail = () => {
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // Fetch account details from the API
    const fetchAccountDetails = async () => {
      setIsLoading(true);
      try {
        const data = await ApiService.getAccountDetailById(accountId);
        setAccount(data.data);
      } catch (error) {
        console.error("Failed to fetch account details:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccountDetails();
  }, [accountId]);
  const toggleAccountStatus = async () => {
    try {
      await ApiService.updateAccountStatus(accountId);
      setAccount((prevAccount) => ({
        ...prevAccount,
        status: prevAccount.status === "Active" ? "Inactive" : "Active",
      }));
    } catch (error) {
      console.error("Failed to update account status:", error.message);
    }
  };
  if (!account) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box p={2}>
      <Button variant="contained" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Typography variant="h4" gutterBottom>
            Account Profile
          </Typography>
          <Typography variant="h6">Full Name: {account.fullname}</Typography>
          <Typography variant="h6">Email: {account.email}</Typography>
          <Typography variant="h6">Phone: {account.phone}</Typography>
          <Typography variant="h6">Role: {account.role}</Typography>
          <Typography variant="h6">Status: {account.status}</Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor:
                account.status === "Active" ? "#f44336" : "#4caf50",
              "&:hover": {
                backgroundColor:
                  account.status === "Active" ? "#d32f2f" : "#388e3c",
              },
              mt: 2,
            }}
            onClick={toggleAccountStatus}
          >
            {account.status === "Active" ? "Ban" : "Unban"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AccountDetail;

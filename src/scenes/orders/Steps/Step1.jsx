import React, { useState } from "react";
import { useCart } from "../../../services/context";
import ApiService from "../../../services/apiServices";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

const Step1 = ({ nextStep }) => {
  const { setCustomerInfo } = useCart();
  const [hasAccount, setHasAccount] = useState(true);
  const [phone, setPhone] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCustomerSelection = (customer) => {
    setCustomerInfo(customer);
    nextStep();
  };

  const handleSearch = async (phone) => {
    setPhone(phone);
    if (!phone) {
      setAccounts([]);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await ApiService.getAccountByPhone(phone);
      setAccounts(response.items);
    } catch (error) {
      setError(error.message);
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          fontWeight={50}
          fontSize={40}
          fontStyle={"inherit"}
          mb={20}
        >
          Create order
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Select Customer
          </Typography>
          <Button
            variant={hasAccount ? "contained" : "outlined"}
            onClick={() => setHasAccount(true)}
            sx={{ mr: 1 }}
          >
            Customer has an account
          </Button>
          <Button
            variant={!hasAccount ? "contained" : "outlined"}
            onClick={() => setHasAccount(false)}
          >
            Customer does not have an account
          </Button>
        </Box>
        {hasAccount ? (
          <>
            <Paper
              component="form"
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                mb: 2,
                p: 1,
                border: "1px solid #ccc",
                boxShadow: 1,
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search by phone number"
                value={phone}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Paper>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <List sx={{ border: "1px solid #ccc", borderRadius: 1 }}>
                {accounts.length === 0 && !isLoading && (
                  <Typography variant="body1" color="textSecondary">
                    No accounts found
                  </Typography>
                )}
                {accounts.map((account) => (
                  <ListItem
                    key={account.accountId}
                    onClick={() => handleCustomerSelection(account)}
                    sx={{
                      borderBottom: "1px solid #ccc",
                      "&:last-child": {
                        borderBottom: "none",
                      },
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <ListItemText primary={account.fullname} />
                  </ListItem>
                ))}
              </List>
            )}
            {error && <Typography color="error">{error}</Typography>}
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const customer = {
                fullname: e.target.fullName.value,
                phone: e.target.phone.value,
                email: e.target.email.value,
                address: e.target.address.value,
              };
              handleCustomerSelection(customer);
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <InputBase
                name="fullName"
                placeholder="Full Name"
                required
                sx={{ p: 1, border: "1px solid #ccc", borderRadius: 1 }}
              />
              <InputBase
                name="phone"
                placeholder="Phone"
                required
                sx={{ p: 1, border: "1px solid #ccc", borderRadius: 1 }}
              />
              <InputBase
                name="email"
                placeholder="Email"
                sx={{ p: 1, border: "1px solid #ccc", borderRadius: 1 }}
              />
              <InputBase
                name="address"
                placeholder="Address"
                sx={{ p: 1, border: "1px solid #ccc", borderRadius: 1 }}
              />
              <Button variant="contained" type="submit">
                Next
              </Button>
            </Box>
          </form>
        )}
      </Box>
    </Container>
  );
};

export default Step1;

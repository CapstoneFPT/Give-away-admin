import React, { useState, useEffect } from "react";
import { useCart } from "../../../services/context";
import ApiService from "../../../services/apiServices";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
} from "@mui/material";

const Step2 = ({ nextStep, prevStep }) => {
  const { cartItems, addToCart, customerInfo, clearCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(cartItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(customerInfo);
  console.log(cartItems);
  const shopId = sessionStorage.getItem("shopId");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await ApiService.getItemForOrder(searchQuery, shopId);
        setItems(response.data.items);
      } catch (error) {
        setError(error.message);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();

    return () => {
      setItems([]);
      setSelectedItems(cartItems);
      setIsLoading(false);
      setError(null);
    };
  }, [shopId, cartItems, searchQuery]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      setItems([]);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await ApiService.getItemForOrder(searchQuery, shopId);
      setItems(response.data.items);
    } catch (error) {
      setError(error.message);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.some(
        (selectedItem) => selectedItem.itemId === item.itemId
      )
        ? prevSelectedItems.filter(
            (selectedItem) => selectedItem.itemId !== item.itemId
          )
        : [...prevSelectedItems, item]
    );
  };

  const handleBack = () => {
    clearCart(cartItems);
    prevStep();
  };

  const handleNext = () => {
    addToCart(selectedItems);
    nextStep();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Add Items to Order
        </Typography>
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
            placeholder="Search for items"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Paper>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.itemId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.some(
                          (selectedItem) => selectedItem.itemId === item.itemId
                        )}
                        onChange={() => handleSelectItem(item)}
                      />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>{item.sellingPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {error && <Typography color="error">{error}</Typography>}
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Button variant="outlined" onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Step2;

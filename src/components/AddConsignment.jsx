import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Modal,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiService from "../services/apiServices";
import { InputAdornment } from "@mui/material";

const AddConsignment = ({ open, onClose, onAddSuccess }) => {
  const [newConsign, setNewConsign] = useState({
    type: "",
    recipientName: "",
    phone: "",
    address: "",
    email: "",
    fashionItemForConsigns: [
      {
        name: "",
        note: "",
        value: 0,
        dealPrice: 0,
        confirmedPrice: 0,
        condition: "",
        categoryId: "",
        size: "",
        color: "",
        brand: "",
        gender: "",
        image: [],
      },
    ],
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const shopId = localStorage.getItem("shopId");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ApiService.getLeavesCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, [shopId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewConsign((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleItemChange = (event, index) => {
    const { name, value } = event.target;
    setNewConsign((prevState) => ({
      ...prevState,
      fashionItemForConsigns: prevState.fashionItemForConsigns.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      ),
    }));
  };

  const handleFileChange = (event, index) => {
    const files = event.target.files;
    const imagesArray = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setNewConsign((prevState) => ({
      ...prevState,
      fashionItemForConsigns: prevState.fashionItemForConsigns.map((item, i) =>
        i === index
          ? { ...item, image: [...item.image, ...imagesArray].slice(0, 5) }
          : item
      ),
    }));
  };

  const handleRemoveImage = (itemIndex, imgIndex) => {
    setNewConsign((prevState) => ({
      ...prevState,
      fashionItemForConsigns: prevState.fashionItemForConsigns.map((item, i) =>
        i === itemIndex
          ? {
              ...item,
              image: item.image.filter((_, idx) => idx !== imgIndex),
            }
          : item
      ),
    }));
  };

  const handleAddItem = () => {
    setNewConsign((prevState) => ({
      ...prevState,
      fashionItemForConsigns: [
        ...prevState.fashionItemForConsigns,
        {
          name: "",
          note: "",
          value: 0,
          dealPrice: 0,
          confirmedPrice: 0,
          condition: "",
          categoryId: "",
          size: "",
          color: "",
          brand: "",
          gender: "",
          image: [],
        },
      ],
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // Assuming you have an ApiService method for adding consignments
      await ApiService.addConsignment(shopId, newConsign);
      alert("Consignment added successfully");
      onAddSuccess();
      setNewConsign({
        type: "",
        recipientName: "",
        phone: "",
        address: "",
        email: "",
        fashionItemForConsigns: [
          {
            name: "",
            note: "",
            value: 0,
            dealPrice: 0,
            confirmedPrice: 0,
            condition: "",
            categoryId: "",
            size: "",
            color: "",
            brand: "",
            gender: "",
            image: [],
          },
        ],
      });
      onClose();
    } catch (error) {
      console.error("Failed to add consignment:", error); // Log error for debugging
      alert("Failed to add consignment: " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-consignment-modal-title"
      aria-describedby="add-consignment-modal-description"
    >
      <Container
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          maxWidth: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          id="add-consignment-modal-title"
          variant="h6"
          component="h2"
        >
          Add New Consignment
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                name="type"
                value={newConsign.type}
                onChange={handleChange}
              >
                <MenuItem value="ConsignedForSale">ConsignedForSale</MenuItem>
                <MenuItem value="ConsignedForAuction">
                  ConsignedForAuction
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="recipientName"
              label="Recipient Name"
              name="recipientName"
              value={newConsign.recipientName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Phone"
              name="phone"
              value={newConsign.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="address"
              label="Address"
              name="address"
              value={newConsign.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={newConsign.email}
              onChange={handleChange}
            />
          </Grid>
          {newConsign.fashionItemForConsigns.map((item, index) => (
            <Box key={index} mt={2} width="100%">
              <Typography variant="h6">Item {index + 1}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Name"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleItemChange(e, index)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Note"
                    name="note"
                    value={item.note}
                    onChange={(e) => handleItemChange(e, index)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Value"
                    name="value"
                    value={item.value}
                    onChange={(e) => handleItemChange(e, index)}
                    type="number"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">VND</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Deal Price"
                    name="dealPrice"
                    value={item.dealPrice}
                    onChange={(e) => handleItemChange(e, index)}
                    type="number"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">VND</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Confirmed Price"
                    name="confirmedPrice"
                    value={item.confirmedPrice}
                    onChange={(e) => handleItemChange(e, index)}
                    type="number"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">VND</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Condition"
                    name="condition"
                    value={item.condition}
                    onChange={(e) => handleItemChange(e, index)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      name="categoryId"
                      value={item.categoryId}
                      onChange={(e) => handleItemChange(e, index)}
                    >
                      {categories.map((category) => (
                        <MenuItem
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Size"
                    name="size"
                    value={item.size}
                    onChange={(e) => handleItemChange(e, index)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Color"
                    name="color"
                    value={item.color}
                    onChange={(e) => handleItemChange(e, index)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Brand"
                    name="brand"
                    value={item.brand}
                    onChange={(e) => handleItemChange(e, index)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      label="Gender"
                      name="gender"
                      value={item.gender}
                      onChange={(e) => handleItemChange(e, index)}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" component="label" fullWidth>
                    Upload Images
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={(e) => handleFileChange(e, index)}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {item.image.map((img, imgIndex) => (
                    <Box
                      key={imgIndex}
                      sx={{
                        display: "inline-block",
                        position: "relative",
                        margin: "0 10px 10px 0",
                      }}
                    >
                      <img
                        src={img}
                        alt={`img-${imgIndex}`}
                        width="100"
                        height="100"
                      />
                      <IconButton
                        aria-label="delete"
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                        }}
                        onClick={() => handleRemoveImage(index, imgIndex)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </Box>
          ))}
          {newConsign.fashionItemForConsigns.length < 5 && (
            <Grid item xs={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddItem}
                fullWidth
              >
                Add Item
              </Button>
            </Grid>
          )}
        </Grid>
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Container>
    </Modal>
  );
};

export default AddConsignment;

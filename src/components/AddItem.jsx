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

const AddItem = ({ open, onClose, onAddSuccess }) => {
  const [newItem, setNewItem] = useState({
    sellingPrice: 0,
    name: "",
    note: "",
    value: 0,
    condition: "",
    brand: "",
    color: "",
    gender: "",
    size: "",
    categoryId: "",
    images: [],
  });
  const [categoryLeaves, setCategoryLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const shopId = localStorage.getItem("shopId");

  useEffect(() => {
    const fetchCategoryLeaves = async () => {
      try {
        const response = await ApiService.getLeavesCategories(shopId);
        setCategoryLeaves(response.categoryLeaves);
      } catch (error) {
        console.error("Error fetching category leaves:", error.message);
      }
    };

    fetchCategoryLeaves();
  }, [shopId]);

  const handleNewItemChange = (event) => {
    const { name, value } = event.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    const imagesArray = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setNewItem((prevItem) => ({
      ...prevItem,
      images: [...prevItem.images, ...imagesArray].slice(0, 5),
    }));
  };

  const handleImageDelete = (index) => {
    setNewItem((prevItem) => {
      const newImages = [...prevItem.images];
      newImages.splice(index, 1);
      return {
        ...prevItem,
        images: newImages,
      };
    });
  };

  const handleAddItemSubmit = async () => {
    try {
      setIsLoading(true);
      await ApiService.addItemByShopId(shopId, newItem);
      alert("Item added successfully");
      onAddSuccess();
      setNewItem({
        sellingPrice: 0,
        name: "",
        note: "",
        value: 0,
        condition: "",
        brand: "",
        color: "",
        gender: "",
        size: "",
        categoryId: "",
        images: [],
      });
      onClose();
    } catch (error) {
      console.error("Failed to add item:", error); // Log error for debugging
      alert("Failed to add item: " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-item-modal-title"
      aria-describedby="add-item-modal-description"
    >
      <Container
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          maxWidth: "90%",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="add-item-modal-title" variant="h6" component="h2">
          Add New Item
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Item Name"
              name="name"
              autoFocus
              value={newItem.name}
              onChange={handleNewItemChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="sellingPrice"
              label="Selling Price"
              name="sellingPrice"
              type="number"
              value={newItem.sellingPrice}
              onChange={handleNewItemChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="note"
              label="Note"
              name="note"
              value={newItem.note}
              onChange={handleNewItemChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="value"
              label="Value"
              name="value"
              type="number"
              value={newItem.value}
              onChange={handleNewItemChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="condition"
              label="Condition"
              name="condition"
              value={newItem.condition}
              onChange={handleNewItemChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="brand"
              label="Brand"
              name="brand"
              value={newItem.brand}
              onChange={handleNewItemChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="color"
              label="Color"
              name="color"
              value={newItem.color}
              onChange={handleNewItemChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="gender-label" style={{ top: "-8px" }}>
                Gender
              </InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={newItem.gender}
                onChange={handleNewItemChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="category-label" style={{ top: "-8px" }}>
                Category
              </InputLabel>
              <Select
                labelId="category-label"
                id="categoryId"
                name="categoryId"
                value={newItem.categoryId}
                onChange={handleNewItemChange}
              >
                {categoryLeaves.map((category) => (
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
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="size-label" style={{ top: "-8px" }}>
                Size
              </InputLabel>
              <Select
                labelId="size-label"
                id="size"
                name="size"
                value={newItem.size}
                onChange={handleNewItemChange}
              >
                <MenuItem value="XS">XS</MenuItem>
                <MenuItem value="S">S</MenuItem>
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="XL">L</MenuItem>
                <MenuItem value="XXL">XXL</MenuItem>
                <MenuItem value="XXXL">XXXL</MenuItem>
                <MenuItem value="XXXXL">4XL</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <input
              accept="image/*"
              id="upload-images"
              multiple
              type="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <label htmlFor="upload-images">
              <Button
                variant="contained"
                color="primary"
                component="span"
                disabled={newItem.images.length >= 5}
                sx={{ mt: 2 }}
              >
                Upload Images
              </Button>
            </label>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" flexWrap="wrap">
              {newItem.images.map((image, index) => (
                <Box key={index} position="relative" mr={1} mb={1}>
                  <img
                    src={image}
                    alt={`Preview ${index}`}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                  <IconButton
                    onClick={() => handleImageDelete(index)}
                    size="small"
                    color="secondary"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "white",
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddItemSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Item"}
          </Button>
        </Box>
      </Container>
    </Modal>
  );
};

export default AddItem;

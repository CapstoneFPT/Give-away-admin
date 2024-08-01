import React, { useState, useEffect } from "react";
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
import { storage } from "../firebaseconfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ApiService from "../services/apiServices";

const AddItem = ({ open, onClose, onAddSuccess }) => {
  const [newItem, setNewItem] = useState({
    sellingPrice: 0,
    name: "",
    note: "",

    condition: "",
    brand: "",
    color: "",
    gender: "",
    size: "",
    categoryId: "",
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const shopId = localStorage.getItem("shopId");
  console.log(newItem);
  useEffect(() => {
    if (newItem.gender) {
      const genderId =
        newItem.gender === "Male"
          ? "c7c0ba52-8406-47c1-9be5-497cbeea5933"
          : "8c3fe1f7-0082-4382-85de-6c70fcd76761";
      getCateByGender(genderId);
    }
  }, [newItem.gender]);

  const handleItemChange = (event) => {
    const { name, value } = event.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const getCateByGender = async (genderId) => {
    try {
      const response = await ApiService.getCategoryByGender(genderId);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const handleImageChange = async (event) => {
    const files = event.target.files;
    const uploadPromises = Array.from(files).map(async (file) => {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    });

    const imageUrls = await Promise.all(uploadPromises);

    setNewItem((prevItem) => ({
      ...prevItem,
      images: [...prevItem.images, ...imageUrls].slice(0, 3), // Allow up to 3 images
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

        condition: 0,
        brand: "",
        color: "",
        gender: "",
        size: "",
        categoryId: "",
        images: [],
      });
      onClose();
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to add item:", error);
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
              onChange={handleItemChange}
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
              onChange={handleItemChange}
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
              onChange={handleItemChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              id="condition"
              label="Condition"
              name="condition"
              value={newItem.condition}
              onChange={handleItemChange}
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
              onChange={handleItemChange}
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
              onChange={handleItemChange}
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
                onChange={handleItemChange}
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
                onChange={handleItemChange}
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
                onChange={handleItemChange}
              >
                <MenuItem value="XS">XS</MenuItem>
                <MenuItem value="S">S</MenuItem>
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="L">L</MenuItem>
                <MenuItem value="XL">XL</MenuItem>
                <MenuItem value="XXL">XXL</MenuItem>
                <MenuItem value="XXXL">XXXL</MenuItem>
                <MenuItem value="XXXXL">4XL</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <input
            accept="image/*"
            id="upload-images"
            multiple
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
            disabled={newItem.images.length >= 3}
          />
          <label htmlFor="upload-images">
            <Button
              variant="contained"
              component="span"
              disabled={newItem.images.length >= 3}
              style={{ marginLeft: "20px", marginTop: "30px" }}
            >
              Upload Images
            </Button>
          </label>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {newItem.images.map((url, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: 100,
                    height: 100,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={url}
                    alt={`Item ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      backgroundColor: "white",
                    }}
                    onClick={() => handleImageDelete(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Button
          onClick={handleAddItemSubmit}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 5, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Item"}
        </Button>
      </Container>
    </Modal>
  );
};

export default AddItem;

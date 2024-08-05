import React, { useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiService from "../services/apiServices";
import { InputAdornment } from "@mui/material";
import { storage } from "../firebaseconfig"; // Import your storage configuration
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSnackbar } from "../services/SnackBar";
const AddConsignment = ({ open, onClose, onAddSuccess }) => {
  const { showSnackBar } = useSnackbar();
  const [newConsign, setNewConsign] = useState({
    type: "ConsignedForSale",
    consigner: "",
    phone: "",
    address: "",
    email: "",
    fashionItemForConsigns: [
      {
        name: "",
        note: "",
        description: "",
        confirmedPrice: 0,
        condition: 0,
        categoryId: "", // New field
        size: "",
        color: "",
        brand: "",
        gender: "",
        images: [], // Changed from image
      },
    ],
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const shopId = sessionStorage.getItem("shopId");
  console.log(shopId);

  const getCateByGender = async (genderId) => {
    try {
      const response = await ApiService.getCategoryByGender(genderId);
      setCategories(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "condition") {
      // Allow only numeric values and ensure the value does not exceed 100
      if (/^\d{0,3}$/.test(value) && (value === "" || Number(value) <= 100)) {
        setNewConsign((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setNewConsign((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleItemChange = (event, index) => {
    const { name, value } = event.target;
    let updatedValue = value;
    let genderId = null;

    if (name === "gender") {
      genderId =
        value === "Male"
          ? "535d3b90-dc58-41e3-ad32-055e261bd6a7"
          : value === "Female"
          ? "3e4c6370-a72b-44e3-a5eb-8f459764158f"
          : null;

      if (genderId) {
        getCateByGender(genderId);
      }
    }

    setNewConsign((prevState) => ({
      ...prevState,
      fashionItemForConsigns: prevState.fashionItemForConsigns.map((item, i) =>
        i === index ? { ...item, [name]: updatedValue } : item
      ),
    }));
  };

  const handleFileChange = async (event, index) => {
    const files = event.target.files;
    const imagesArray = [];

    for (const file of files) {
      const fileRef = ref(storage, `images/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      imagesArray.push(url);
    }

    setNewConsign((prevState) => ({
      ...prevState,
      fashionItemForConsigns: prevState.fashionItemForConsigns.map((item, i) =>
        i === index
          ? { ...item, images: [...item.images, ...imagesArray].slice(0, 5) }
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
              images: item.images.filter((_, idx) => idx !== imgIndex),
            }
          : item
      ),
    }));
  };

  const handleAddItem = () => {
    if (newConsign.fashionItemForConsigns.length < 5) {
      setNewConsign((prevState) => ({
        ...prevState,
        fashionItemForConsigns: [
          ...prevState.fashionItemForConsigns,
          {
            name: "",
            note: "",
            description: "",
            confirmedPrice: 0,
            condition: 0,
            categoryId: "",
            color: "",
            brand: "",
            gender: "",
            images: [],
          },
        ],
      }));
    } else {
      showSnackBar("Maximum of 5 items allowed per consignment.", "info");
    }
  };

  const handleRemoveItem = (index) => {
    setNewConsign((prevState) => ({
      ...prevState,
      fashionItemForConsigns: prevState.fashionItemForConsigns.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const payload = {
        type: newConsign.type,
        consigner: newConsign.consigner,
        phone: newConsign.phone,
        address: newConsign.address,
        email: newConsign.email,
        fashionItemForConsigns: newConsign.fashionItemForConsigns.map(
          (item) => ({
            name: item.name,
            note: item.note,
            description: item.description,
            confirmedPrice: item.confirmedPrice,
            condition: item.condition,
            categoryId: item.categoryId,
            size: item.size,
            color: item.color,
            brand: item.brand,
            gender: item.gender,
            images: item.images,
          })
        ),
      };
      console.log(payload);
      await ApiService.createConsignByStaff(shopId, payload);
      showSnackBar("Consignment added successfully", "success");

      onAddSuccess();

      setNewConsign({
        type: "",
        consigner: "",
        phone: "",
        address: "",

        fashionItemForConsigns: [
          {
            name: "",
            note: "",
            description: "",
            confirmedPrice: 0,
            condition: 0,
            categoryId: "",
            size: "",
            color: "",
            brand: "",
            gender: "",
            images: [],
          },
        ],
      });
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error("Failed to add consignment:", error);

      showSnackBar(`Failed to add consignment:  ${error.message}`, "error");
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
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    label="Type"
                    name="type"
                    value={newConsign.type}
                    onChange={handleChange}
                  >
                    <MenuItem value="ConsignedForSale">
                      ConsignedForSale
                    </MenuItem>
                    <MenuItem value="ConsignedForAuction">
                      ConsignedForAuction
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Consigner"
                  name="consigner"
                  value={newConsign.consigner}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={newConsign.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={newConsign.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={newConsign.address}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle1" mt={2}>
              Fashion Items
            </Typography>
            {newConsign.fashionItemForConsigns.map((item, index) => (
              <Box key={index} mb={2} border={1} borderRadius={4} p={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleItemChange(e, index)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Note"
                      name="note"
                      value={item.note}
                      onChange={(e) => handleItemChange(e, index)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={item.description}
                      onChange={(e) => handleItemChange(e, index)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Confirmed Price"
                      name="confirmedPrice"
                      value={item.confirmedPrice}
                      onChange={(e) => handleItemChange(e, index)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">VND</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Condition"
                      name="condition"
                      value={item.condition}
                      onChange={(e) => handleItemChange(e, index)}
                      inputProps={{ maxLength: 3 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Size</InputLabel>
                      <Select
                        label="Size"
                        name="size"
                        value={item.size}
                        onChange={(e) => handleItemChange(e, index)}
                      >
                        <MenuItem value="XS">XS</MenuItem>
                        <MenuItem value="S">S</MenuItem>
                        <MenuItem value="M">M</MenuItem>
                        <MenuItem value="L">L</MenuItem>
                        <MenuItem value="XL">XL</MenuItem>
                        <MenuItem value="XXL">XXL</MenuItem>
                        <MenuItem value="XXXL">3XL</MenuItem>
                        <MenuItem value="XXXXL">4XL</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Color"
                      name="color"
                      value={item.color}
                      onChange={(e) => handleItemChange(e, index)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Brand"
                      name="brand"
                      value={item.brand}
                      onChange={(e) => handleItemChange(e, index)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      {!item.gender ? (
                        <InputLabel>Select gender first</InputLabel>
                      ) : (
                        <InputLabel>Category</InputLabel>
                      )}

                      <Select
                        label="Category"
                        name="categoryId"
                        value={item.categoryId}
                        onChange={(e) => handleItemChange(e, index)}
                        disabled={!item.gender}
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
                  <Grid item xs={12}>
                    <Button variant="contained" component="label">
                      Upload Images
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={(e) => handleFileChange(e, index)}
                      />
                    </Button>
                    <Box display="flex" flexWrap="wrap">
                      {item.images.map((img, imgIndex) => (
                        <Box key={imgIndex} position="relative" margin={1}>
                          <img
                            src={img}
                            alt="item"
                            style={{ width: 100, height: 100 }}
                          />
                          <IconButton
                            color="secondary"
                            onClick={() => handleRemoveImage(index, imgIndex)}
                            style={{ position: "absolute", top: 0, right: 0 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleRemoveItem(index)}
                      startIcon={<DeleteIcon />}
                    >
                      Remove Item
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddItem}
                disabled={newConsign.fashionItemForConsigns.length >= 5}
              >
                Add Another Item
              </Button>
            </Box>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit Consignment
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Modal>
  );
};

export default AddConsignment;

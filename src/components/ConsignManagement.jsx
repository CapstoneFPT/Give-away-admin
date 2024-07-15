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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  IconButton,
} from "@mui/material";
import { Add, Remove, AddCircleOutline } from "@mui/icons-material";
import ApiService from "../services/apiServices";

const ConsignManagement = () => {
  const [consignments, setConsignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [newConsign, setNewConsign] = useState({
    type: "ConsignedForSale",
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
        gender: "Male",
        image: [], // Assuming you want to keep `image` as the field name
      },
    ],
  });
  const shopId = localStorage.getItem("shopId");
  const navigate = useNavigate();
  const pageSize = 10;

  useEffect(() => {
    const fetchConsignments = async () => {
      setIsLoading(true);
      try {
        const data = await ApiService.getAllConsignments(
          shopId,
          page,
          pageSize
        );
        setConsignments(data.data.items);
        setTotalPage(data.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch consignments:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConsignments();
  }, [page, shopId]);

  const handleDetailClick = (consignSaleCode) => {
    navigate(`/consign/${consignSaleCode}`);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewConsign((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...newConsign.fashionItemForConsigns];
    updatedItems[index][name] = value;
    setNewConsign((prev) => ({
      ...prev,
      fashionItemForConsigns: updatedItems,
    }));
  };

  const handleFileChange = (e, index) => {
    const files = Array.from(e.target.files);
    const updatedItems = [...newConsign.fashionItemForConsigns];
    updatedItems[index].image = files.map((file) => URL.createObjectURL(file)); // Ensure `image` is updated correctly
    setNewConsign((prev) => ({
      ...prev,
      fashionItemForConsigns: updatedItems,
    }));
  };

  const handleAddItem = () => {
    setNewConsign((prev) => ({
      ...prev,
      fashionItemForConsigns: [
        ...prev.fashionItemForConsigns,
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
          gender: "Male",
          image: [], // Ensure `image` is initialized properly
        },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    setNewConsign((prev) => ({
      ...prev,
      fashionItemForConsigns: prev.fashionItemForConsigns.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      await ApiService.createConsignByStaff(shopId, newConsign);
      handleClose();
      const data = await ApiService.getAllConsignments(shopId, page, pageSize);
      setConsignments(data.data.items);
    } catch (error) {
      console.error("Failed to add consignment:", error.message);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
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
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Sold Price</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consignments.map((consign) => (
                <TableRow key={consign.consignSaleId}>
                  <TableCell>{consign.consignSaleCode}</TableCell>
                  <TableCell>
                    {new Date(consign.startDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(consign.endDate).toLocaleString()}
                  </TableCell>
                  <TableCell>{consign.status}</TableCell>
                  <TableCell>{consign.totalPrice}</TableCell>
                  <TableCell>{consign.soldPrice}</TableCell>
                  <TableCell>{consign.type}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDetailClick(consign.consignSaleCode)}
                      sx={{ marginRight: "10px" }}
                    >
                      Detail
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Consignment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the details to add a new consignment.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="recipientName"
            label="Recipient Name"
            type="text"
            fullWidth
            value={newConsign.recipientName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            value={newConsign.phone}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            value={newConsign.address}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={newConsign.email}
            onChange={handleChange}
          />
          {newConsign.fashionItemForConsigns.map((item, index) => (
            <Box key={index} mb={2} border={1} borderColor="grey.300" p={2}>
              <Typography variant="h6">Item {index + 1}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    name="name"
                    label="Item Name"
                    type="text"
                    fullWidth
                    value={item.name}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    name="note"
                    label="Note"
                    type="text"
                    fullWidth
                    value={item.note}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    name="value"
                    label="Value"
                    type="number"
                    fullWidth
                    value={item.value}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    name="dealPrice"
                    label="Deal Price"
                    type="number"
                    fullWidth
                    value={item.dealPrice}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    name="confirmedPrice"
                    label="Confirmed Price"
                    type="number"
                    fullWidth
                    value={item.confirmedPrice}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    name="condition"
                    label="Condition"
                    type="text"
                    fullWidth
                    value={item.condition}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    name="categoryId"
                    label="Category ID"
                    type="text"
                    fullWidth
                    value={item.categoryId}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    name="size"
                    label="Size"
                    type="text"
                    fullWidth
                    value={item.size}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    name="color"
                    label="Color"
                    type="text"
                    fullWidth
                    value={item.color}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    name="brand"
                    label="Brand"
                    type="text"
                    fullWidth
                    value={item.brand}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    name="gender"
                    label="Gender"
                    type="text"
                    fullWidth
                    value={item.gender}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <input
                    accept="image/*"
                    id={`image-upload-${index}`}
                    multiple
                    type="file"
                    onChange={(e) => handleFileChange(e, index)}
                    style={{ display: "none" }}
                  />
                  <label htmlFor={`image-upload-${index}`}>
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<AddCircleOutline />}
                    >
                      Add Image
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {item.image &&
                    item.image.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Item ${index + 1} ${i + 1}`}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    ))}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <Remove />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddItem}
            sx={{ mt: 2 }}
          >
            Add Item
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Add Consignment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsignManagement;

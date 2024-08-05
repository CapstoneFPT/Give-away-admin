import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../services/apiServices";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import Slider from "react-slick";
import { useSnackbar } from "../../services/SnackBar";

const ConsignDetail = () => {
  const { consignSaleId } = useParams();
  const [consignDetail, setConsignDetail] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [description, setDescription] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);
  const { showSnackBar } = useSnackbar();

  useEffect(() => {
    const fetchConsignDetail = async () => {
      try {
        const detailResponse = await ApiService.getOneBigConsignMent(
          consignSaleId
        );
        setConsignDetail(detailResponse);

        const itemsResponse = await ApiService.getListOfItemsByConsignId(
          consignSaleId
        );
        setItems(itemsResponse.data);
      } catch (error) {
        console.error("Failed to fetch consignment details:", error.message);
        showSnackBar(
          `Failed to fetch consignment details. +${error.message}`,
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsignDetail();
  }, [consignSaleId, showSnackBar]);

  const formatMoney = (num) => {
    return num.toLocaleString("vn", { minimumFractionDigits: 0 }) + " VND";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const formattedDate = date.toLocaleDateString(undefined, options);
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

    return `${formattedDate} ---- ${formattedTime}`;
  };

  const handleClickOpen = (item) => {
    setSelectedItem(item);
    setDescription("");
    setSellingPrice("");
    setOpen(true);
    getCateByGender();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleUpdate = async () => {
    if (selectedItem) {
      const updatedData = {
        sellingPrice: parseFloat(sellingPrice),
        categoryId: selectedCategory,
        description: description,
      };

      try {
        await ApiService.updateConsignForApprove(
          selectedItem.consignSaleDetailId,
          updatedData
        );

        handleClose();
        showSnackBar(`Update item successfully`, `success`);
      } catch (error) {
        console.error("Failed to update item details:", error.message);
        handleClose();
        showSnackBar(
          `Failed to update item details: + ${error.message}`,
          "error"
        );
      }
    }
  };

  const carouselSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  useEffect(() => {
    if (selectedItem) {
      const genderId =
        selectedItem.fashionItem.gender === "Male"
          ? "c7c0ba52-8406-47c1-9be5-497cbeea5933"
          : "8c3fe1f7-0082-4382-85de-6c70fcd76761";
      getCateByGender(genderId);
    }
  }, [selectedItem]);
  const getCateByGender = async (genderId) => {
    try {
      const response = await ApiService.getCategoryByGender(genderId);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };
  console.log(consignSaleId);

  const handleApproval = async (status) => {
    setIsLoading(true);
    try {
      await ApiService.updateConsignApproved(consignSaleId, { status });

      showSnackBar(
        `Successfully ${
          status === "AwaitDelivery" ? "approved" : "rejected"
        } consignment`,
        "success"
      );
      setIsLoading(false);
    } catch (error) {
      console.error(
        `Failed to ${
          status === "AwaitDelivery" ? "approve" : "reject"
        } consignment:`,
        error.message
      );
      console.log(status);

      showSnackBar(
        `Failed to ${
          status === "AwaitDelivery" ? "approve" : "reject"
        } consignment: ${error.message}`,
        "error"
      );
    }
  };
  useEffect(() => {
    const isValid =
      description.trim() && sellingPrice.trim() && selectedCategory.trim();
    setIsUpdateDisabled(!isValid);
  }, [description, sellingPrice, selectedCategory]);
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!consignDetail) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>No consignment details found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h6"
            style={{ fontSize: "30px", fontWeight: "bold" }}
          >
            Consignment Code: {consignDetail.data.consignSaleCode}
          </Typography>
          <Typography>
            <strong>Date of creation:</strong>{" "}
            {formatDate(consignDetail.data.createdDate)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="stretch">
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 3,
              flex: 1,
              mr: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" style={{ fontSize: "20px" }}>
              Consigner Information
            </Typography>
            <Typography>
              <strong>Consigner Name: </strong>
              {consignDetail.data.consginer}
            </Typography>
            <Typography>
              <strong>Consigner Phone: </strong>
              {consignDetail.data.phone}
            </Typography>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 3,
              flex: 1,
              mx: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" style={{ fontSize: "20px" }}>
              <strong>Total Price: </strong>{" "}
              {formatMoney(consignDetail.data.totalPrice)}
            </Typography>
            <Typography variant="h6" style={{ fontSize: "20px" }}>
              <strong>Money member received: </strong>
              {formatMoney(consignDetail.data.memberReceivedAmount)}
            </Typography>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 3,
              flex: 1,
              ml: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" style={{ fontSize: "20px" }}>
              <strong>Status:</strong> {consignDetail.data.status}
            </Typography>
            <Divider />
            {consignDetail.data.status === "Pending" && (
              <Box mt={2} justifyContent={"space-around"} display={"flex"}>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => handleApproval("AwaitDelivery")}
                  disabled={isLoading}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleApproval("Rejected")}
                  disabled={isLoading}
                >
                  Reject
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <h1>Consignment Items</h1>
        </Typography>
        <Typography>Total items: {items.length}</Typography>
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <h2>Image</h2>
              </TableCell>
              <TableCell>
                <h2>Name</h2>
              </TableCell>
              <TableCell>
                <h2>Condition</h2>
              </TableCell>
              <TableCell>
                <h2>Size</h2>
              </TableCell>
              <TableCell>
                <h2>Color</h2>
              </TableCell>
              <TableCell>
                <h2>Brand</h2>
              </TableCell>
              <TableCell>
                <h2>Gender</h2>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.consignSaleDetailId}
                onClick={() => handleClickOpen(item)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>
                  <Box maxWidth={100}>
                    <Slider {...carouselSettings}>
                      {item.fashionItem.images.length > 0 ? (
                        item.fashionItem.images
                          .slice(0, 3)
                          .map((image, index) => (
                            <Box
                              key={index}
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <img
                                src={image}
                                alt={`Item Image ${index}`}
                                style={{
                                  width: "100px",
                                  maxHeight: "200px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            </Box>
                          ))
                      ) : (
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          height="200px"
                        >
                          <Typography>No Images Available</Typography>
                        </Box>
                      )}
                    </Slider>
                  </Box>
                </TableCell>
                <TableCell>{item.fashionItem.name}</TableCell>
                <TableCell>{item.fashionItem.condition}</TableCell>
                <TableCell>{item.fashionItem.size}</TableCell>
                <TableCell>{item.fashionItem.color}</TableCell>
                <TableCell>{item.fashionItem.brand}</TableCell>
                <TableCell>{item.fashionItem.gender}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={6}>
                <strong>Total Price</strong>
              </TableCell>
              <TableCell>
                <strong>{formatMoney(consignDetail.data.totalPrice)}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      <Dialog style={{ overflow: "hidden" }} open={open} onClose={handleClose}>
        <Typography
          sx={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            fontSize: "30px",
          }}
        >
          Item Details{" "}
          <InfoOutlined sx={{ mt: 1.5, mr: 1, color: "primary.main" }} />
        </Typography>
        <DialogContent style={{ overflow: "hidden" }}>
          <Box>
            {selectedItem && (
              <Box>
                <Box maxWidth={"100%"}></Box>

                <Typography
                  style={{
                    color: "#10771A",
                    fontWeight: "bold",
                    fontSize: "30px",
                  }}
                >
                  Condition: {selectedItem.fashionItem.condition}
                </Typography>
                <Typography variant="h6">
                  <strong>Item Name:</strong> {selectedItem.fashionItem.name}
                </Typography>
                <Typography>
                  <strong>Size:</strong> {selectedItem.fashionItem.size}
                </Typography>
                <Typography>
                  <strong>Color:</strong> {selectedItem.fashionItem.color}
                </Typography>
                <Typography>
                  <strong>Brand:</strong> {selectedItem.fashionItem.brand}
                </Typography>
                <Typography>
                  <strong>Gender:</strong> {selectedItem.fashionItem.gender}
                </Typography>
                <Typography>
                  <strong>Description:</strong>{" "}
                  {selectedItem.fashionItem.description}
                </Typography>
                <Typography>
                  <strong>Selling price:</strong>{" "}
                  {formatMoney(selectedItem.confirmedPrice)}
                </Typography>
                <Typography>
                  <strong>Category:</strong>{" "}
                  {selectedItem.fashionItem.categoryName}
                </Typography>
              </Box>
            )}

            <Box>
              <Divider style={{ marginTop: "10px" }} />
              <Typography
                justifyContent={"center"}
                display={"flex"}
                fontSize={30}
              >
                <strong>Enter to update the item</strong>
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
              >
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  displayEmpty
                  variant="outlined"
                  margin="normal"
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Select Category
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  label="Description"
                  variant="outlined"
                  margin="dense"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Selling Price"
                  variant="outlined"
                  margin="dense "
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  fullWidth
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{
              width: "auto",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            color="primary"
          >
            Close
          </Button>
          <Button
            onClick={handleUpdate}
            style={{
              width: "auto",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsignDetail;

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
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

const ConsignDetail = () => {
  const { consignSaleId } = useParams();
  const [consignDetail, setConsignDetail] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  console.log(items);
  console.log(consignDetail);
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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    const fetchConsignDetail = async () => {
      try {
        const detailResponse = await ApiService.getOneBigConsignMents(
          consignSaleId
        );
        setConsignDetail(detailResponse);

        const itemsResponse = await ApiService.getListOfItemsByConsignId(
          consignSaleId
        );
        setItems(itemsResponse.data);
      } catch (error) {
        console.error("Failed to fetch consignment details:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsignDetail();
  }, [consignSaleId]);

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
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Gender</TableCell>
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
                  <img
                    src={item.fashionItem.images[0]}
                    alt={item.fashionItem.name}
                    width="100"
                  />
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

      <Dialog open={open} onClose={handleClose}>
        <Typography sx={{ fontWeight: "bold" }}>
          Item Details <InfoOutlined sx={{ mr: 1, color: "primary.main" }} />
        </Typography>
        <DialogContent>
          {selectedItem && (
            <Box>
              <img
                src={selectedItem.fashionItem.images[0]}
                alt={selectedItem.fashionItem.name}
                width="200"
              />
              <Typography
                style={{
                  color: "#10771A",
                  fontWeight: "bold",
                  fontSize: "30px",
                }}
              >
                Status: {selectedItem.fashionItem.condition}
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
                <strong>Condition:</strong> {selectedItem.fashionItem.condition}
                %
              </Typography>
              <Typography>
                <strong>Note:</strong> {selectedItem.fashionItem.note}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsignDetail;

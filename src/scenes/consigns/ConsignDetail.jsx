import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import ApiService from "../../services/apiServices";

const ConsignDetail = () => {
  const formatNumber = (num) => {
    return num.toLocaleString("vn", { minimumFractionDigits: 0 });
  };
  const { consignSaleCode } = useParams();
  const navigate = useNavigate();
  const [consignDetail, setConsignDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const shopId = localStorage.getItem("shopId");
  console.log(consignDetail);
  useEffect(() => {
    const fetchConsign = async () => {
      setIsLoading(true);
      try {
        const data = await ApiService.getConsignDetailByCode(
          shopId,
          consignSaleCode
        );
        setConsignDetail(data);
      } catch (error) {
        console.error("Failed to fetch consignment:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConsign();
  }, [shopId, consignSaleCode]);

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
      ) : consignDetail ? (
        <Box>
          <Typography variant="h4" gutterBottom>
            Consignment Detail
          </Typography>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">
              Consignment Code: {consignDetail.consignSaleCode}
            </Typography>
            <Typography variant="h6">
              Start Date: {new Date(consignDetail.startDate).toLocaleString()}
            </Typography>
            <Typography variant="h6">
              End Date: {new Date(consignDetail.endDate).toLocaleString()}
            </Typography>
            <Typography variant="h6">Status:{consignDetail.status}</Typography>
            <Typography variant="h6">
              Total Price: {formatNumber(consignDetail.totalPrice)} VND
            </Typography>
          </Paper>
          <Typography variant="h5" gutterBottom>
            Consignment Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {consignDetail.consignSaleDetails.map((detail) => (
              <Grid item xs={12} md={6} lg={4} key={detail.consignSaleDetailId}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6">
                    Item Name: {detail.itemName}
                  </Typography>
                  <Card sx={{ maxWidth: 300 }}>
                    <CardMedia component="img" height="auto" />
                    <CardContent>
                      <Typography>Condition: {detail.condition}</Typography>
                      <Typography>Status: {detail.status}</Typography>
                      <Typography>
                        Deal Price: {formatNumber(detail.dealPrice)} VND
                      </Typography>
                      <Typography>
                        Confirmed Price: ${detail.confirmedPrice}
                      </Typography>
                      <Typography>Category: {detail.categoryName}</Typography>
                      <Typography>Size: {detail.size}</Typography>
                      <Typography>Color: {detail.color}</Typography>
                      <Typography>Brand: {detail.brand}</Typography>
                      <Typography>Gender: {detail.gender}</Typography>
                      <Typography>Note: {detail.note}</Typography>
                    </CardContent>
                  </Card>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Typography variant="h6">Consignment not found</Typography>
      )}
    </Box>
  );
};

export default ConsignDetail;

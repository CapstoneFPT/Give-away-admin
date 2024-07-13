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
} from "@mui/material";
import ApiService from "../../services/apiServices";

const ConsignDetail = () => {
  const { consignSaleCode } = useParams();
  const navigate = useNavigate();
  const [consignDetail, setConsignDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const shopId = localStorage.getItem("shopId");

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
            <Typography variant="h6">Status: {consignDetail.status}</Typography>
            <Typography variant="h6">
              Total Price: ${consignDetail.totalPrice}
            </Typography>
            <Typography variant="h6">
              Sold Price: ${consignDetail.soldPrice}
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
                    Item Name: {detail.fashionItem.name}
                  </Typography>
                  <Typography>
                    Condition: {detail.fashionItem.condition}
                  </Typography>
                  <Typography>Status: {detail.fashionItem.status}</Typography>
                  <Typography>Deal Price: ${detail.dealPrice}</Typography>
                  <Typography>
                    Confirmed Price: ${detail.confirmedPrice}
                  </Typography>
                  <Typography>
                    Category: {detail.fashionItem.categoryName}
                  </Typography>
                  <Typography>Size: {detail.fashionItem.size}</Typography>
                  <Typography>Color: {detail.fashionItem.color}</Typography>
                  <Typography>Brand: {detail.fashionItem.brand}</Typography>
                  <Typography>Gender: {detail.fashionItem.gender}</Typography>
                  <Typography>Note: {detail.fashionItem.note}</Typography>
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

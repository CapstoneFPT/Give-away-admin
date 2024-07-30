// src/services/apiServices.jsx
import axios from "axios";

const URL = `https://giveawayproject.jettonetto.org:8443`;
const axiosInstance = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const ApiService = {
  approveAuctionByAdmin: async (auctionId) => {
    try {
      const response = await axiosInstance.put(
        `/api/auctions/${auctionId}/approve`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  rejectAuctionByAdmin: async (auctionId) => {
    try {
      const response = await axiosInstance.put(
        `/api/auctions/${auctionId}/reject`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  getAuction: async (searchTerm, page, pageSize) => {
    try {
      const response = await axiosInstance.get(
        `/api/auctions?SearchTerm=${searchTerm}&PageNumber=${page}&PageSize=${pageSize}&GetExpiredAuctions=true`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  updateRefundStatus: async (refundId, refundData) => {
    try {
      const response = await axiosInstance.put(
        `/api/refunds/${refundId}/approval`,
        refundData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  checkOutWithCash: async (shopId, orderId, amountGiven) => {
    try {
      const response = await axiosInstance.post(
        `/api/shops/${shopId}/orders/${orderId}/pay-with-cash`,
        amountGiven
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  updateOrderByStaff: async (orderId) => {
    try {
      const response = await axiosInstance.put(
        `/api/orders/${orderId}/confirm-deliveried`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  cancelOrderByStaff: async (orderId) => {
    try {
      const response = await axiosInstance.put(`/api/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getRefundByShopId: async (shopId, searchDate) => {
    try {
      const response = await axiosInstance.get(
        `/api/refunds?ShopId=${shopId}&PreviousTime=${searchDate}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  updateConsignStatus: async (consignSaleId, status) => {
    try {
      const response = await axiosInstance.put(
        `/api/consginsales/${consignSaleId}/approval?consignStatus=${status}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  updateConsignStatusToRecieved: async (consignSaleId) => {
    try {
      const response = await axiosInstance.put(
        `http://giveawayproject.jettonetto.org:8080/api/consginsales/${consignSaleId}/confirm-received`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  getCategoryByGender: async (genderId) => {
    try {
      const response = await axiosInstance.get(
        `/api/categories/condition?ParentId=${genderId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getOrderDetailbyShopId: async (orderId, shopId) => {
    try {
      const response = await axiosInstance.get(
        `api/orders/${orderId}/orderdetails?ShopId=${shopId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  createOrderbyStaff: async (shopId, orderData) => {
    try {
      const response = await axiosInstance.post(
        `/api/shops/${shopId}/orders`,
        orderData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  getOrder: async (page, pageSize, shopId, status, searchTerm) => {
    try {
      const response = await axiosInstance.get(
        `/api/orders?PageNumber=${page}&PageSize=${pageSize}&ShopId=${shopId}&Status=${status}&OrderCode=${searchTerm}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  getLeavesCategories: async () => {
    try {
      const response = await axiosInstance.get(
        `/api/categories/condition?Level=4`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  addItemByShopId: async (shopId, newItem) => {
    try {
      const response = await axiosInstance.post(
        `/api/shops/${shopId}/fashionitems`,
        newItem
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getAccountDetailById: async (accountId) => {
    try {
      const response = await axiosInstance.get(`/api/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  updateAccountStatus: async (accountId) => {
    try {
      const response = await axiosInstance.put(`/api/accounts/${accountId}/ban
`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  getAllAccounts: async (page, pageSize, phone) => {
    try {
      const response = await axiosInstance.get(
        `/api/accounts?Page=${page}&PageSize=${pageSize}&Phone=${phone}&Status=Active&Status=Inactive`
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  getAccountByPhone: async (phone) => {
    try {
      const response = await axiosInstance.get(
        `/api/accounts?Phone=${phone}&Status=Active&Role=Member`
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  authLogin: async (email, password) => {
    try {
      const response = await axiosInstance.post(`/api/auth/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  createConsignByStaff: async (shopId, payload) => {
    try {
      const response = await axiosInstance.post(
        `/api/shops/${shopId}/consignsales`,
        payload
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  updateItemStatus: async (itemId) => {
    try {
      const response = await axiosInstance.put(
        `/api/fashionitems/${itemId}/check-availability`
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  getItemForOrder: async (searchQuery, shopId) => {
    try {
      const response = await axiosInstance.get(
        `api/fashionitems?SearchTerm=${searchQuery}&Status=Available&Type=ItemBase&Type=ConsignedForSale&ShopId=${shopId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  getItemsByShopId: async (
    page,
    pageSize,
    status,
    searchQuery,
    type,
    shopId
  ) => {
    const response = await axiosInstance.get(
      `/api/fashionitems?PageNumber=${page}&PageSize=${pageSize}&Status=${status}&SearchTerm=${searchQuery}&Type=${type}&ShopId=${shopId}`
    );

    return response.data;
  },

  getAllConsignments: async (shopId, page, pageSize, status, searchTerm) => {
    try {
      const response = await axiosInstance.get(
        `/api/shops/${shopId}/consignsales?PageNumber=${page}&PageSize=${pageSize}&Status=${status}&ConsignSaleCode=${searchTerm}`
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  getConsignDetailByCode: async (shopId, ConsignSaleCode) => {
    try {
      const response = await axiosInstance.get(
        `/api/shops/${shopId}/consignsales?ConsignSaleCode=${ConsignSaleCode}`
      );
      return response.data.data.items[0];
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  createAuction: async (auctionData) => {
    try {
      const response = await axiosInstance.post(`/api/auctions`, auctionData);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};

export default ApiService;

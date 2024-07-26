// src/services/apiServices.jsx
import axios from "axios";

const URL = `http://giveawayproject.jettonetto.org:8080`;
const axiosInstance = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const ApiService = {
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
  getOrderByShopId: async (shopId, page, pageSize, status, searchTerm) => {
    try {
      const response = await axiosInstance.get(
        `/api/shops/${shopId}/orders?PageNumber=${page}&PageSize=${pageSize}&Status=${status}&OrderCode=${searchTerm}`
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
  getAllAccounts: async (page, pageSize, phone, searchQuery) => {
    try {
      const response = await axiosInstance.get(
        `/api/accounts?Page=${page}&PageSize=${pageSize}&Phone=${phone}&Status=Active&Status=Inactive&SearchTerm=${searchQuery}`
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  getAccountByPhone: async (phone) => {
    try {
      const response = await axiosInstance.get(
        `/api/accounts?Phone=${phone}&Status=Active`
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
  createConsignByStaff: async (shopId, consignmentData) => {
    try {
      const formData = new FormData();
      formData.append("type", consignmentData.type);
      formData.append("recipientName", consignmentData.recipientName);
      formData.append("phone", consignmentData.phone);
      formData.append("address", consignmentData.address);
      formData.append("email", consignmentData.email);

      consignmentData.fashionItemForConsigns.forEach((item, index) => {
        formData.append(`fashionItemForConsigns[${index}].name`, item.name);
        formData.append(`fashionItemForConsigns[${index}].note`, item.note);
        formData.append(`fashionItemForConsigns[${index}].value`, item.value);
        formData.append(
          `fashionItemForConsigns[${index}].dealPrice`,
          item.dealPrice
        );
        formData.append(
          `fashionItemForConsigns[${index}].confirmedPrice`,
          item.confirmedPrice
        );
        formData.append(
          `fashionItemForConsigns[${index}].condition`,
          item.condition
        );
        formData.append(
          `fashionItemForConsigns[${index}].categoryId`,
          item.categoryId
        );
        formData.append(`fashionItemForConsigns[${index}].size`, item.size);
        formData.append(`fashionItemForConsigns[${index}].color`, item.color);
        formData.append(`fashionItemForConsigns[${index}].brand`, item.brand);
        formData.append(`fashionItemForConsigns[${index}].gender`, item.gender);

        item.image.forEach((image, imgIndex) => {
          formData.append(
            `fashionItemForConsigns[${index}].image[${imgIndex}]`,
            image
          );
        });
      });

      const response = await axiosInstance.post(
        `/api/shops/${shopId}/consignsales`,
        formData
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
      console.log(response);
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

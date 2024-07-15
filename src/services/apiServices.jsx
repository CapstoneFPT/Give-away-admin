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
  getAllAccounts: async (page, pageSize, searchQuery) => {
    try {
      const response = await axiosInstance.get(
        `/api/accounts?Page=${page}&PageSize=${pageSize}&Status=Active&Status=Inactive&SearchTerm=${searchQuery}`
      );
      console.log(response);
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

  getItemsByShopId: async (shopId, page, pageSize, searchQuery) => {
    const response = await axiosInstance.get(
      `/api/fashionitems?PageNumber=${page}&PageSize=${pageSize}&SearchTerm=${searchQuery}&Status=Available&Status=Unavailable&ShopId=${shopId}`
    );

    return response.data;
  },
  getAunctionItemById: async (shopId, page, pageSize, status, searchQuery) => {
    const response = await axiosInstance.get(
      `/api/fashionitems?PageNumber=${page}&PageSize=${pageSize}&SearchTerm=${searchQuery}&Status=${status}&Type=ConsignedForAuction&ShopId${shopId}`
    );

    return response.data;
  },
  getAllConsignments: async (shopId, page, pageSize) => {
    try {
      const response = await axiosInstance.get(
        `/api/shops/${shopId}/consignsales?PageNumber=${page}&PageSize=${pageSize}`
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

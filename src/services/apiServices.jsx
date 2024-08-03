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
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  rejectAuctionByAdmin: async (auctionId) => {
    try {
      const response = await axiosInstance.put(
        `/api/auctions/${auctionId}/reject`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getAuction: async (searchTerm, page, pageSize) => {
    try {
      const response = await axiosInstance.get(
        `/api/auctions?SearchTerm=${searchTerm}&PageNumber=${page}&PageSize=${pageSize}&GetExpiredAuctions=true`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  confirmRefundStatus: async (refundId) => {
    try {
      const response = await axiosInstance.put(
        `/api/refunds/${refundId}/confirm-received-and-refund`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
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
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
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
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  confirmOrder: async (orderId) => {
    try {
      const response = await axiosInstance.put(
        `/api/orders/${orderId}/confirm-pending-order`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  updateOrderByStaff: async (orderId) => {
    try {
      const response = await axiosInstance.put(
        `/api/orders/${orderId}/confirm-deliveried`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  cancelOrderByStaff: async (orderId) => {
    try {
      const response = await axiosInstance.put(`/api/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  getRefundByShopId: async (shopId, searchDate) => {
    try {
      const response = await axiosInstance.get(
        `/api/refunds?ShopId=${shopId}&PreviousTime=${searchDate}`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getAllRefunds: async (searchDate) => {
    try {
      const response = await axiosInstance.get(
        `/api/refunds?PreviousTime=${searchDate}`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  getCategoryByGender: async (genderId) => {
    try {
      const response = await axiosInstance.get(
        `/api/categories/condition?ParentId=${genderId}`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  getOrderDetailbyShopId: async (orderId, shopId) => {
    try {
      const response = await axiosInstance.get(
        `api/orders/${orderId}/orderdetails?ShopId=${shopId}`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
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
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getOrderByShopId: async (shopId, page, pageSize, status, searchTerm) => {
    try {
      const response = await axiosInstance.get(
        `/api/orders?ShopId=${shopId}&PageNumber=${page}&PageSize=${pageSize}&Status=${status}&OrderCode=${searchTerm}`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getOneOrder: async (orderCode) => {
    try {
      const response = await axiosInstance.get(
        `/api/orders?OrderCode=${orderCode}`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getOrderByAdmin: async (page, pageSize, status, searchTerm) => {
    try {
      const response = await axiosInstance.get(
        `/api/orders?&PageNumber=${page}&PageSize=${pageSize}&Status=${status}&OrderCode=${searchTerm}`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getLeavesCategories: async () => {
    try {
      const response = await axiosInstance.get(
        `/api/categories/condition?Level=4`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
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
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getItemForOrder: async (searchQuery, shopId) => {
    try {
      const response = await axiosInstance.get(
        `api/fashionitems?SearchTerm=${searchQuery}&Status=Available&Type=ItemBase&Type=ConsignedForSale&ShopId=${shopId}`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
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
  updateItemStatus: async (itemId) => {
    try {
      const response = await axiosInstance.put(
        `/api/fashionitems/${itemId}/check-availability`
      );

      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getAccountDetailById: async (accountId) => {
    try {
      const response = await axiosInstance.get(`/api/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  updateAccountStatus: async (accountId) => {
    try {
      const response = await axiosInstance.put(`/api/accounts/${accountId}/ban
`);
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getAllAccounts: async (page, pageSize, phone, status) => {
    try {
      const response = await axiosInstance.get(
        `/api/accounts?Page=${page}&PageSize=${pageSize}&Phone=${phone}&Status=${status}`
      );

      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getAccountByPhone: async (phone) => {
    try {
      const response = await axiosInstance.get(
        `/api/accounts?Phone=${phone}&Status=Active&Role=Member`
      );

      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
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
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
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
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  updateConsignApproved: async (consignSaleId, status) => {
    try {
      const response = await axiosInstance.put(
        `/api/consginsales/${consignSaleId}/approval`,
        status
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  updateConsignForApprove: async (consignSaleDetailId, updateData) => {
    try {
      const response = await axiosInstance.put(
        `/api/consginsales/consignsaledetails/${consignSaleDetailId}/update-for-approve`,
        updateData
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  updateConsignStatus: async (consignSaleId, status) => {
    try {
      const response = await axiosInstance.put(
        `/api/consginsales/${consignSaleId}/approval?consignStatus=${status}`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  updateConsignStatusToRecieved: async (consignSaleId) => {
    try {
      const response = await axiosInstance.put(
        `/api/consginsales/${consignSaleId}/confirm-received`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  getListOfItemsByConsignId: async (consignSaleId) => {
    try {
      const response = await axiosInstance.get(
        `/api/consginsales/${consignSaleId}/consignsaledetails`
      );
      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getOneBigConsignMents: async (consignSaleId) => {
    try {
      const response = await axiosInstance.get(
        `/api/consginsales/${consignSaleId}`
      );

      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getAllConsignments: async (shopId, page, pageSize, status, searchTerm) => {
    try {
      const response = await axiosInstance.get(
        `/api/shops/${shopId}/consignsales?PageNumber=${page}&PageSize=${pageSize}&Status=${status}&ConsignSaleCode=${searchTerm}`
      );

      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getConsignmentsByBothDate: async (
    shopId,
    page,
    pageSize,
    status,
    startDate,
    endDate,
    searchTerm
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/shops/${shopId}/consignsales?PageNumber=${page}&PageSize=${pageSize}&Status=${status}&StartDate=${startDate}&EndDate=${endDate}&ConsignSaleCode=${searchTerm}`
      );

      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getConsignmentsByEndDate: async (
    shopId,
    page,
    pageSize,
    status,
    endDate,
    searchTerm
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/shops/${shopId}/consignsales?PageNumber=${page}&PageSize=${pageSize}&Status=${status}&EndDate=${endDate}&ConsignSaleCode=${searchTerm}`
      );

      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  getConsignmentsByStartDate: async (
    shopId,
    page,
    pageSize,
    status,
    startDate,
    searchTerm
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/shops/${shopId}/consignsales?PageNumber=${page}&PageSize=${pageSize}&Status=${status}&StartDate=${startDate}&ConsignSaleCode=${searchTerm}`
      );

      return response.data;
    } catch (error) {
      // Handle and format the error message
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  createAuction: async (auctionData) => {
    try {
      const response = await axiosInstance.post(`/api/auctions`, auctionData);

      return response.data;
    } catch (error) {
      let errorMessage = "An unknown error occurred.";

      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.title) {
          errorMessage = data.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
};

export default ApiService;

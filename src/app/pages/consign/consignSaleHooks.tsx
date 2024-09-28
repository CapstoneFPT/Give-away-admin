import { useQuery } from "react-query";
import {
  ConsignSaleApi,
  ConsignSaleDetailedResponse,
  ConsignSaleLineItemsListResponse,
} from "../../../api";

const consignSaleApi = new ConsignSaleApi();

export const useConsignSale = (consignSaleId: string) => {
  return useQuery<ConsignSaleDetailedResponse, Error>(
    ["consignSale", consignSaleId],
    async () => {
      const response = await consignSaleApi.apiConsignsalesConsignSaleIdGet(consignSaleId);
      return response.data;
    },
    {
      enabled: !!consignSaleId,
    }
  );
};

export const useConsignSaleLineItems = (consignSaleId: string) => {
  return useQuery<ConsignSaleLineItemsListResponse[], Error>(
    ["consignSaleLineItems", consignSaleId],
    async () => {
      const response = await consignSaleApi.apiConsignsalesConsignsaleIdConsignlineitemsGet(consignSaleId);
      return response.data;
    },
    {
      enabled: !!consignSaleId,
    }
  );
};

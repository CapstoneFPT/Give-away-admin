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
    () =>
      consignSaleApi
        .apiConsignsalesConsignSaleIdGet(consignSaleId)
        .then((response) => {
          return response.data;
        }),
    {
      enabled: !!consignSaleId,
    }
  );
};

export const useConsignSaleLineItems = (consignSaleId: string) => {
  return useQuery<ConsignSaleLineItemsListResponse[], Error>(
    ["consignSaleLineItems", consignSaleId],
    () =>
      consignSaleApi
        .apiConsignsalesConsignsaleIdConsignlineitemsGet(consignSaleId)
        .then((response) => {
          return response.data;
        }),
    {
      enabled: !!consignSaleId,
    }
  );
};

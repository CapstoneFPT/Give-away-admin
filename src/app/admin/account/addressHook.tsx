import { useQuery } from "react-query";
import {
  AddressApi,
  GHNProvinceResponse,
  GHNDistrictResponse,
  GHNWardResponse,
} from "../../../api";

const addressApi = new AddressApi();

export const useProvinces = () => {
  return useQuery<GHNProvinceResponse[], Error>({
    queryKey: ["provinces"],
    queryFn: async () => {
      const response = await addressApi.apiAddressesProvincesGet();
      return response.data.data || [];
    },
  });
};

export const useDistricts = (provinceId: number | undefined) => {
  return useQuery<GHNDistrictResponse[], Error>({
    queryKey: ["districts", provinceId],
    queryFn: async () => {
      if (!provinceId) return [];
      const response = await addressApi.apiAddressesDistrictsGet(provinceId);
      return response.data.data || [];
    },
    enabled: !!provinceId,
  });
};

export const useWards = (districtId: number | undefined) => {
  return useQuery<GHNWardResponse[], Error>({
    queryKey: ["wards", districtId],
    queryFn: async () => {
      if (!districtId) return [];
      const response = await addressApi.apiAddressesWardsGet(districtId);
      return response.data.data || [];
    },
    enabled: !!districtId,
  });
};

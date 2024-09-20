import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { ShopApi } from "../../../api";
import { showAlert } from "../../../utils/Alert";
import { CreateShopRequest } from "../../../api";
import { useProvinces, useDistricts, useWards } from "./addressHook";
import { ChangeEvent } from "react";

interface CreateShopModalProps {
  show: boolean;
  onHide: () => void;
  staffId: string | null;
}

const CreateShopModal: React.FC<CreateShopModalProps> = ({
  show,
  onHide,
  staffId,
}) => {
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    wardCode: "",
    districtId: 0,
    provinceId: 0,
  });

  const [selectedProvinceId, setSelectedProvinceId] = useState<
    number | undefined
  >(undefined);
  const [selectedDistrictId, setSelectedDistrictId] = useState<
    number | undefined
  >(undefined);

  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const { data: districts, isLoading: isLoadingDistricts } =
    useDistricts(selectedProvinceId);
  const { data: wards, isLoading: isLoadingWards } =
    useWards(selectedDistrictId);

  const queryClient = useQueryClient();

  const createShopMutation = useMutation(
    (data: CreateShopRequest) => {
      const shopApi = new ShopApi();
      return shopApi.apiShopsPost(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["accounts"]);
        showAlert("success", "Shop created successfully");
        onHide();
        setFormData({
          phone: "",
          address: "",
          wardCode: "",
          districtId: 0,
          provinceId: 0,
        });
      },
      onError: (error) => {
        showAlert(
          "error",
          "Failed to create shop: " + (error as Error).message
        );
      },
    }
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      provinceId: value,
      districtId: 0,
      wardCode: "",
    }));
    setSelectedProvinceId(value);
    setSelectedDistrictId(undefined);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setFormData((prev) => ({ ...prev, districtId: value, wardCode: "" }));
    setSelectedDistrictId(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffId) {
      createShopMutation.mutate({ ...formData, staffId });
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create Shop</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Shop Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Province</Form.Label>
            <Form.Select
              name="provinceId"
              value={formData.provinceId}
              onChange={handleProvinceChange}
              disabled={isLoadingProvinces}
              required
            >
              <option value="">Select Province</option>
              {provinces?.map((province) => (
                <option key={province.provinceId} value={province.provinceId}>
                  {province.provinceName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>District</Form.Label>
            <Form.Select
              name="districtId"
              value={formData.districtId}
              onChange={handleDistrictChange}
              disabled={isLoadingDistricts || !selectedProvinceId}
              required
            >
              <option value="">Select District</option>
              {districts?.map((district) => (
                <option key={district.districtId} value={district.districtId}>
                  {district.districtName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ward</Form.Label>
            <Form.Select
              name="wardCode"
              value={formData.wardCode}
              onChange={handleChange}
              disabled={isLoadingWards || !selectedDistrictId}
              required
            >
              <option value="">Select Ward</option>
              {wards?.map((ward) => (
                <option key={ward.wardCode} value={ward.wardCode}>
                  {ward.wardName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address Detail</Form.Label>
            <Form.Control
              as="textarea"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            disabled={createShopMutation.isLoading}
          >
            {createShopMutation.isLoading ? "Creating..." : "Create Shop"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateShopModal;

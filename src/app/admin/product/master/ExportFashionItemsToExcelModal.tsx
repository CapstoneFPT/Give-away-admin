import React, { useState } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { FashionItemApi, FashionItemStatus, FashionItemType, ShopApi } from "../../../../api";
import { useQuery } from "react-query";
import { useAuth } from "../../../modules/auth";

type ExportFashionItemsToExcelModalProps = {
  show: boolean;
  onHide: () => void;
  onExport: (filters: any) => void;
};

const ExportFashionItemsToExcelModal: React.FC<ExportFashionItemsToExcelModalProps> = ({ show, onHide, onExport }) => {
  const { currentUser } = useAuth();
  const [filters, setFilters] = useState<{
    itemCode: string;
    shopId: string;
    status: FashionItemStatus[];
    type: FashionItemType[];
    minPrice: string;
    maxPrice: string;
  }>({
    itemCode: "",
    shopId: currentUser?.shopId || "",
    status: [],
    type: [],
    minPrice: "",
    maxPrice: "",
  });

  const { data: shops, isLoading: isLoadingShops } = useQuery(
    "shops",
    async () => {
      if (currentUser?.role !== "Admin") return [];
      const shopApi = new ShopApi();
      const response = await shopApi.apiShopsGet();
      return response.data.data || [];
    },
    { enabled: currentUser?.role === "Admin" }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setFilters((prev) => ({ ...prev, [name]: selectedValues }));
  };

  const handleExport = () => {
    onExport(filters);
    onHide();
  };

  if(isLoadingShops) {
    return <div>Loading...</div>;
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Export Fashion Items to Excel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group controlId="itemCode">
                <Form.Label>Item Code</Form.Label>
                <Form.Control
                  type="text"
                  name="itemCode"
                  value={filters.itemCode}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
            {currentUser?.role === "Admin" && (
              <Col md={6}>
                <Form.Group controlId="shopId">
                  <Form.Label>Shop</Form.Label>
                  <Form.Control
                    as="select"
                    name="shopId"
                    value={filters.shopId}
                    onChange={handleChange as any}
                  >
                    <option value="">All Shops</option>
                    {(!isLoadingShops && shops) && shops.map((shop: any) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.address}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            )}
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  name="status"
                  value={filters.status}
                  onChange={handleMultiSelectChange as any}
                >
                  {Object.values(FashionItemStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  name="type"
                  value={filters.type}
                  onChange={handleMultiSelectChange as any}
                >
                  {Object.values(FashionItemType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="minPrice">
                <Form.Label>Min Price</Form.Label>
                <Form.Control
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="maxPrice">
                <Form.Label>Max Price</Form.Label>
                <Form.Control
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleExport}>
          Export
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportFashionItemsToExcelModal;
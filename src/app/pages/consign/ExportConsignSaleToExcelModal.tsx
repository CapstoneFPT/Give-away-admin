import React, { useState } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { ConsignSaleStatus, ConsignSaleType, ConsignSaleMethod, ShopApi } from "../../../api";
import { useQuery } from "react-query";
import { useAuth } from "../../modules/auth";

type ExportConsignSaleToExcelModalProps = {
  show: boolean;
  onHide: () => void;
  onExport: (filters: any) => void;
};

const ExportConsignSaleToExcelModal: React.FC<ExportConsignSaleToExcelModalProps> = ({ show, onHide, onExport }) => {
  const { currentUser } = useAuth();
  const [filters, setFilters] = useState<{
    startDate: string;
    endDate: string;
    consignSaleCode: string;
    memberName: string;
    phone: string;
    email: string;
    shopId: string;
    statuses: ConsignSaleStatus[];
    types: ConsignSaleType[];
    consignSaleMethods: ConsignSaleMethod[];
  }>({
    startDate: "",
    endDate: "",
    consignSaleCode: "",
    memberName: "",
    phone: "",
    email: "",
    shopId: "",
    statuses: [],
    types: [],
    consignSaleMethods: [],
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

  if (isLoadingShops) {
    return <div>Loading...</div>;
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Export Consignments to Excel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="consignSaleCode">
                <Form.Label>Consign Sale Code</Form.Label>
                <Form.Control
                  type="text"
                  name="consignSaleCode"
                  value={filters.consignSaleCode}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="memberName">
                <Form.Label>Member Name</Form.Label>
                <Form.Control
                  type="text"
                  name="memberName"
                  value={filters.memberName}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={filters.phone}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={filters.email}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="statuses">
                <Form.Label>Statuses</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  name="statuses"
                  value={filters.statuses}
                  onChange={handleMultiSelectChange as any}
                >
                  {Object.values(ConsignSaleStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="types">
                <Form.Label>Types</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  name="types"
                  value={filters.types}
                  onChange={handleMultiSelectChange as any}
                >
                  {Object.values(ConsignSaleType).map((type) => (
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
              <Form.Group controlId="consignSaleMethods">
                <Form.Label>Consign Sale Methods</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  name="consignSaleMethods"
                  value={filters.consignSaleMethods}
                  onChange={handleMultiSelectChange as any}
                >
                  {Object.values(ConsignSaleMethod).map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </Form.Control>
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
                    {shops?.map((shop: any) => (
                      <option key={shop.shopId} value={shop.shopId}>
                        {shop.address}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            )}
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

export default ExportConsignSaleToExcelModal;
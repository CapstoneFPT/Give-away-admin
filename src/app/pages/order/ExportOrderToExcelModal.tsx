import React, { useState } from "react";
import { Modal, Button, Form, Col, Row, FormControlProps } from "react-bootstrap";
import { PaymentMethod, PurchaseType, OrderStatus, AddressType, ShopApi } from "../../../api";
import { useQuery } from "react-query";


type ExportOrderToExcelModalProps = {
  show: boolean;
  onHide: () => void;
  onExport: (filters: any) => void;
  isAdmin: boolean;
};

const ExportOrderToExcelModal: React.FC<ExportOrderToExcelModalProps> = ({ show, onHide, onExport, isAdmin }) => {
  const [filters, setFilters] = useState<{
    startDate: string;
    endDate: string;
    orderCode: string;
    recipientName: string;
    phone: string;
    shopId: string;
    minTotalPrice: string;
    maxTotalPrice: string;
    paymentMethods: PaymentMethod[];
    purchaseTypes: PurchaseType[];
    statuses: OrderStatus[];
  }>({
    startDate: "",
    endDate: "",
    orderCode: "",
    recipientName: "",
    phone: "",
    minTotalPrice: "",
    maxTotalPrice: "",
    shopId: "",
    paymentMethods: [],
    purchaseTypes: [],
    statuses: [],
  });
  
  const { data: shops } = useQuery(
    "shops",
    async () => {
      if (!isAdmin) return null;
      const shopApi = new ShopApi();
      const response = await shopApi.apiShopsGet();
      return response.data.data;
    },
    { enabled: isAdmin }
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Export Orders to Excel</Modal.Title>
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="orderCode">
                <Form.Label>Order Code</Form.Label>
                <Form.Control
                  type="text"
                  name="orderCode"
                  value={filters.orderCode}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="recipientName">
                <Form.Label>Recipient Name</Form.Label>
                <Form.Control
                  type="text"
                  name="recipientName"
                  value={filters.recipientName}
                  onChange={handleChange}
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
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="minTotalPrice">
                <Form.Label>Min Total Price</Form.Label>
                <Form.Control
                  type="number"
                  name="minTotalPrice"
                  value={filters.minTotalPrice}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="maxTotalPrice">
                <Form.Label>Max Total Price</Form.Label>
                <Form.Control
                  type="number"
                  name="maxTotalPrice"
                  value={filters.maxTotalPrice}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="paymentMethods">
                <Form.Label>Payment Methods</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  name="paymentMethods"
                  value={filters.paymentMethods}
                  onChange={handleMultiSelectChange as any}
                >
                  {Object.values(PaymentMethod).map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="purchaseTypes">
                <Form.Label>Purchase Types</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  name="purchaseTypes"
                  value={filters.purchaseTypes}
                  onChange={handleMultiSelectChange as any}
                >
                  {Object.values(PurchaseType).map((type) => (
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
              <Form.Group controlId="statuses">
                <Form.Label>Statuses</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  name="statuses"
                  value={filters.statuses}
                  onChange={handleMultiSelectChange as any}
                >
                  {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          {isAdmin && (
            <Row>
              <Col md={6}>
                <Form.Group controlId="shopId">
                  <Form.Label>Shop</Form.Label>
                  <Form.Control
                    as="select"
                    name="shopId"
                    value={filters.shopId}
                    onChange={handleChange}
                  >
                    <option value="">All Shops</option>
                    {shops?.map((shop: any) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.address}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          )}
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

export default ExportOrderToExcelModal;
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

type ExportOrderToExcelModalProps = {
  show: boolean;
  onHide: () => void;
  onExport: (filters: any) => void;
};

const ExportOrderToExcelModal: React.FC<ExportOrderToExcelModalProps> = ({ show, onHide, onExport }) => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    orderCode: "",
    recipientName: "",
    phone: "",
    minTotalPrice: "",
    maxTotalPrice: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleExport = () => {
    onExport(filters);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Export Orders to Excel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="orderCode">
            <Form.Label>Order Code</Form.Label>
            <Form.Control
              type="text"
              name="orderCode"
              value={filters.orderCode}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="recipientName">
            <Form.Label>Recipient Name</Form.Label>
            <Form.Control
              type="text"
              name="recipientName"
              value={filters.recipientName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={filters.phone}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="minTotalPrice">
            <Form.Label>Min Total Price</Form.Label>
            <Form.Control
              type="number"
              name="minTotalPrice"
              value={filters.minTotalPrice}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="maxTotalPrice">
            <Form.Label>Max Total Price</Form.Label>
            <Form.Control
              type="number"
              name="maxTotalPrice"
              value={filters.maxTotalPrice}
              onChange={handleChange}
            />
          </Form.Group>
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
import React, { useState } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { TransactionType, PaymentMethod, ShopApi } from '../../../api';
import { useAuth } from '../../modules/auth';
import { useQuery } from 'react-query';

type ExportTransactionToExcelModalProps = {
  show: boolean;
  onHide: () => void;
  onExport: (filters: any) => void;
};

const ExportTransactionToExcelModal: React.FC<ExportTransactionToExcelModalProps> = ({ show, onHide, onExport }) => {
  const { currentUser } = useAuth();
  const [filters, setFilters] = useState<{
    startDate: string;
    endDate: string;
    types: TransactionType[];
    paymentMethods: PaymentMethod[];
    minAmount: string;
    maxAmount: string;
    senderName: string;
    receiverName: string;
    transactionCode: string;
    shopId: string;
  }>({
    startDate: '',
    endDate: '',
    types: [],
    paymentMethods: [],
    minAmount: '',
    maxAmount: '',
    senderName: '',
    receiverName: '',
    transactionCode: '',
    shopId: currentUser?.shopId || '',
  });

  const shopApi = new ShopApi();
  const { data: shops, isLoading: isLoadingShops } = useQuery('shops', async () => {
    const response = await shopApi.apiShopsGet();
    return response.data.data || [];
  });

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
    const exportFilters = { ...filters };
    if (currentUser?.role !== 'Admin') {
      exportFilters.shopId = currentUser?.shopId || '';
    }
    onExport(exportFilters);
    onHide();
  };

  if(isLoadingShops) {
    return <div>Loading...</div>;
  }

  console.log(shops)

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Export Transactions to Excel</Modal.Title>
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
              <Form.Group controlId="types">
                <Form.Label>Transaction Types</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  name="types"
                  value={filters.types}
                  onChange={handleMultiSelectChange as any}
                >
                  {Object.values(TransactionType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
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
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="minAmount">
                <Form.Label>Min Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="maxAmount">
                <Form.Label>Max Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="senderName">
                <Form.Label>Sender Name</Form.Label>
                <Form.Control
                  type="text"
                  name="senderName"
                  value={filters.senderName}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="receiverName">
                <Form.Label>Receiver Name</Form.Label>
                <Form.Control
                  type="text"
                  name="receiverName"
                  value={filters.receiverName}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="transactionCode">
                <Form.Label>Transaction Code</Form.Label>
                <Form.Control
                  type="text"
                  name="transactionCode"
                  value={filters.transactionCode}
                  onChange={handleChange as any}
                />
              </Form.Group>
            </Col>
          </Row>
          {currentUser?.role === 'Admin' && (
            <Row>
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
                    {(!isLoadingShops && shops) && shops.map((shop) => (
                      <option key={shop.shopId} value={shop.shopId}>
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

export default ExportTransactionToExcelModal;
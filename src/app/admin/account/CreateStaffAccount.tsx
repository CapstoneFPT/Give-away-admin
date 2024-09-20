import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AuthApi } from "../../../api";
import { useMutation, useQueryClient } from "react-query";
import { showAlert } from "../../../utils/Alert";
import { AxiosError } from "axios";
import { CreateStaffAccountRequest } from "../../../api";
interface CreateStaffModalProps {
  show: boolean;
  onHide: () => void;
}

const CreateStaffModal: React.FC<CreateStaffModalProps> = ({
  show,
  onHide,
}) => {
  const [formData, setFormData] = useState<CreateStaffAccountRequest>({
    email: "",
    fullname: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const queryClient = useQueryClient();

  const createStaffMutation = useMutation(
    (staffData: typeof formData) => {
      const accountApi = new AuthApi();
      return accountApi.apiAuthCreateStaffAccountPost(staffData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["accounts"]);
        onHide();
        showAlert("success", "Staff account created successfully");
        setFormData({
          email: "",
          fullname: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
      },
      onError: (error: AxiosError) => {
        showAlert("error", "Failed to create staff account" + error.message);
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStaffMutation.mutate(formData);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create Staff Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={createStaffMutation.isLoading}
          >
            {createStaffMutation.isLoading
              ? "Creating..."
              : "Create Staff Account"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateStaffModal;

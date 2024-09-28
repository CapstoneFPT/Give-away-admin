import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { KTIcon } from "../../../../_metronic/helpers";
import {
  UpdateMasterItemRequest,
  MasterItemApi,
  CategoryApi,
  Category,
  MasterItemDetailResponse,
} from "../../../../api";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseconfig";
import { showAlert } from "../../../../utils/Alert";
import { useMutation, useQueryClient } from "react-query";

interface UpdateMasterItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: UpdateMasterItemRequest) => void;
  initialData: MasterItemDetailResponse;
  masterItemId: string;
}

const UpdateMasterItemModal: React.FC<UpdateMasterItemModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  initialData,
  masterItemId,
}) => {
  const [formData, setFormData] = useState<UpdateMasterItemRequest>({
    name: "",
    brand: "",
    description: "",
    categoryId: "",
    gender: "Male",
    imageRequests: [],
  });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        brand: initialData.brand || "",
        description: initialData.description || "",
        categoryId: initialData.categoryId || "",
        gender: initialData.gender || "Male",
        imageRequests: initialData.images
          ? initialData.images.map((img) => img.imageUrl || "")
          : [],
      });
      setImages(
        initialData.images
          ? initialData.images.map((img) => img.imageUrl || "")
          : []
      );
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (formData.gender) {
        try {
          const categoryApi = new CategoryApi();
          const response = await categoryApi.apiCategoriesConditionGet(
            null!,
            null!,
            formData.gender === "Male"
              ? "550e8400-e29b-41d4-a716-446655440000"
              : "550e8400-e29b-41d4-a716-446655440001",
            4,
            "Available"
          );

          setCategories(response.data.data || []);
        } catch (error) {
          showAlert("error", `Error fetching categories: ${error}`);
        }
      } else {
        setCategories([]);
      }
    };
    fetchCategories();
  }, [formData.gender]);

  const updateMutation = useMutation(
    (data: UpdateMasterItemRequest) =>
      new MasterItemApi().apiMasterItemsMasteritemIdUpdateMasteritemPut(
        masterItemId,
        data
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["masterItemDetail", masterItemId]);
        showAlert("success", "Master item updated successfully");
        onClose();
        onUpdate(formData);
      },
      onError: (error) => {
        console.error("Error updating master item:", error);
        showAlert("error", "Failed to update master item");
      },
    }
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setLoading(true);
      try {
        const newImages = [...images];
        for (const file of acceptedFiles) {
          if (newImages.length < 3) {
            const storageRef = ref(storage, `images/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            newImages.push(downloadURL);
          }
        }
        setImages(newImages);
        setFormData((prev) => ({ ...prev, imageRequests: newImages }));
      } catch (error) {
        console.error("Error uploading files:", error);
        showAlert("error", "Failed to upload images");
      } finally {
        setLoading(false);
      }
    },
    [images]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
    },
    maxFiles: 1 - images.length,
  });

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setFormData((prev) => ({ ...prev, imageRequests: newImages }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Master Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="brand" className="form-label">
              Brand
            </label>
            <input
              type="text"
              className="form-control"
              id="brand"
              name="brand"
              value={formData.brand || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <select
              className="form-select"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="categoryId" className="form-label">
              Category
            </label>
            <select
              className="form-select"
              id="categoryId"
              name="categoryId"
              value={formData.categoryId || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Images (Max 3)</label>
            <div className="d-flex flex-wrap gap-3 mb-3">
              {images.map((imageUrl, index) => (
                <div key={index} className="position-relative">
                  <img
                    src={imageUrl}
                    alt={`Uploaded ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    onClick={() => handleRemoveImage(index)}
                    disabled={loading || updateMutation.isLoading}
                  >
                    <KTIcon iconName="trash" className="fs-2" />
                  </button>
                </div>
              ))}
            </div>
            {images.length < 3 && (
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? "active" : ""}`}
                style={{
                  border: "2px dashed #007bff",
                  borderRadius: "4px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <input {...getInputProps()} />
                {loading ? (
                  <div>Uploading...</div>
                ) : (
                  <div>
                    <KTIcon
                      iconName="image"
                      className="fs-2x text-primary mb-3"
                    />
                    <p>
                      {isDragActive
                        ? "Drop the image here"
                        : "Click or drag an image here to add more"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="text-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={onClose}
              disabled={loading || updateMutation.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || updateMutation.isLoading}
            >
              {updateMutation.isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateMasterItemModal;

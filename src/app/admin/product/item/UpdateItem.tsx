import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { FashionItemApi, UpdateFashionItemRequest } from "../../../../api";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseconfig";
import { KTIcon } from "../../../../_metronic/helpers";

interface UpdateItemProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: UpdateFashionItemRequest;
}

const UpdateItem: React.FC<UpdateItemProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { itemId } = useParams<{ itemId: string }>();
  const [formData, setFormData] = useState<UpdateFashionItemRequest>({});
  const [images, setImages] = useState<string[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const queryClient = useQueryClient();
  const fashionItemApi = new FashionItemApi();

  useEffect(() => {
    if (initialData) {
      setFormData({
        sellingPrice: initialData.sellingPrice,
        note: initialData.note,
        condition: initialData.condition,
        color: initialData.color,
        size: initialData.size,
      });
      setImages(initialData.imageUrls || []);
    }
  }, [initialData]);

  const updateMutation = useMutation(
    (data: UpdateFashionItemRequest) =>
      fashionItemApi.apiFashionitemsItemIdPut(itemId!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["itemDetail", itemId]);
        toast.success("Item updated successfully");
        onClose();
      },
      onError: (error) => {
        console.error("Error updating item:", error);
        toast.error("Failed to update item");
      },
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsImageLoading(true);
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
        setFormData((prev) => ({ ...prev, imageUrls: newImages }));
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error("Failed to upload images");
      } finally {
        setIsImageLoading(false);
      }
    },
    [images]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
    },
    maxFiles: 3 - images.length,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setFormData((prev) => ({ ...prev, imageUrls: newImages }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Item</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group mb-3">
                <label htmlFor="sellingPrice">Selling Price</label>
                <input
                  type="number"
                  className="form-control"
                  id="sellingPrice"
                  name="sellingPrice"
                  value={formData.sellingPrice || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="note">Note</label>
                <input
                  type="text"
                  className="form-control"
                  id="note"
                  name="note"
                  value={formData.note || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="condition">Condition</label>
                <select
                  className="form-control"
                  id="condition"
                  name="condition"
                  value={formData.condition || ""}
                  onChange={handleChange}
                >
                  <option value="Never worn, with tag">
                    Never worn, with tag
                  </option>
                  <option value="Never worn">Never worn</option>
                  <option value="Very good">Very good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  className="form-control"
                  id="color"
                  name="color"
                  value={formData.color || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="size">Size</label>
                <select
                  className="form-control"
                  id="size"
                  name="size"
                  value={formData.size || ""}
                  onChange={handleChange}
                >
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label>Images (Max 3)</label>
                <div className="d-flex flex-wrap gap-3 mb-3">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="text-center"
                      style={{ width: "100px" }}
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="img-thumbnail"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger mt-2"
                        onClick={() => removeImage(index)}
                        disabled={isImageLoading || updateMutation.isLoading}
                        style={{
                          fontSize: "12px",
                          padding: "6px 12px",
                          width: "100%",
                        }}
                      >
                        Remove
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
                    {isImageLoading ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <div>
                        <KTIcon
                          iconName="image"
                          className="fs-2x text-primary mb-3"
                        />
                        <p>
                          {isDragActive
                            ? "Drop the files here"
                            : "Drag 'n' drop images, or click to select"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isImageLoading || updateMutation.isLoading}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isImageLoading || updateMutation.isLoading}
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
        </div>
      </div>
    </div>
  );
};

export default UpdateItem;

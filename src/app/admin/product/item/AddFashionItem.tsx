import React, { useState, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseconfig";
import { CreateIndividualItemRequest, MasterItemApi } from "../../../../api";
import { useDropzone } from "react-dropzone";
import { KTCard, KTCardBody, KTIcon } from "../../../../_metronic/helpers";
import { useParams } from "react-router-dom";
import { showAlert } from "../../../../utils/Alert";

export type SizeType = "XS" | "S" | "M" | "L" | "XL";

interface AddFashionItemProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (itemData: CreateIndividualItemRequest) => void;
  handleItemCreated: () => void;
}

const AddFashionItem: React.FC<AddFashionItemProps> = ({
  show,
  handleClose,
  handleSave,
  handleItemCreated,
}) => {
  const { masterItemId } = useParams<{ masterItemId: string }>();
  const initialFormData: CreateIndividualItemRequest = {
    condition: "Never worn, with tag",
    color: "",
    size: "XS",
    note: "",
    sellingPrice: 0,
    images: [],
  };

  const [fashionItem, setFashionItem] =
    useState<CreateIndividualItemRequest>(initialFormData);
  const [files, setFiles] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createFashionItem = async (itemData: CreateIndividualItemRequest) => {
    setIsLoading(true);
    const id = masterItemId ?? "";
    try {
      const createApi = new MasterItemApi();
      await createApi.apiMasterItemsMasterItemIdIndividualItemsPost(
        id,
        itemData
      );
    } catch (error) {
      console.error("Error creating fashion item:", error);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const uploadedImageUrls: string[] = [];

      for (const file of acceptedFiles) {
        const storageRef = ref(storage, `fashion-items/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedImageUrls.push(downloadURL);
      }

      setFashionItem((prevItem) => ({
        ...prevItem,
        images: [...(prevItem.images || []), ...uploadedImageUrls],
      }));

      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type } = e.target;

    setFashionItem((prevItem) => ({
      ...prevItem,
      [id]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const removeFile = (fileIndex: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex)
    );

    setFashionItem((prevItem) => ({
      ...prevItem,
      images: prevItem.images?.filter((_, index) => index !== fileIndex) || [],
    }));
  };

  const resetForm = () => {
    setFashionItem(initialFormData);
    setFiles([]);
  };

  const handleCloseWithReset = () => {
    resetForm();
    handleClose();
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await createFashionItem(fashionItem);
        handleSave(fashionItem);
        handleItemCreated();
        handleCloseWithReset();
      } catch (error) {
        showAlert("error", "Failed to submit. Please try again.");
      }
    }
  };

  const validateForm = () => {
    if (
      !fashionItem.condition ||
      !fashionItem.color ||
      !fashionItem.size ||
      fashionItem.sellingPrice === undefined ||
      fashionItem.sellingPrice <= 0
    ) {
      showAlert("info", "Please fill all required fields.");
      return false;
    }
    return true;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", padding: "1rem" }}
      tabIndex={-1}
      role="dialog"
    >
      <div
        className="modal-dialog"
        role="document"
        style={{ maxWidth: "800px" }}
      >
        <div className="modal-content">
          <div className="modal-header" style={{ borderBottom: "none" }}>
            <h3
              className="modal-title"
              style={{
                fontSize: "40px",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              Add Fashion Item
            </h3>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={handleCloseWithReset}
              disabled={isLoading}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
          <div className="modal-body" style={{ padding: "2rem" }}>
            <div className="fashion-item-form">
              <form>
                {/* Condition */}
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="condition"
                    style={{ marginBottom: "0.5rem", display: "block" }}
                  >
                    Condition
                  </label>
                  <select
                    className="form-control"
                    id="condition"
                    value={fashionItem.condition || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                    style={{ padding: "0.5rem" }}
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

                {/* Color */}
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="color"
                    style={{ marginBottom: "0.5rem", display: "block" }}
                  >
                    Color
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="color"
                    placeholder="Enter item color"
                    value={fashionItem.color || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                    style={{ padding: "0.5rem" }}
                  />
                </div>

                {/* Size */}
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="size"
                    style={{ marginBottom: "0.5rem", display: "block" }}
                  >
                    Size
                  </label>
                  <select
                    className="form-control"
                    id="size"
                    value={fashionItem.size || "XS"}
                    onChange={handleChange}
                    disabled={isLoading}
                    style={{ padding: "0.5rem" }}
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>

                {/* Note */}
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="note"
                    style={{ marginBottom: "0.5rem", display: "block" }}
                  >
                    Note
                  </label>
                  <textarea
                    className="form-control"
                    id="note"
                    placeholder="Additional notes about the item"
                    value={fashionItem.note || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                    style={{ padding: "0.5rem", minHeight: "100px" }}
                  />
                </div>

                {/* Selling Price */}
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="sellingPrice"
                    style={{ marginBottom: "0.5rem", display: "block" }}
                  >
                    Selling Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="sellingPrice"
                    placeholder="Enter the selling price"
                    value={fashionItem.sellingPrice || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                    style={{ padding: "0.5rem" }}
                  />
                </div>

                {/* Image Upload */}
                <div className="form-group">
                  <label>Images</label>
                  <KTCard>
                    <KTCardBody>
                      <div
                        {...getRootProps()}
                        className="dropzone"
                        style={{
                          border: "2px dashed #007bff",
                          padding: "2rem",
                          borderRadius: "0.25rem",
                        }}
                      >
                        <input {...getInputProps()} />
                        <div className="d-flex flex-column align-items-center justify-content-center">
                          <KTIcon
                            iconName="image"
                            className="svg-icon-primary svg-icon-5x"
                          />
                          <div className="fw-bold fs-3 text-primary">
                            {isDragActive
                              ? "Drop the files here ..."
                              : "Drag 'n' drop files or click to select"}
                          </div>
                        </div>
                      </div>
                      <div className="row mt-5">
                        {files.map((file, fileIndex) => (
                          <div
                            key={fileIndex}
                            className="col-3"
                            style={{ marginBottom: "1rem" }}
                          >
                            <div className="text-center">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${fileIndex}`}
                                className="img-thumbnail"
                                style={{ width: "100%", height: "auto" }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger mt-2"
                                onClick={() => removeFile(fileIndex)}
                                disabled={isLoading}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </KTCardBody>
                  </KTCard>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-footer" style={{ borderTop: "none" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseWithReset}
              disabled={isLoading}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFashionItem;

import React, { useState, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseconfig";
import { CreateIndividualItemRequest, MasterItemApi } from "../../../../api";
import { useDropzone } from "react-dropzone";
import { KTCard, KTCardBody, KTIcon } from "../../../../_metronic/helpers";
import { useParams } from "react-router-dom";

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
  const [errorMessage, setErrorMessage] = useState<string>("");
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
    setErrorMessage("");
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
        setErrorMessage("Failed to submit. Please try again.");
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
      setErrorMessage("Please fill all required fields.");
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
      style={{ display: "block" }}
      tabIndex={-1}
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h3
              className="modal-title"
              style={{
                fontSize: 40,
                display: "flex",
                justifyContent: "center",
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
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="fashion-item-form">
              <form>
                {/* Condition */}
                <div className="form-group">
                  <label htmlFor="condition">Condition</label>
                  <select
                    className="form-control"
                    id="condition"
                    value={fashionItem.condition || ""}
                    onChange={handleChange}
                    disabled={isLoading}
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
                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <input
                    type="text"
                    className="form-control"
                    id="color"
                    placeholder="Enter item color"
                    value={fashionItem.color || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                {/* Size */}
                <div className="form-group">
                  <label htmlFor="size">Size</label>
                  <select
                    className="form-control"
                    id="size"
                    value={fashionItem.size || "XS"}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>

                {/* Note */}
                <div className="form-group">
                  <label htmlFor="note">Note</label>
                  <textarea
                    className="form-control"
                    id="note"
                    placeholder="Additional notes about the item"
                    value={fashionItem.note || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                {/* Selling Price */}
                <div className="form-group">
                  <label htmlFor="sellingPrice">Selling Price</label>
                  <input
                    type="number"
                    className="form-control"
                    id="sellingPrice"
                    placeholder="Enter the selling price"
                    value={fashionItem.sellingPrice || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                {/* Image Upload */}
                <div className="form-group">
                  <label>Images</label>
                  <KTCard>
                    <KTCardBody>
                      <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()} />
                        <div className="d-flex flex-column align-items-center justify-content-center border border-2 border-primary rounded p-5">
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
                          <div key={fileIndex} className="col-3">
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

                {/* Error Message */}
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseWithReset}
              disabled={isLoading}
            >
              Close
            </button>
            {/* Submit Button */}
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

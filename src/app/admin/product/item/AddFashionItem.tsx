import React, { useState, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseconfig";
import { CreateIndividualItemRequest, MasterItemApi } from "../../../../api";
import { useDropzone } from "react-dropzone";
import { KTCard, KTCardBody, KTIcon } from "../../../../_metronic/helpers";

export type SizeType = "XS" | "S" | "M" | "L" | "XL";

interface AddFashionItemProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (itemData: CreateIndividualItemRequest) => void;
  masterItemId: string;
}

const AddFashionItem: React.FC<AddFashionItemProps> = ({
  show,
  handleClose,
  handleSave,
  masterItemId,
}) => {
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

  const createFashionItem = async (itemData: CreateIndividualItemRequest) => {
    try {
      const createApi = new MasterItemApi();
      const response =
        await createApi.apiMasterItemsMasterItemIdIndividualItemsPost(
          masterItemId,
          itemData
        );
      console.log(response);
    } catch (error) {
      console.error("Error creating fashion item:", error);
      throw error;
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
        handleCloseWithReset();
      } catch (error) {
        alert("Failed to submit. Please try again.");
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
      alert("Please fill all required fields.");
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
              style={{
                fontSize: 40,
                display: "flex",
                justifyContent: "center",
              }}
              className="modal-title"
            >
              Add Fashion Item
            </h3>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={handleCloseWithReset}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="fashion-item-form">
              <form>
                <div className="form-group">
                  <label htmlFor="condition">Condition</label>
                  <select
                    className="form-control"
                    id="condition"
                    value={fashionItem.condition || ""}
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
                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <input
                    type="text"
                    className="form-control"
                    id="color"
                    value={fashionItem.color || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="size">Size</label>
                  <select
                    className="form-control"
                    id="size"
                    value={fashionItem.size || "XS"}
                    onChange={handleChange}
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="note">Note</label>
                  <textarea
                    className="form-control"
                    id="note"
                    value={fashionItem.note || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="sellingPrice">Selling Price</label>
                  <input
                    type="number"
                    className="form-control"
                    id="sellingPrice"
                    value={fashionItem.sellingPrice || ""}
                    onChange={handleChange}
                  />
                </div>
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
                              : "Drag 'n' drop some files here, or click to select files"}
                          </div>
                        </div>
                      </div>
                      <div className="row mt-5">
                        {files.map((file, fileIndex) => (
                          <div key={fileIndex} className="col-3">
                            <div className="text-center">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`fashion-item-${fileIndex}`}
                                className="img-fluid rounded"
                              />
                              <button
                                type="button"
                                className="btn btn-danger mt-2"
                                onClick={() => removeFile(fileIndex)}
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
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseWithReset}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFashionItem;

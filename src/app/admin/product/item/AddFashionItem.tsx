import React, { useState, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseconfig"; // Adjust the import path as necessary
import { MasterItemApi } from "../../../../api";
import { useDropzone } from "react-dropzone";
import { KTCard, KTCardBody, KTIcon } from "../../../../_metronic/helpers";
export type SizeType = "XS" | "S" | "M" | "L" | "XL";
interface AddFashionItemProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (itemData: FashionItem[]) => void;
  masterItemId: string; // masterItemId parameter
}
interface CreateIndividualItemRequest {
  condition: string;
  color: string;
  size: SizeType;
  note: string;
  sellingPrice: number;
  images: string[];
}
interface FashionItem {
  condition: string;
  color: string;
  size: SizeType;
  note: string;
  sellingPrice: number;
  images: string[];
}

const AddFashionItem: React.FC<AddFashionItemProps> = ({
  show,
  handleClose,
  handleSave,
  masterItemId,
}) => {
  const initialFormData: FashionItem = {
    condition: "Never worn, with tag",
    color: "",
    size: "XS",
    note: "",
    sellingPrice: 0,
    images: [],
  };

  const [fashionItems, setFashionItems] = useState<FashionItem[]>([
    { ...initialFormData },
  ]);

  const [files, setFiles] = useState<File[][]>([[]]);

  const createFashionItems = async (itemsData: FashionItem[]) => {
    try {
      const createApi = new MasterItemApi();
      const createFashionItems = await Promise.all(
        itemsData.map((itemData) => {
          const requestItem: CreateIndividualItemRequest = {
            condition: itemData.condition,
            color: itemData.color,
            size: itemData.size as SizeType,
            note: itemData.note,
            sellingPrice: itemData.sellingPrice,
            images: itemData.images,
          };
          return createApi.apiMasterItemsMasterItemIdIndividualItemsPost(
            masterItemId,
            [requestItem]
          );
        })
      );
      console.log(createFashionItems);
    } catch (error) {
      console.error("Error creating fashion items:", error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[], index: number) => {
    try {
      const uploadedImageUrls: string[] = [];

      for (const file of acceptedFiles) {
        const storageRef = ref(storage, `fashion-items/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedImageUrls.push(downloadURL);
      }

      // Update the fashion item with the new image URLs
      setFashionItems((prevItems) =>
        prevItems.map((item, i) =>
          i === index
            ? { ...item, images: [...item.images, ...uploadedImageUrls] }
            : item
        )
      );

      // Update the files for the preview
      setFiles((prevFiles) =>
        prevFiles.map((fileSet, i) =>
          i === index ? [...fileSet, ...acceptedFiles] : fileSet
        )
      );
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index: number
  ) => {
    const { id, value, type } = e.target;

    setFashionItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index
          ? {
              ...item,
              [id]:
                type === "checkbox"
                  ? (e.target as HTMLInputElement).checked
                  : value,
            }
          : item
      )
    );
  };

  const removeFile = (index: number, fileIndex: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((fileSet, i) =>
        i === index
          ? fileSet.filter((_, fIndex) => fIndex !== fileIndex)
          : fileSet
      )
    );

    setFashionItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index
          ? {
              ...item,
              images: item.images.filter((_, fIndex) => fIndex !== fileIndex),
            }
          : item
      )
    );
  };

  const addNewItem = () => {
    setFashionItems([...fashionItems, { ...initialFormData }]);
    setFiles([...files, []]);
  };

  const removeItem = (index: number) => {
    setFashionItems((prevItems) => prevItems.filter((_, i) => i !== index));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFashionItems([{ ...initialFormData }]);
    setFiles([[]]);
  };

  const handleCloseWithReset = () => {
    resetForm();
    handleClose();
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await createFashionItems(fashionItems);
        handleSave(fashionItems);
        handleClose();
      } catch (error) {
        alert("Failed to submit. Please try again.");
      }
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onDrop(files, index),
  });
  const validateForm = () => {
    for (const item of fashionItems) {
      if (
        !item.condition ||
        !item.color ||
        !item.size ||
        item.sellingPrice <= 0
      ) {
        alert("Please fill all required fields.");
        return false;
      }
    }
    return true;
  };

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
              Add Fashion Items
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
            {fashionItems.map((item, index) => (
              <div key={index} className="fashion-item-form">
                <form>
                  <div className="form-group">
                    <label htmlFor={`condition-${index}`}>Condition</label>
                    <select
                      className="form-control"
                      id="condition"
                      value={item.condition}
                      onChange={(e) => handleChange(e, index)}
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
                    <label htmlFor={`color-${index}`}>Color</label>
                    <input
                      type="text"
                      className="form-control"
                      id="color"
                      value={item.color}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`size-${index}`}>Size</label>
                    <select
                      className="form-control"
                      id="size"
                      value={item.size}
                      onChange={(e) => handleChange(e, index)}
                    >
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor={`note-${index}`}>Note</label>
                    <textarea
                      className="form-control"
                      id="note"
                      value={item.note}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`sellingPrice-${index}`}>
                      Selling Price
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="sellingPrice"
                      value={item.sellingPrice}
                      onChange={(e) => handleChange(e, index)}
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
                          {files[index].map((file, fileIndex) => (
                            <div key={fileIndex} className="col-3">
                              <div className="text-center">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`fashion-item-${index}-${fileIndex}`}
                                  className="img-fluid rounded"
                                />
                                <button
                                  type="button"
                                  className="btn btn-danger mt-2"
                                  onClick={() => removeFile(index, fileIndex)}
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
                  {fashionItems.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeItem(index)}
                    >
                      Remove Item
                    </button>
                  )}
                </form>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary"
              onClick={addNewItem}
            >
              Add Another Item
            </button>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseWithReset}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Save Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFashionItem;

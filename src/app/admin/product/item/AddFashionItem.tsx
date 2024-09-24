import React, { useState } from "react";
import { CreateIndividualItemRequest, MasterItemApi } from "../../../../api";
import { useParams } from "react-router-dom";
import { showAlert } from "../../../../utils/Alert";
import {
  formatNumberWithDots,
  parseFormattedNumber,
} from "../../../pages/utils/utils"; // Import the utility functions

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
    itemInStock: 0,
  };

  const [fashionItem, setFashionItem] =
    useState<CreateIndividualItemRequest>(initialFormData);

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
      showAlert("success", "Fashion product(s) created successfully");
    } catch (error) {
      console.error("Error creating fashion product:", error);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const parsedValue = value === "" ? 0 : parseFormattedNumber(value);
    setFashionItem((prevItem) => ({
      ...prevItem,
      sellingPrice: parsedValue,
    }));
  };

  const resetForm = () => {
    setFashionItem(initialFormData);
  };

  const handleCloseWithReset = () => {
    resetForm();
    handleClose();
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        await createFashionItem(fashionItem);
        handleSave(fashionItem);
        handleItemCreated();
        handleCloseWithReset();
      } catch (error) {
        showAlert("error", "Failed to submit. Please try again.");
      } finally {
        setIsLoading(false);
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
              Add Fashion Product
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
                    placeholder="Enter product color"
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
                    <option value="XXL">2XL</option>
                    <option value="XXXL">3XL</option>
                    <option value="XXXXL">4XL</option>
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
                    placeholder="Additional notes about the product"
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      className="form-control"
                      id="sellingPrice"
                      placeholder="Enter the selling price"
                      value={formatNumberWithDots(
                        fashionItem.sellingPrice!.toString()
                      )}
                      maxLength={10}
                      onChange={handlePriceChange}
                      disabled={isLoading}
                      style={{ padding: "0.5rem", flex: 1 }}
                    />
                    <span style={{ marginLeft: "0.5rem" }}>VND</span>
                  </div>
                </div>
                {/* Stock amount */}
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="itemInStock"
                    style={{ marginBottom: "0.5rem", display: "block" }}
                  >
                    Number of products created
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="itemInStock"
                    placeholder="Number of products"
                    value={fashionItem.itemInStock || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                    style={{ padding: "0.5rem" }}
                  />
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
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span className="ms-1">Saving...</span>
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
          {isLoading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFashionItem;

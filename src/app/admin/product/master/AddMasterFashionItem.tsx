/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseconfig"; // Adjust the import path as necessary
import {
  Category,
  CategoryApi,
  MasterItemApi,
  ShopApi,
  ShopDetailResponse,
} from "../../../../api";
import { useDropzone } from "react-dropzone";
import { KTCard, KTCardBody, KTIcon } from "../../../../_metronic/helpers";
import { showAlert } from "../../../../utils/Alert";
import { auto } from "@popperjs/core";
import { reduceHooks } from "react-table";

interface AddMasterItemProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (itemData: MasterItem) => void;
}

interface MasterItem {
  masterItemCode: string;
  name: string;
  brand: string;
  description: string;
  categoryId: string;
  gender: "Male" | "Female";
  images: string[];
  itemForEachShops: {
    shopId: string;
    stockCount: number;
  }[];
}

const AddMasterItem: React.FC<AddMasterItemProps> = ({
  show,
  handleClose,
  handleSave,
}) => {
  const initialFormData: MasterItem = {
    masterItemCode: "",
    name: "",
    brand: "",
    description: "",
    categoryId: "",
    gender: "Male",
    images: [],
    itemForEachShops: [],
  };

  const [formData, setFormData] = useState<MasterItem>(initialFormData);
  const [files, setFiles] = useState<File[]>([]);
  const [shops, setShops] = useState<ShopDetailResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [isCategoryDisabled, setIsCategoryDisabled] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  console.log(formData);
  const createMasterItem = async (itemData: MasterItem) => {
    try {
      setLoading(true); // Start loading
      const createApi = new MasterItemApi();
      const response = await createApi.apiMasterItemsPost(itemData);
    } catch (error) {
      console.error("Error creating master item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const shopApi = new ShopApi();
        const response = await shopApi.apiShopsGet();

        setShops(response.data.data || []);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };
    fetchShops();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (formData.gender) {
        try {
          const categoryApi = new CategoryApi();
          const response = await categoryApi.apiCategoriesConditionGet(
            null!,
            null!,
            formData.gender === "Male"
              ? "535d3b90-dc58-41e3-ad32-055e261bd6a7"
              : "3e4c6370-a72b-44e3-a5eb-8f459764158f",
            4,
            "Available"
          );

          setCategories(response.data.data || []);
          setIsCategoryDisabled(false);
        } catch (error) {
          showAlert("error", `Error fetching categories: ${error}`);
        }
      } else {
        setCategories([]);
        setIsCategoryDisabled(true);
      }
    };
    fetchCategories();
  }, [formData.gender]);

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gender = e.target.value as "Male" | "Female";
    setFormData((prevData) => ({
      ...prevData,
      gender,
      categoryId: "",
      itemForEachShops: [],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedShopId = e.target.value;
    setSelectedShop(selectedShopId);
  };

  const addShopToList = () => {
    if (
      selectedShop &&
      !formData.itemForEachShops.some((shop) => shop.shopId === selectedShop)
    ) {
      setFormData((prevData) => ({
        ...prevData,
        itemForEachShops: [
          ...prevData.itemForEachShops,
          { shopId: selectedShop, stockCount: 0 },
        ],
      }));
      setSelectedShop(""); // Reset selected shop after adding
    }
  };

  const handleStockCountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    shopId: string
  ) => {
    const stockCount = parseInt(e.target.value, 10);
    setFormData((prevData) => ({
      ...prevData,
      itemForEachShops: prevData.itemForEachShops.map((item) =>
        item.shopId === shopId ? { ...item, stockCount } : item
      ),
    }));
  };

  const removeShop = (shopId: string) => {
    setFormData((prevData) => ({
      ...prevData,
      itemForEachShops: prevData.itemForEachShops.filter(
        (shop) => shop.shopId !== shopId
      ),
    }));
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      setFormData((prevData) => ({
        ...prevData,
        images: prevData.images.filter((_, i) => i !== index),
      }));
      return updatedFiles;
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const uploadedImageUrls: string[] = [];
      for (const file of acceptedFiles) {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedImageUrls.push(downloadURL);
      }
      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...uploadedImageUrls],
      }));
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
    },
    maxFiles: 10,
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      categoryId: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFiles([]);
  };

  const handleCloseWithReset = () => {
    resetForm();
    handleClose();
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await createMasterItem(formData);
        handleSave(formData);
        handleClose();
      } catch (error) {
        showAlert("error", `${error}`);
      }
    }
  };

  const validateForm = () => {
    if (
      !formData.masterItemCode ||
      !formData.name ||
      !formData.brand ||
      !formData.categoryId ||
      formData.itemForEachShops.length === 0
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
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        overflowY: "auto",
        padding: "10px",
        width: "100%",
        height: "100%",
      }}
      tabIndex={-1}
      role="dialog"
    >
      <div
        className="modal-content"
        style={{
          borderRadius: "8px",
          width: "80%",
          margin: "20px auto",
          padding: "20px",
          maxHeight: "80vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="modal-header"
          style={{ paddingBottom: "16px", position: "sticky" }}
        >
          <h3
            className="modal-title"
            style={{
              fontSize: "24px",
              margin: "0 auto",
              textAlign: "center",
              flex: 1,
            }}
          >
            Add Master Item
          </h3>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={handleCloseWithReset}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              padding: "0",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>
        <div className="modal-body" style={{ display: "flex", gap: "20px" }}>
          {/* Input Form */}
          <div style={{ flex: 1 }}>
            <form>
              <div className="fv-row">
                <label className="required form-label">Master Item Code</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  id="masterItemCode"
                  placeholder="Enter Master Item Code"
                  value={formData.masterItemCode}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>

              <div className="fv-row">
                <label className="required form-label">Name</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  id="name"
                  placeholder="Enter Item Name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="fv-row">
                <label className="required form-label">Brand</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  id="brand"
                  placeholder="Enter Brand"
                  value={formData.brand}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="fv-row">
                <label className="required form-label">Description</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  id="description"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>

              <div className="fv-row">
                <label className="required form-label">Gender</label>
                <select
                  id="gender"
                  className="form-control mb-2"
                  value={formData.gender}
                  onChange={handleGenderChange}
                  style={{ width: "100%" }}
                >
                  <option className="form-control mb-2" value="Male">
                    Male
                  </option>
                  <option className="form-control mb-2" value="Female">
                    Female
                  </option>
                </select>
              </div>
              <div className="fv-row">
                <label className="required form-label" htmlFor="categoryId">
                  Category
                </label>
                <select
                  className="form-select mb-2"
                  data-control="select2"
                  data-hide-search="true"
                  data-placeholder="Select an option"
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                  disabled={isCategoryDisabled}
                  style={{ width: "100%" }}
                >
                  {categories.map((category) => (
                    <option
                      className="form-control mb-2"
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>

          {/* Image Upload and Shop Selection */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "16px" }}>
              <label className="required form-label">Image</label>
              <KTCard>
                <KTCardBody>
                  <div
                    {...getRootProps()}
                    className="dropzone"
                    style={{
                      border: "2px dashed #007bff",
                      padding: "2rem",
                      borderRadius: "0.25rem",
                      marginBottom: "16px",
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
                            disabled={loading}
                            style={{
                              fontSize: "12px",
                            }}
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

            {/* Shop Selection */}
            <div style={{ marginBottom: "16px" }}>
              <label htmlFor="shopId">Select Shop</label>
              <select
                id="shopId"
                value={selectedShop}
                onChange={handleShopChange}
                style={{ width: "100%" }}
              >
                <option value="">Select Shop</option>
                {shops.map((shop) => (
                  <option key={shop.shopId} value={shop.shopId}>
                    {shop.address}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-success hover-rotate-end"
                onClick={addShopToList}
              >
                Add Shop
              </button>
              {formData.itemForEachShops.map((shopItem) => (
                <div
                  key={shopItem.shopId}
                  style={{
                    marginTop: "16px",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    padding: "16px",
                    position: "relative",
                  }}
                >
                  <strong>Shop Address:</strong>
                  <label>
                    {
                      shops.find((shop) => shop.shopId === shopItem.shopId)
                        ?.address
                    }
                  </label>
                  <hr />
                  <strong>Stock Count:</strong>
                  <input
                    type="number"
                    placeholder="Stock count"
                    value={shopItem.stockCount}
                    onChange={(e) => handleStockCountChange(e, shopItem.shopId)}
                    style={{
                      width: "100%",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeShop(shopItem.shopId)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Save Button */}
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            width: "100%",
            backgroundColor: "#007bff",
            color: "#fff",
            marginTop: "20px",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};
export default AddMasterItem;

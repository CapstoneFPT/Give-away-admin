/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseconfig"; // Adjust the import path as necessary
import {
  Category,
  CategoryApi,
  CreateMasterItemRequest,
  MasterItemApi,
  ShopApi,
  ShopDetailResponse,
} from "../../../../api";
import { useDropzone } from "react-dropzone";
import { KTCard, KTCardBody, KTIcon } from "../../../../_metronic/helpers";
import { showAlert } from "../../../../utils/Alert";

interface AddMasterItemProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (itemData: CreateMasterItemRequest) => void;
}

const AddMasterItem: React.FC<AddMasterItemProps> = ({
  show,
  handleClose,
  handleSave,
}) => {
  const initialFormData: CreateMasterItemRequest = {
    masterItemCode: "",
    name: "",
    brand: "",
    description: "",
    categoryId: "",
    gender: "Male",
    images: [],
    itemForEachShops: [],
  };

  const [formData, setFormData] =
    useState<CreateMasterItemRequest>(initialFormData);
  const [files, setFiles] = useState<File[]>([]);
  const [shops, setShops] = useState<ShopDetailResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryDisabled, setIsCategoryDisabled] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);

  const createMasterItem = async (itemData: CreateMasterItemRequest) => {
    setLoading(true);
    try {
      const createApi = new MasterItemApi();
      const response = await createApi.apiMasterItemsPost(itemData);
      console.log(response);
    } catch (error) {
      console.error("Error creating master product:", error);
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
              ? "550e8400-e29b-41d4-a716-446655440000"
              : "550e8400-e29b-41d4-a716-446655440001",
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

  const handleSelectAllShops = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFormData((prevData) => ({
        ...prevData,
        itemForEachShops: shops.map((shop) => ({ shopId: shop.shopId })),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        itemForEachShops: [],
      }));
    }
  };

  const handleShopSelection = (shopId: string) => {
    setFormData((prevData) => {
      const isShopSelected = prevData.itemForEachShops?.some(
        (item) => item.shopId === shopId
      );
      if (isShopSelected) {
        return {
          ...prevData,
          itemForEachShops: prevData.itemForEachShops?.filter(
            (item) => item.shopId !== shopId
          ),
        };
      } else {
        return {
          ...prevData,
          itemForEachShops: [
            ...(prevData.itemForEachShops || []),
            { shopId, stockCount: 0 },
          ],
        };
      }
    });
  };

  const removeShop = (shopId: string) => {
    setFormData((prevData) => ({
      ...prevData,
      itemForEachShops: prevData.itemForEachShops?.filter(
        (shop) => shop.shopId !== shopId
      ),
    }));
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      setFormData((prevData) => ({
        ...prevData,
        images: prevData.images?.filter((_, i) => i !== index),
      }));
      return updatedFiles;
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length >= 1 || acceptedFiles.length > 1) {
        showAlert("info", "Only one image is allowed for a master item.");
        return;
      }
      setLoading(true);
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
          images: Array.isArray(prevData.images)
            ? [...prevData.images, ...uploadedImageUrls]
            : [...uploadedImageUrls],
        }));
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      } catch (error) {
        console.error("Error uploading files:", error);
      } finally {
        setLoading(false);
      }
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
    },
    maxFiles: 1,
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
        resetForm();
      } catch (error) {
        showAlert("error", `Error submit: ${error}`);
      }
    }
  };

  const validateForm = () => {
    console.log(formData);
    if (
      !formData.masterItemCode ||
      !formData.name ||
      !formData.brand ||
      !formData.categoryId
    ) {
      showAlert("info", "Please fill all required fields.");
      return false;
    }
    if (formData.itemForEachShops?.length === 0) {
      showAlert("info", "Please select at least one shop.");
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
          display: "flex",
          flexDirection: "column",
          maxHeight: "98vh",
          overflow: "hidden",
        }}
      >
        <div
          className="modal-header"
          style={{
            paddingBottom: "16px",
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 1,
          }}
        >
          <h3
            className="modal-title"
            style={{
              fontSize: "24px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            Add Master Product
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

        <div
          className="modal-body"
          style={{ display: "flex", gap: "20px", flex: 1, overflow: "hidden" }}
        >
          {/* Input Form */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: "10px",
              overflow: "hidden",
            }}
          >
            <form>
              <div className="fv-row">
                <label className="required form-label">
                  Master Product Code
                </label>
                <input
                  type="text"
                  className="form-control mb-2"
                  id="masterItemCode"
                  placeholder="Enter Master Product Code"
                  value={formData.masterItemCode || ""}
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
                  placeholder="Enter Product Name"
                  value={formData.name || ""}
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
                  value={formData.brand || ""}
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
                  value={formData.description || ""}
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
                  <option className="form-control mb-2" value="">
                    Select Category
                  </option>
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
              <div className="fv-row">
                <label className="required form-label">Image</label>
                <KTCard className="p-3">
                  {loading ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: "200px" }}
                    >
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : files.length === 0 ? (
                    <div
                      {...getRootProps()}
                      className="dropzone"
                      style={{
                        border: "2px dashed #007bff",
                        borderRadius: "0.25rem",
                        textAlign: "center",
                        padding: "20px",
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
                            ? "Drop the files here (Only one image is allowed)..."
                            : "Drag 'n' drop files or click to select (Only one image is allowed)"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      {files.map((file, fileIndex) => (
                        <div key={fileIndex} className="col-2">
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
                                padding: "6px 12px",
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </KTCard>
              </div>
            </form>
          </div>

          {/*  Shop Selection */}

          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{ marginBottom: "16px" }}>
              <h1>Choose shops for master product</h1>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                  <thead>
                    <tr className="fw-bold text-muted">
                      <th className="w-25px">
                        <div className="form-check form-check-sm form-check-custom form-check-solid">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={
                              formData.itemForEachShops?.length === shops.length
                            }
                            onChange={handleSelectAllShops}
                          />
                        </div>
                      </th>
                      <th className="min-w-150px">Shop Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shops.map((shop) => (
                      <tr key={shop.shopId}>
                        <td>
                          <div className="form-check form-check-sm form-check-custom form-check-solid">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={formData.itemForEachShops?.some(
                                (item) => item.shopId === shop.shopId
                              )}
                              onChange={() => handleShopSelection(shop.shopId!)}
                            />
                          </div>
                        </td>
                        <td>{shop.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div
          style={{
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 50,
          }}
        >
          <button
            type="button"
            className="btn btn-success hover-rotate-end w-30 mt-2 mb-10"
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddMasterItem;

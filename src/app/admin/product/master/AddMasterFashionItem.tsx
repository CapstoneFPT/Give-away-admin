/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseconfig"; // Adjust the import path as necessary
import {
  CategoryApi,
  MasterItemApi,
  ShopApi,
  ShopDetailResponse,
} from "../../../../api";
import { useDropzone } from "react-dropzone";
import { KTCard, KTCardBody, KTIcon } from "../../../../_metronic/helpers";

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
  console.log(formData);
  const createMasterItem = async (itemData: MasterItem) => {
    try {
      const createApi = new MasterItemApi();
      const response = await createApi.apiMasterItemsPost(itemData);
      console.log(response);
    } catch (error) {
      console.error("Error creating master item:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const shopApi = new ShopApi();
        const response = await shopApi.apiShopsGet();
        console.log(response);
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
          console.log(response);
          setCategories(response.data.data || []);
          setIsCategoryDisabled(false);
        } catch (error) {
          console.error("Error fetching categories:", error);
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
        alert("Failed to submit. Please try again.");
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
      alert("Please fill all required fields.");
      return false;
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
              Add master item
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
            <form>
              <div className="form-group">
                <label htmlFor="masterItemCode">Master Item Code</label>
                <input
                  type="text"
                  className="form-control"
                  id="masterItemCode"
                  value={formData.masterItemCode}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="form-control"
                  id="brand"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  className="form-control"
                  id="gender"
                  value={formData.gender}
                  onChange={handleGenderChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="categoryId">Category</label>
                <select
                  className="form-control"
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                  disabled={isCategoryDisabled}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag 'n' drop some files here, or click to select files</p>
                )}
              </div>
              <div className="form-group">
                {files.map((file, index) => (
                  <div key={index} className="file-preview">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      width="100"
                      height="100"
                    />
                    <button type="button" onClick={() => removeFile(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label htmlFor="shopId">Select Shop</label>
                <select
                  className="form-control"
                  id="shopId"
                  value={selectedShop}
                  onChange={handleShopChange}
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
                  className="btn btn-secondary mt-2"
                  onClick={addShopToList}
                >
                  Add Shop
                </button>
              </div>
              {formData.itemForEachShops.map((shopItem) => (
                <div key={shopItem.shopId} className="form-group">
                  <label>
                    {
                      shops.find((shop) => shop.shopId === shopItem.shopId)
                        ?.address
                    }
                    :
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={shopItem.stockCount}
                    onChange={(e) => handleStockCountChange(e, shopItem.shopId)}
                  />
                  <button
                    type="button"
                    className="btn btn-danger mt-2"
                    onClick={() => removeShop(shopItem.shopId)}
                  >
                    Remove Shop
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMasterItem;

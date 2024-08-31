/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebaseconfig"; // Adjust the import path as necessary
import { CategoryApi, MasterItemApi, ShopApi } from "../../../../api";
import { useDropzone } from "react-dropzone";
import { KTCard, KTCardBody, KTIcon } from "../../../../_metronic/helpers";
interface AddFashionItemProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (itemData: FashionItem) => void;
}
interface Shop {
  shopId: string;
  address: string;
  staffId: string;
  phone: string;
}
interface Category {
  categoryId: string;
  name: string;
}
interface FashionItem {
  masterItemCode: string;
  name: string;
  brand: string;
  description: string;
  categoryId: string;
  genderId: string;
  gender: GenderType;
  stockCount: number;
  images: string[];
  shopId: string[];
}
type GenderType = "Male" | "Female";

const AddMasterItem: React.FC<AddFashionItemProps> = ({
  show,
  handleClose,
  handleSave,
}) => {
  const initialFormData: FashionItem = {
    masterItemCode: "",
    name: "",
    brand: "",
    description: "",
    categoryId: "",
    genderId: "535d3b90-dc58-41e3-ad32-055e261bd6a7",
    gender: "Male",
    stockCount: 0,
    images: [],
    shopId: [""],
  };
  const [formData, setFormData] = useState<FashionItem>(initialFormData);

  const [files, setFiles] = useState<File[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryDisabled, setIsCategoryDisabled] = useState(true);

  const createMasterItem = async (itemData: FashionItem) => {
    try {
      const createApi = new MasterItemApi();
      const createMasterItem = await createApi.apiMasterItemsPost({
        masterItemCode: formData.masterItemCode,
        name: formData.name,
        brand: formData.brand,
        description: formData.description,
        categoryId: formData.categoryId,
        gender: formData.gender,
        stockCount: formData.stockCount,
        images: formData.images,
        shopId: formData.shopId,
      });
      console.log(createMasterItem);
    } catch (error) {
      console.error("Error creating master item:", error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const shopApi = new ShopApi();
        const respondShop = await shopApi.apiShopsGet();
        //@ts-expect-error 123
        setShops(respondShop.data.data);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };
    fetchShops();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (formData.genderId) {
        try {
          const categoryApi = new CategoryApi();
          const respondCategory = await categoryApi.apiCategoriesConditionGet(
            null!,
            null!,
            formData.genderId,
            4,
            "Available"
          );
          //@ts-expect-error 123
          setCategories(respondCategory.data.data);
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
  }, [formData.genderId]);

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gender = e.target.value as GenderType;

    const genderId =
      gender === "Male"
        ? "535d3b90-dc58-41e3-ad32-055e261bd6a7"
        : gender === "Female"
        ? "3e4c6370-a72b-44e3-a5eb-8f459764158f"
        : ""; // Handle empty value

    setFormData((prevData) => ({
      ...prevData,
      gender: gender || "Male", // Default to "Male" if empty
      genderId,
      categoryId: "",
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
  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      // Remove the corresponding image URL from formData
      setFormData((prevData) => ({
        ...prevData,
        images: prevData.images.filter((_, i) => i !== index),
      }));
      return updatedFiles;
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      // Create a reference to the Firebase storage
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

      // Update files state to display previews
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

  const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      shopId: [e.target.value],
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
      formData.stockCount <= 0 ||
      formData.shopId.length === 0
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
                <label htmlFor="category">Category</label>
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
              <div className="form-group">
                <label htmlFor="shop">Shop</label>
                <select
                  className="form-control"
                  id="shopId"
                  value={formData.shopId[0]}
                  onChange={handleShopChange}
                >
                  <option value="">Select Shop</option>
                  {shops.map((shop) => (
                    <option key={shop.shopId} value={shop.shopId}>
                      {shop.address}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="stockCount">Stock Count</label>
                <input
                  type="number"
                  className="form-control"
                  id="stockCount"
                  value={formData.stockCount}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      stockCount: parseInt(e.target.value, 10),
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Images</label>
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <div className="dz-message needsclick">
                    <KTIcon iconName="file-up" className="text-primary fs-3x" />
                    <h3 className="fs-5 fw-bold text-gray-900 mb-1">
                      Drop files here or click to upload.
                    </h3>
                    <span className="fs-7 text-gray-400">
                      Upload up to 10 files
                    </span>
                  </div>
                </div>
                {files.length > 0 && (
                  <div className="mt-5">
                    <h3 className="fs-5 fw-bold text-gray-900 mb-3">
                      Uploaded Files:
                    </h3>
                    <div className="d-flex flex-wrap gap-5">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="d-flex flex-column align-items-center"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`preview ${index}`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                            className="rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                          >
                            <KTIcon iconName="cross" className="fs-2" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseWithReset}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMasterItem;

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseconfig"; // Adjust the import path as necessary

interface AddFashionItemProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (itemData: FashionItem) => void;
}

interface FashionItem {
  masterItemCode: string;
  name: string;
  brand: string;
  description: string;
  categoryId: string;
  gender: string;
  stockCount: number;
  images: string[];
  shopId: string[];
}

const AddFashionItem: React.FC<AddFashionItemProps> = ({
  show,
  handleClose,
  handleSave,
}) => {
  const [formData, setFormData] = useState<FashionItem>({
    masterItemCode: "",
    name: "",
    brand: "",
    description: "",
    categoryId: "",
    gender: "Male",
    stockCount: 0,
    images: [],
    shopId: [""],
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]); // To keep track of selected files

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages: string[] = [];
      const newPreviews: string[] = [];

      for (const file of files) {
        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push(previewUrl);

        // Upload to Firebase Storage
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        newImages.push(imageUrl);
      }

      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...newImages],
      }));
      setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviews]);
      setImageFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      categoryId: e.target.value,
    }));
  };

  const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      shopId: [e.target.value], // Adjust as needed for multiple shop IDs
    }));
  };

  const handleRemoveImage = (index: number) => {
    // Remove image preview and file
    setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleSave(formData);
      handleClose();
    }
  };

  const validateForm = () => {
    // Basic validation (customize as needed)
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
            <h5 className="modal-title">Add Fashion Item</h5>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={handleClose}
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
                  placeholder="Enter master item code"
                  value={formData.masterItemCode}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Item Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter item name"
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
                  placeholder="Enter brand"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  placeholder="Enter item description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoryId">Category</label>
                <select
                  id="categoryId"
                  className="form-control"
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                >
                  {/* Populate options from categories */}
                  <option value="">Select a category</option>
                  {/* Example static categories */}
                  <option value="3fa85f64-5717-4562-b3fc-2c963f66afa6">
                    Category 1
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  className="form-control"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      gender: e.target.value,
                    }))
                  }
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="stockCount">Stock Count</label>
                <input
                  type="number"
                  className="form-control"
                  id="stockCount"
                  placeholder="Enter stock count"
                  value={formData.stockCount}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      stockCount: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="images"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Images
                </label>
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    type="button"
                    className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                    onClick={() => document.getElementById("images")?.click()}
                  >
                    Add Image
                  </button>
                  <input
                    type="file"
                    className="hidden"
                    id="images"
                    multiple
                    onChange={handleImageChange}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {previewImages.map((url, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img
                        src={url}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover border border-gray-300 rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        onClick={() => handleRemoveImage(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="shopId">Shop</label>
                <select
                  id="shopId"
                  className="form-control"
                  value={formData.shopId[0]}
                  onChange={handleShopChange}
                >
                  <option value="">Select a shop</option>
                  {/* Example static shops */}
                  <option value="shop1">Shop 1</option>
                </select>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Save Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFashionItem;

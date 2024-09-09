import React, { useState, useEffect } from "react";
import {
  CategoryApi,
  ConsignLineItemApi,
  ConsignSaleLineItemDetailedResponse,
  MasterItemListResponse,
} from "../../../api";
import { formatBalance } from "../utils/utils";
import KTModal from "../../../_metronic/helpers/components/KTModal.tsx";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify"; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

// Initialize toast (only once in your app, typically in the entry point)
// toast.configure();

interface AddToInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ConsignSaleLineItemDetailedResponse;
  selectedMasterItem: string;
  handleMasterItemChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  masterItemsData: any;
  handleCreateItemModalSubmit: () => void;
  createIndividualMutation: any;
  createIndividualAfterNegotiationMutation: any;
}

export const AddToInventoryModal: React.FC<AddToInventoryModalProps> = ({
  isOpen,
  onClose,
  data,
  selectedMasterItem,
  handleMasterItemChange,
  masterItemsData,
  handleCreateItemModalSubmit,
  createIndividualMutation,
  createIndividualAfterNegotiationMutation,
}) => {
  const [isCreatingMasterItem, setIsCreatingMasterItem] = useState(false);
  const [masterItemCode, setMasterItemCode] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedGender, setSelectedGender] = useState<"550e8400-e29b-41d4-a716-446655440000" | "550e8400-e29b-41d4-a716-446655440001">("550e8400-e29b-41d4-a716-446655440000");
  const [categories, setCategories] = useState<any[]>([]);
  console.log('consignLineItemid',data.consignSaleLineItemId)
  useEffect(() => {
    const fetchCategories = async () => {
      const categoryApi = new CategoryApi();
      const level = 4; // Set the level as a number
      try {
        const response = await categoryApi.apiCategoriesConditionGet(
          null!,
          null!,
          selectedGender,
          level
        );
        console.log('category', response);
        setCategories(response.data.data!); // Assuming response.data contains the categories array
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [selectedGender]);

  const handleCreateButtonClick = () => {
    setIsCreatingMasterItem(true);
  };

  const handleMasterItemCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMasterItemCode(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleCategoryIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGender(e.target.value as "550e8400-e29b-41d4-a716-446655440000" | "550e8400-e29b-41d4-a716-446655440001");
  };

  const handleSaveChanges = async () => {
    const responseCreateMasterConsign = new ConsignLineItemApi();
   
    try {
      await responseCreateMasterConsign.apiConsignlineitemsConsignLineItemIdCreateMasteritemPost(data.consignSaleLineItemId!, {
        masterItemCode: masterItemCode,
        description: description,
        categoryId: categoryId, // Ensure categoryId is included
        images: data.images,
        name: data.productName,
      });

      // Show success toast
      toast.success("Master item created successfully!");
    } catch (error) {
      console.error("Error creating master item:", error);

      // Show error toast
      toast.error("Failed to create master item. Please try again.");
    }

    setIsCreatingMasterItem(false);
  };

  return (
    <KTModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add To Inventory"
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-light" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreateItemModalSubmit}
            disabled={
              createIndividualMutation.isLoading ||
              createIndividualAfterNegotiationMutation.isLoading
            }
          >
            {createIndividualMutation.isLoading ||
            createIndividualAfterNegotiationMutation.isLoading ? (
              <span className="indicator-progress" style={{ display: "block" }}>
                Please wait...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            ) : (
              "Save changes"
            )}
          </button>
        </>
      }
    >
      <div className="row">
        <div className="col-md-6">
          <h6 className="fw-bold mb-3">Consign Line Item Details:</h6>
          <table className="table table-borderless">
            <tbody>
              <tr>
                <th scope="row">Product:</th>
                <td>
                  {data.images && data.images.length > 0 ? (
                    data.images.map((image, index) => (
                      <img
                        key={index}
                        style={{
                          width: "50px",
                          height: "50px",
                          marginRight: "5px",
                        }}
                        src={image}
                        alt={`Image ${index + 1}`}
                      />
                    ))
                  ) : (
                    <span>No images available</span>
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">Product Name:</th>
                <td>{data.productName}</td>
              </tr>
              <tr>
                <th scope="row">Brand:</th>
                <td>{data.brand}</td>
              </tr>
              <tr>
                <th scope="row">Color:</th>
                <td>{data.color}</td>
              </tr>
              <tr>
                <th scope="row">Size:</th>
                <td>{data.size}</td>
              </tr>
              <tr>
                <th scope="row">Gender:</th>
                <td>{data.gender}</td>
              </tr>
              <tr>
                <th scope="row">Condition:</th>
                <td>{data.condition}</td>
              </tr>
              <tr>
                <th scope="row">Expected Price:</th>
                <td>{formatBalance(data.expectedPrice || 0)} VND</td>
              </tr>
              <tr>
                <th scope="row">Deal Price:</th>
                <td>{formatBalance(data.dealPrice || 0)} VND</td>
              </tr>
              <tr>
                <th scope="row">Confirmed Price:</th>
                <td>{formatBalance(data.confirmedPrice || 0)} VND</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <h6 className="fw-bold mb-3">Choose a Master Product:</h6>
          {!isCreatingMasterItem && (
            <>
              <select
                id="masterItemSelect"
                className="form-select mb-3"
                value={selectedMasterItem}
                onChange={handleMasterItemChange}
              >
                <option value="">Select a master item</option>
                {masterItemsData &&
                  masterItemsData.items?.map(
                    (item: MasterItemListResponse) => (
                      <option key={item.masterItemId} value={item.masterItemId}>
                        {`${item.itemCode} - ${item.name} - ${item.brand} - ${item.gender}`}
                      </option>
                    )
                  )}
              </select>
              <h6 className="fw-bold mb-3">Create a Master Product: </h6>
              <Button className="btn btn-primary" onClick={handleCreateButtonClick}>
                Create
              </Button>
            </>
          )}

          {isCreatingMasterItem && (
            <>
              <div className="mb-3">
                <label htmlFor="masterItemCode" className="form-label">
                  Master Item Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="masterItemCode"
                  value={masterItemCode}
                  onChange={handleMasterItemCodeChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  rows={3}
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <div className="d-flex">
                  <div className="form-check me-4">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="genderRadio"
                      id="menRadio"
                      value="550e8400-e29b-41d4-a716-446655440000"
                      checked={selectedGender === "550e8400-e29b-41d4-a716-446655440000"}
                      onChange={handleGenderChange}
                    />
                    <label className="form-check-label" htmlFor="menRadio">
                      Men
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="genderRadio"
                      id="womenRadio"
                      value="550e8400-e29b-41d4-a716-446655440001"
                      checked={selectedGender === "550e8400-e29b-41d4-a716-446655440001"}
                      onChange={handleGenderChange}
                    />
                    <label className="form-check-label" htmlFor="womenRadio">
                      Women
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <select
                  id="categorySelect"
                  className="form-select"
                  value={categoryId}
                  onChange={handleCategoryIdChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveChanges}
              >
                Save Master Item
              </button>
            </>
          )}
        </div>
      </div>
    </KTModal>
  );
};

export default AddToInventoryModal;

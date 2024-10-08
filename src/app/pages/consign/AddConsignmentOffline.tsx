/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from "react";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import { useDropzone } from "react-dropzone";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  CategoryApi,
  CategoryTreeNode,
  ShopApi,
  AccountApi,
  AccountResponse,
} from "../../../api";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../../modules/auth";
import { MasterItemApi, MasterItemListResponse } from "../../../api";
import { storage } from "../../../firebaseconfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { GenderType, ConsignSaleType } from "../../../api";
import { CreateMasterOfflineConsignRequest } from "../../../api";
import { showAlert } from "../../../utils/Alert";
import { Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { formatNumberWithDots, parseFormattedNumber } from "../utils/utils"; // Import the utility functions

interface ConsignDetailRequest {
  masterItemId: string;
  note: string;
  expectedPrice: number;

  gender: GenderType;
  condition: string;
  color: string;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | "XXXXL";
  imageUrls: string[];
}

interface ConsignmentForm {
  type: ConsignSaleType;
  consignorName: string;
  phone: string;
  address: string;
  email: string;
  consignDetailRequests: ConsignDetailRequest[];
}

const initialFormData: ConsignmentForm = {
  type: ConsignSaleType.ConsignedForSale,
  consignorName: "",
  phone: "",
  address: "",
  email: "",
  consignDetailRequests: [],
};

const MALE_ID = "550e8400-e29b-41d4-a716-446655440000";
const FEMALE_ID = "550e8400-e29b-41d4-a716-446655440001";

const AddConsignmentOffline: React.FC = () => {
  const navigate = useNavigate();
  const [isPhoneTouched, setIsPhoneTouched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<AccountResponse[]>([]);
  const [selectedAccount, setSelectedAccount] =
    useState<AccountResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 6;
  const [formData, setFormData] = useState<ConsignmentForm>(initialFormData);
  const [showNewMasterItemModal, setShowNewMasterItemModal] = useState(false);
  const [consignmentGender, setConsignmentGender] = useState<string>(""); // For consign detail request
  const [newMasterItem, setNewMasterItem] =
    useState<CreateMasterOfflineConsignRequest>({
      masterItemCode: "",
      name: "",
      gender: GenderType.Male,
      description: "",
      categoryId: "",
      images: [],
    });
  const [selectedGender, setSelectedGender] = useState<string>("");
  const currentUser = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("manual");
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  console.log(formData);
  const handlePriceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    const parsedValue = value === "" ? 0 : parseFormattedNumber(value);
    handleItemChange(index, "expectedPrice", parsedValue);
  };
  const [isNewMasterItemImageUploading, setIsNewMasterItemImageUploading] =
    useState<boolean>(false);
  // Query to fetch master items
  const { data: masterItems, refetch: refetchMasterItems } = useQuery({
    queryKey: ["masterItems", consignmentGender],
    queryFn: async () => {
      const masterItemApi = new MasterItemApi();
      const response = await masterItemApi.apiMasterItemsGet(
        null!,
        null!,
        null!,
        null!,
        null!,
        null!,
        currentUser.currentUser?.shopId,
        consignmentGender as GenderType, // Filter by consignment gender
        true
      );
      return response.data;
    },
    enabled: !!consignmentGender, // Only run if consignmentGender is set
  });

  const handleConsignmentGenderChange = (index: number, value: string) => {
    setConsignmentGender(value); // Update the consignment gender
    handleItemChange(index, "gender", value as "Male" | "Female"); // Update the item gender
    refetchMasterItems(); // Refetch master items based on the new consignment gender
  };
  // Query to fetch categories based on selected gender
  const { data: categories } = useQuery(
    ["categories", selectedGender],
    async () => {
      if (!selectedGender) return [];
      const categoryApi = new CategoryApi();
      const response = await categoryApi.apiCategoriesConditionGet(
        null!,
        null!,
        selectedGender,
        4,
        "Available"
      );
      return response.data.data || [];
    },
    {
      enabled: !!selectedGender,
    }
  );
  // Mutation to create a new master item
  const createMasterItemMutation = useMutation(
    (newItem: CreateMasterOfflineConsignRequest) => {
      const masterItemApi = new ShopApi();
      return masterItemApi.apiShopsShopIdCreateMasterForOfflineConsignPost(
        currentUser.currentUser?.shopId || "",
        newItem
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("masterItems");
        setShowNewMasterItemModal(false);
        setNewMasterItem({
          masterItemCode: "",
          name: "",
          gender: GenderType.Male,
          description: "",
          categoryId: "",
          images: [],
        });
        showAlert("success", "Master product created successfully");
      },
    }
  );

  const findAccountMutation = useMutation({
    mutationFn: (params: { phone: string; page: number; pageSize: number }) => {
      const accountApi = new AccountApi();
      return accountApi.apiAccountsGet(
        params.page,
        params.pageSize,
        null!,
        params.phone,
        "Member",
        null!
      );
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      if (data.data && data.data.items && data.data.items.length > 0) {
        setSearchResults(data.data.items);
        setTotalPages(Math.ceil((data.data.totalCount || 0) / pageSize));
      } else {
        showAlert("error", "No accounts found with this phone number.");
        setSearchResults([]);
        setTotalPages(1);
      }
      setIsLoading(false);
    },
    onError: () => {
      showAlert("error", "Failed to find account.");
      setSearchResults([]);
      setTotalPages(1);
      setIsLoading(false);
    },
  });
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };
  const handleFindAccount = () => {
    if (searchTerm) {
      findAccountMutation.mutate({
        phone: searchTerm,
        page: currentPage,
        pageSize,
      });
    } else {
      showAlert("error", "Please enter a phone number.");
    }
  };

  const handleSelectAccount = (account: AccountResponse) => {
    setSelectedAccount(account);
    setFormData((prevData) => ({
      ...prevData,
      consignorName: account.fullname || "",
      phone: account.phone || "",
      email: account.email || "",
    }));
    setSearchTerm("");
    setSearchResults([]);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    findAccountMutation.mutate({ phone: searchTerm, page: newPage, pageSize });
  };

  const handleBackToSearch = () => {
    setSelectedAccount(null);
    setFormData((prevData) => ({
      ...prevData,
      consignorName: "",
      phone: "",
      email: "",
      address: "",
    }));
    setSearchTerm("");
  };

  const accountColumns = [
    { Header: "Full Name", accessor: "fullname" },
    { Header: "Phone", accessor: "phone" },
    {
      Header: "Actions",
      accessor: "id",
      Cell: ({ row }: { row: { original: AccountResponse } }) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleSelectAccount(row.original)}
        >
          Select
        </button>
      ),
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "phone") {
      const phoneRegex = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;
      setIsPhoneValid(phoneRegex.test(value));
    }
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name === "phone") {
      setIsPhoneTouched(true);
    }
  };
  const handleItemChange = (
    index: number,
    field: keyof ConsignDetailRequest,
    value: string | number
  ) => {
    setFormData((prevData) => {
      const updatedItems = [...prevData.consignDetailRequests];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
      return {
        ...prevData,
        consignDetailRequests: updatedItems,
      };
    });
  };

  const addItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      consignDetailRequests: [
        ...prevData.consignDetailRequests,
        {
          masterItemId: "",
          note: "",
          expectedPrice: 0,
          gender: "Male",
          condition: "",
          color: "",
          size: "XS",
          imageUrls: [],
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      consignDetailRequests: prevData.consignDetailRequests.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleImageUpload = useCallback(
    async (index: number, acceptedFiles: File[]) => {
      if (acceptedFiles.length > 3) {
        showAlert("info", "Only 3 images are allowed for a consignment item.");
        acceptedFiles = acceptedFiles.slice(0, 3);
      }
      setIsImageUploading(true);
      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const storageRef = ref(storage, `consignment_images/${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          return getDownloadURL(snapshot.ref);
        });

        const firebaseUrls = await Promise.all(uploadPromises);

        setFormData((prevData) => {
          const updatedItems = [...prevData.consignDetailRequests];
          const currentImages = updatedItems[index].imageUrls || [];
          const newImages = [...currentImages, ...firebaseUrls].slice(0, 3);
          updatedItems[index] = {
            ...updatedItems[index],
            imageUrls: newImages,
          };
          return {
            ...prevData,
            consignDetailRequests: updatedItems,
          };
        });
      } catch (error) {
        console.error("Error uploading images:", error);
        showAlert("error", "Error uploading images. Please try again.");
      } finally {
        setIsImageUploading(false);
      }
    },
    []
  );
  const removeImage = (itemIndex: number, imageIndex: number) => {
    setFormData((prevData) => {
      const updatedItems = [...prevData.consignDetailRequests];
      updatedItems[itemIndex].imageUrls = updatedItems[
        itemIndex
      ].imageUrls.filter((_, i) => i !== imageIndex);
      return {
        ...prevData,
        consignDetailRequests: updatedItems,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      showAlert("error", "Please fill in all required fields.");
      return;
    }
    try {
      const consignApi = new ShopApi();
      const createConsignmentOffline =
        await consignApi.apiShopsShopIdConsignsalesPost(
          currentUser.currentUser?.shopId || "",
          formData
        );

      showAlert("success", "Consignment created successfully");
      setFormData(initialFormData);
      navigate(
        `/consignment/${createConsignmentOffline.data.data?.consignSaleId}`
      );
    } catch (error) {
      console.error("Error creating consignment:", error);
      showAlert("error", "Failed to create consignment");
    }
  };

  const handleMasterItemChange = (index: number, masterItemId: string) => {
    handleItemChange(index, "masterItemId", masterItemId);
  };

  const handleCreateNewMasterItem = () => {
    setShowNewMasterItemModal(true);
  };

  const handleNewMasterItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMasterItemMutation.mutateAsync(newMasterItem);
      queryClient.invalidateQueries("masterItems");
      setShowNewMasterItemModal(false);
      setNewMasterItem({
        masterItemCode: "",
        name: "",
        brand: "",
        gender: GenderType.Male,
        description: "",
        categoryId: "",
        images: [],
      });
    } catch (error) {
      console.error("Error creating new master item:", error);
      // Handle error (e.g., show error message to user)
    }
  };
  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value; // Get the selected value from the event
    setSelectedGender(selectedValue); // Update the selected gender for the category

    // Map the selected ID to the corresponding string value for newMasterItem
    const gender = selectedValue === MALE_ID ? "Male" : "Female";
    setNewMasterItem({ ...newMasterItem, gender }); // Update the gender in newMasterItem
  };

  const handleNewMasterItemImageUpload = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 1) {
        showAlert("info", "Only one image is allowed for a master item.");
        return;
      }
      setIsNewMasterItemImageUploading(true);
      try {
        const file = acceptedFiles[0];
        const storageRef = ref(
          storage,
          `master-items/${Date.now()}_${file.name}`
        );
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setNewMasterItem((prevItem) => ({
          ...prevItem,
          images: [downloadURL],
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
        showAlert("error", "Error uploading image. Please try again.");
      } finally {
        setIsNewMasterItemImageUploading(false);
      }
    },
    []
  );

  const removeNewMasterItemImage = () => {
    setNewMasterItem((prevItem) => ({
      ...prevItem,
      images: [],
    }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "manual") {
      setSelectedAccount(null);
      setFormData((prevData) => ({
        ...prevData,
        consignorName: "",
        phone: "",
        email: "",
        address: "",
      }));
    }
  };
  const isFormValid = () => {
    if (
      !formData.type ||
      !formData.consignorName ||
      !formData.phone ||
      !formData.address ||
      !formData.email ||
      formData.consignDetailRequests.length === 0
    ) {
      return false;
    }

    for (const item of formData.consignDetailRequests) {
      if (
        !item.masterItemId ||
        !item.note ||
        item.expectedPrice <= 0 ||
        !item.gender ||
        !item.condition ||
        !item.color ||
        !item.size ||
        item.imageUrls.length === 0
      ) {
        return false;
      }
    }

    return true;
  };
  return (
    <>
      <div className="d-flex flex-column flex-lg-row">
        <div className="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
          <KTCard>
            <KTCardBody>
              <h2 className="fw-bold mb-5">Consignor Details</h2>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => handleTabChange(k || "manual")}
                className="mb-5"
              >
                <Tab eventKey="manual" title="Enter Manually">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                      <label htmlFor="consignorName" className="form-label">
                        Consignor Name
                      </label>
                      <input
                        id="consignorName"
                        name="consignorName"
                        className="form-control"
                        value={formData.consignorName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="phone" className="form-label">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        className={`form-control ${
                          isPhoneTouched &&
                          !isPhoneValid &&
                          formData.phone !== ""
                            ? "is-invalid"
                            : ""
                        }`}
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {!isPhoneValid &&
                        isPhoneTouched &&
                        formData.phone !== "" && (
                          <div className="invalid-feedback">
                            Please enter a valid phone number.
                          </div>
                        )}
                    </div>
                    <div className="mb-5">
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <input
                        id="address"
                        name="address"
                        className="form-control"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </form>
                </Tab>
                <Tab eventKey="findAccount" title="Find Account">
                  {selectedAccount ? (
                    <>
                      <div className="d-flex flex-column mb-7">
                        <div className="fs-6 fw-bold mb-2">Phone Number:</div>
                        <div className="fs-6">{selectedAccount.phone}</div>
                      </div>
                      <div className="d-flex flex-column mb-7">
                        <div className="fs-6 fw-bold mb-2">
                          Consignor's Name:
                        </div>
                        <div className="fs-6">{selectedAccount.fullname}</div>
                      </div>
                      <div className="d-flex flex-column mb-7">
                        <div className="fs-6 fw-bold mb-2">Email:</div>
                        <div className="fs-6">{selectedAccount.email}</div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-light-primary mb-7"
                        onClick={handleBackToSearch}
                      >
                        Back to Search
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="fv-row mb-7">
                        <label className="form-label fs-6 fw-bold mb-3">
                          Phone Number
                        </label>
                        <div className="input-group input-group-solid">
                          <input
                            type="text"
                            className={`form-control form-control-solid`}
                            placeholder="Enter phone number"
                            value={searchTerm}
                            onChange={handleSearchChange}
                          />
                          <button
                            type="button"
                            className="btn btn-light-primary"
                            onClick={handleFindAccount}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Finding...
                              </>
                            ) : (
                              "Find Account"
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Tab>
              </Tabs>
              {activeTab === "findAccount" && (
                <div className="mb-5">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              <div className="mb-5">
                <label htmlFor="type" className="form-label">
                  Consignment Type
                </label>
                <select
                  id="type"
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="ConsignedForSale">Consigned for Sale</option>
                  <option value="ConsignedForAuction">
                    Consigned for Auction
                  </option>
                  <option value="CustomerSale">Customer Sale</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Submit Consignment
              </button>
            </KTCardBody>
          </KTCard>
        </div>

        <div className="d-flex flex-column flex-lg-row-fluid gap-7 gap-lg-10">
          {searchResults.length > 0 &&
            activeTab === "findAccount" &&
            !selectedAccount && (
              <KTCard>
                <KTCardBody>
                  <h2 className="fw-bold mb-5">Found Accounts</h2>
                  <KTTable
                    columns={accountColumns}
                    data={searchResults}
                    totalCount={searchResults.length}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    loading={isLoading}
                    onPageChange={handlePageChange}
                    totalPages={totalPages}
                  />
                </KTCardBody>
              </KTCard>
            )}

          <KTCard>
            <KTCardBody>
              <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="fw-bold">Consignment Products</h2>
                <div>
                  <button
                    type="button"
                    className="btn btn-primary me-3"
                    onClick={handleCreateNewMasterItem}
                  >
                    Create Master Product
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addItem}
                  >
                    Add Products to Consignment
                  </button>
                </div>
              </div>
              <div className="row g-5">
                {formData.consignDetailRequests.map((item, index) => (
                  <div key={index} className="col-md-6">
                    <div className="card card-flush h-100">
                      <div className="card-header">
                        <div className="card-title">
                          <h3 className="fs-5">Product {index + 1}</h3>
                        </div>
                        <div className="card-toolbar">
                          <button
                            type="button"
                            className="btn btn-sm btn-icon btn-light-danger"
                            onClick={() => removeItem(index)}
                          >
                            <i className="ki-duotone ki-cross fs-2">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                          </button>
                        </div>
                      </div>
                      <div className="card-body pt-0">
                        <div className="mb-3">
                          <label className="form-label">
                            Images (Only 3 images)
                          </label>
                          <ImageDropzone
                            onDrop={(acceptedFiles) =>
                              handleImageUpload(index, acceptedFiles)
                            }
                            maxFiles={3}
                            isLoading={isImageUploading}
                          />
                          <div className="d-flex flex-wrap mt-2">
                            {item.imageUrls.map((url, imageIndex) => (
                              <div
                                key={imageIndex}
                                className="position-relative me-2 mb-2"
                              >
                                <img
                                  src={url}
                                  alt={`Product Image ${imageIndex + 1}`}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                  }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-icon btn-sm btn-danger position-absolute top-0 end-0"
                                  onClick={() => removeImage(index, imageIndex)}
                                  style={{ padding: "2px", fontSize: "10px" }}
                                >
                                  <i className="ki-duotone ki-cross fs-2">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                  </i>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Product Gender</label>
                          <select
                            className="form-select form-select-sm"
                            value={consignmentGender}
                            onChange={(e) =>
                              handleConsignmentGenderChange(
                                index,
                                e.target.value
                              )
                            }
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Master Product</label>
                          <select
                            className="form-select form-select-sm"
                            value={item.masterItemId}
                            onChange={(e) =>
                              handleMasterItemChange(index, e.target.value)
                            }
                            disabled={!consignmentGender}
                          >
                            <option value="">Select a Master Product</option>
                            {masterItems?.items?.map(
                              (masterItem: MasterItemListResponse) => (
                                <option
                                  key={masterItem.masterItemId}
                                  value={masterItem.masterItemId}
                                >
                                  {masterItem.name} - {masterItem.itemCode} -{" "}
                                  {masterItem.categoryName}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Note</label>
                          <input
                            className="form-control form-control-sm"
                            value={item.note}
                            onChange={(e) =>
                              handleItemChange(index, "note", e.target.value)
                            }
                            placeholder="Note"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            {formData.type === "CustomerSale"
                              ? "Buy Price"
                              : "Expected Price"}
                          </label>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={formatNumberWithDots(
                                item.expectedPrice.toString()
                              )}
                              onChange={(e) => handlePriceChange(index, e)}
                              placeholder={
                                formData.type === "CustomerSale"
                                  ? "Buy Price"
                                  : "Expected Price"
                              }
                              maxLength={10}
                            />
                            <span style={{ marginLeft: "0.5rem" }}>VND</span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Condition</label>
                          <select
                            className="form-select form-select-sm"
                            value={item.condition}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "condition",
                                e.target
                                  .value as ConsignDetailRequest["condition"]
                              )
                            }
                            required
                          >
                            <option value="">Select Condition</option>
                            <option value="Never worn, with tag">
                              Never worn, with tag
                            </option>
                            <option value="Never worn">Never worn</option>
                            <option value="Very good">Very good</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Color</label>
                          <input
                            className="form-control form-control-sm"
                            value={item.color}
                            onChange={(e) =>
                              handleItemChange(index, "color", e.target.value)
                            }
                            placeholder="Color"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Size</label>
                          <select
                            className="form-select form-select-sm"
                            value={item.size}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "size",
                                e.target.value as
                                  | "XS"
                                  | "S"
                                  | "M"
                                  | "L"
                                  | "XL"
                                  | "XXL"
                                  | "XXXL"
                                  | "XXXXL"
                              )
                            }
                            required
                          >
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                            <option value="XXXL">3XL</option>
                            <option value="XXXXL">4XL</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </KTCardBody>
          </KTCard>
        </div>
      </div>

      {/* Modal for creating a new master product */}
      <Modal
        show={showNewMasterItemModal}
        onHide={() => setShowNewMasterItemModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Master Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleNewMasterItemSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Master Product Code</Form.Label>
              <Form.Control
                type="text"
                value={newMasterItem.masterItemCode || ""}
                onChange={(e) =>
                  setNewMasterItem({
                    ...newMasterItem,
                    masterItemCode: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newMasterItem.name || ""}
                onChange={(e) =>
                  setNewMasterItem({ ...newMasterItem, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newMasterItem.description || ""}
                onChange={(e) =>
                  setNewMasterItem({
                    ...newMasterItem,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                value={selectedGender}
                onChange={handleGenderChange} // Pass the event directly
                required
              >
                <option value="">Select Gender</option>
                <option value={MALE_ID}>Male</option>
                <option value={FEMALE_ID}>Female</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                value={newMasterItem.brand || ""}
                onChange={(e) =>
                  setNewMasterItem({
                    ...newMasterItem,
                    brand: e.target.value,
                  })
                }
                placeholder="Brand"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newMasterItem.categoryId}
                onChange={(e) =>
                  setNewMasterItem({
                    ...newMasterItem,
                    categoryId: e.target.value,
                  })
                }
                disabled={!selectedGender}
                required
              >
                <option value="">Select Category</option>
                {categories?.map((category: CategoryTreeNode) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image (Only 1 image)</Form.Label>
              <ImageDropzone
                onDrop={handleNewMasterItemImageUpload}
                isLoading={isNewMasterItemImageUploading}
                isMasterItem={true}
              />
              <div className="d-flex flex-wrap mt-2">
                {newMasterItem.images && newMasterItem.images.length > 0 && (
                  <div className="position-relative me-2 mb-2">
                    <img
                      src={newMasterItem.images[0]}
                      alt="New Master Product Image"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-danger position-absolute top-0 end-0"
                      onClick={removeNewMasterItemImage}
                      style={{ padding: "2px", fontSize: "10px" }}
                      disabled={isNewMasterItemImageUploading}
                    >
                      <i className="ki-duotone ki-cross fs-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </button>
                  </div>
                )}
              </div>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={isNewMasterItemImageUploading}
            >
              Create Master Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

interface ImageDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  isLoading: boolean;
  maxFiles?: number;
  isMasterItem?: boolean;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onDrop,
  isLoading,
  maxFiles,
  isMasterItem = false,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: !isMasterItem,
    maxFiles: isMasterItem ? 1 : maxFiles,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${
        isDragActive ? "dropzone-active" : ""
      } d-flex align-items-center justify-content-center`}
      style={{
        border: "2px dashed #ccc",
        borderRadius: "4px",
        padding: "20px",
        cursor: isLoading ? "not-allowed" : "pointer",
        minHeight: "100px",
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      <input {...getInputProps()} disabled={isLoading} />
      {isLoading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : isDragActive ? (
        <p className="m-0">Drop the image{isMasterItem ? "" : "s"} here ...</p>
      ) : (
        <p className="m-0">
          Drag 'n' drop {isMasterItem ? "an image" : "up to 3 images"} here, or
          click to select {isMasterItem ? "an image" : "images"}
        </p>
      )}
    </div>
  );
};
export default AddConsignmentOffline;

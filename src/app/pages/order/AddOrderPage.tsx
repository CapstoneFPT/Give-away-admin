import React, { useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import ProductTable from "./ProductTable";
import { formatBalance } from "../utils/utils";
import {
  CreateOrderRequest,
  ShopApi,
  AccountApi,
  AccountResponse,
} from "../../../api/api";
import { useAuth } from "../../modules/auth";

import { useMutation, useQueryClient } from "react-query";
import { Tabs, Tab } from "react-bootstrap";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import { showAlert } from "../../../utils/Alert";
import { useNavigate } from "react-router-dom";

const AddOrderPage = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [buyerName, setBuyerName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [activeTab, setActiveTab] = useState<string>("manual");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] =
    useState<AccountResponse | null>(null);
  const navigate = useNavigate();
  const pageSize = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const shopId = currentUser?.shopId;

  const createOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderRequest) => {
      const shopApi = new ShopApi();
      return shopApi.apiShopsShopIdOrdersPost(shopId!, orderData);
    },
    onSuccess: (data) => {
      showAlert("success", "Order created successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["fashionItems"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      navigate(`/order-detail/${data.data.data?.orderId}`);
    },
    onError: () => {
      showAlert("error", "Failed to create order.");
    },
  });

  const findAccountMutation = useMutation({
    mutationFn: async (params: { phone: string; page: number; pageSize: number }) => {
      const userApi = new AccountApi();
      return await userApi.apiAccountsGet(
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
        setAccounts(data.data.items);
        setTotalPages(Math.ceil((data.data.totalCount || 0) / pageSize));
      } else {
        showAlert("error", "No accounts found with this phone number.");
        setAccounts([]);
        setTotalPages(1);
      }
      setIsLoading(false);
    },
    onError: () => {
      showAlert("error", "Failed to find account with error.");
      setAccounts([]);
      setTotalPages(1);
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orderData: CreateOrderRequest = {
      recipientName: buyerName,
      phone: phoneNumber,
      itemIds: selectedItems,
    };
    createOrderMutation.mutate(orderData);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    setSelectedAccount(null);
    setAccounts([]);
  };

  const handleFindAccount = () => {
    if (phoneNumber) {
      findAccountMutation.mutate({
        phone: phoneNumber,
        page: currentPage,
        pageSize,
      });
    } else {
      showAlert("error", "Please enter a phone number.");
    }
  };

  const handleSelectAccount = (account: AccountResponse) => {
    setSelectedAccount(account);
    setBuyerName(account.fullname || "");
    setPhoneNumber(account.phone || "");
    setActiveTab("manual");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    findAccountMutation.mutate({ phone: phoneNumber, page: newPage, pageSize });
  };

  const handleBackToSearch = () => {
    setSelectedAccount(null);
    setBuyerName("");
    setPhoneNumber("");
    setActiveTab("findAccount");
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

  const subtotal = totalCost;
  const total = subtotal;

  return (
    <Content>
      <h1 className="mb-5">Create Order</h1>
      <div className="app-container container-xxl">
        <form
          id="kt_ecommerce_edit_order_form"
          className="form d-flex flex-column flex-lg-row gap-7 gap-lg-10"
          onSubmit={handleSubmit}
        >
          <div
            className={`d-flex flex-column gap-7 gap-lg-10 ${
              selectedAccount ? "w-100 w-lg-300px" : "w-100 w-lg-400px"
            } mb-7 me-lg-10`}
          >
            <div className="card card-flush py-4">
              <div className="card-header">
                <div className="card-title">
                  <h2>Order Details</h2>
                </div>
              </div>
              <div className="card-body pt-0">
                {selectedAccount ? (
                  <>
                    <div className="d-flex flex-column mb-7">
                      <div className="fs-6 fw-bold mb-2">Phone Number:</div>
                      <div className="fs-6">{selectedAccount.phone}</div>
                    </div>
                    <div className="d-flex flex-column mb-7">
                      <div className="fs-6 fw-bold mb-2">Buyer's Name:</div>
                      <div className="fs-6">{selectedAccount.fullname}</div>
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
                  <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k || "manual")}
                    className="mb-5 nav-tabs-custom"
                  >
                    <Tab eventKey="manual" title="Enter Manually">
                      <div className="fv-row mb-7">
                        <label className="form-label fs-6 fw-bold mb-3">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder="Enter phone number"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          required
                        />
                      </div>
                      <div className="fv-row mb-7">
                        <label className="form-label fs-6 fw-bold mb-3">
                          Buyer's Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder="Enter buyer's name"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          required
                        />
                      </div>
                    </Tab>
                    <Tab eventKey="findAccount" title="Find Account">
                      <div className="fv-row mb-7">
                        <label className="form-label fs-6 fw-bold mb-3">
                          Phone Number
                        </label>
                        <div className="input-group input-group-solid">
                          <input
                            type="text"
                            className="form-control form-control-solid"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            required
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
                    </Tab>
                  </Tabs>
                )}

                <div className="d-flex flex-column mb-7">
                  <div className="fs-5 fw-bold mb-2">Subtotal:</div>
                  <div className="fs-5">{formatBalance(subtotal)} VND</div>
                </div>
                <div className="d-flex flex-column mb-7">
                  <div className="fs-5 fw-bold mb-2">Total:</div>
                  <div className="fs-5">{formatBalance(total)} VND</div>
                </div>

                <div className="mt-10">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={createOrderMutation.isLoading}
                  >
                    {createOrderMutation.isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Checking out...
                      </>
                    ) : (
                      "Checkout"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-lg-row-fluid gap-7 gap-lg-10">
            {accounts.length > 0 && !selectedAccount && (
              <div className="card card-flush py-4 mb-7">
                <div className="card-header">
                  <div className="card-title">
                    <h2>Found Accounts</h2>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <KTTable
                    columns={accountColumns}
                    data={accounts}
                    totalCount={accounts.length}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    loading={isLoading}
                    onPageChange={handlePageChange}
                    totalPages={totalPages}
                  />
                </div>
              </div>
            )}

            <div className="card card-flush py-4">
              <div className="card-header">
                <div className="card-title">
                  <h2>Select Products</h2>
                </div>
              </div>
              <div className="card-body pt-0">
                <div className="d-flex flex-column gap-10">
                  <ProductTable
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    setTotalCost={setTotalCost}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Content>
  );
};

export default AddOrderPage;

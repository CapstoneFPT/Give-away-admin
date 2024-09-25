import React, { useEffect, useState } from "react";
import { AccountApi, OrderApi, TransactionApi } from "../../../api";
import { KTIcon } from "../../../_metronic/helpers";

const Total: React.FC<{ className: string }> = ({ className }) => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalStaff, setTotalStaff] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalStaff();
    fetchTotalOrders();
    fetchTotalTransactions();
  }, []);

  const fetchTotalUsers = async () => {
    const accountAPI = new AccountApi();
    const usersResponse = await accountAPI.apiAccountsGet();
    setTotalUsers(usersResponse.data.totalCount ?? 0);
  };

  const fetchTotalStaff = async () => {
    const accountAPI = new AccountApi();
    const staffResponse = await accountAPI.apiAccountsGet(null!, null!, null!, null!, "Staff");
    setTotalStaff(staffResponse.data.totalCount ?? 0);
  };

  const fetchTotalOrders = async () => {
    const orderAPI = new OrderApi();
    const ordersResponse = await orderAPI.apiOrdersGet();
    setTotalOrders(ordersResponse.data.totalCount ?? 0);
  };

  const fetchTotalTransactions = async () => {
    const transactionAPI = new TransactionApi();
    const transactionsResponse = await transactionAPI.apiTransactionsGet();
    setTotalTransactions(transactionsResponse.data?.data?.totalCount ?? 0);
  };

  return (
    <div className={`card ${className}`}>
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Totals Overview</span>
        </h3>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                  <KTIcon iconName="user" className="fs-2 text-primary me-3" />
                  <span className="card-label fw-bold fs-4">Total Customer</span>
                </h3>
              </div>
              <div className="card-body">
                <p>{totalUsers} Customer</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                  <KTIcon iconName="group" className="fs-2 text-success me-3" />
                  <span className="card-label fw-bold fs-4">Total Staff</span>
                </h3>
              </div>
              <div className="card-body">
                <p>{totalStaff} Staffs</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                  <KTIcon iconName="shopping-cart" className="fs-2 text-warning me-3" />
                  <span className="card-label fw-bold fs-4">Total Orders</span>
                </h3>
              </div>
              <div className="card-body">
                <p>{totalOrders} Orders</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                  <KTIcon iconName="money" className="fs-2 text-danger me-3" />
                  <span className="card-label fw-bold fs-4">Total Transactions</span>
                </h3>
              </div>
              <div className="card-body">
                <p>{totalTransactions} Transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Total };

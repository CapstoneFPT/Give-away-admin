/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { MasterItemApi } from "../../../../api";

const FashionItemsAdminTable: React.FC = () => {
  const { id } = useParams(); // Get the master product ID from the URL
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const result = useQuery(
    ["IndividualFashionItems", id, currentPage],
    async () => {
      const fashionItemApi = new MasterItemApi();
      const response =
        await fashionItemApi.apiMasterItemsMasterItemIdIndividualItemsGet(
          id!, // Pass the master product ID to fetch individual items
          null!,
          pageSize
        );
      return response.data;
    },
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );

  if (result.isLoading) return <div>Loading...</div>;
  if (result.error)
    return <div>An error occurred: {(result.error as Error).message}</div>;

  return (
    <div className="card">
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Individual Fashion Items List
          </span>
        </h3>
      </div>
      <div className="card-body py-3">
        <div className="table-responsive">
          <table className="table align-middle gs-0 gy-4">
            <thead>
              <tr className="fw-bold text-muted bg-light">
                <th className="ps-4 min-w-125px rounded-start">Item Code</th>
                <th className="min-w-200px">Product</th>
                <th className="min-w-200px">Description</th>
                <th className="min-w-125px">Stock Count</th>
                <th className="min-w-150px">Created Date</th>
                <th className="min-w-150px">Brand</th>
                <th className="min-w-200px text-end rounded-end"></th>
              </tr>
            </thead>
            <tbody>
              {result.data?.items!.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.itemCode}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.stockCount}</td>
                  <td>{new Date(item.createdDate!).toLocaleDateString()}</td>
                  <td>{item.brand}</td>
                  <td className="text-end">{/* Action buttons here */}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FashionItemsAdminTable;

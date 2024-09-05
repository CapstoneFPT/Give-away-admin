import React from "react";
import { Column } from "react-table";
import { FashionItemList } from "../../../api";
import { KTIcon } from "../../../_metronic/helpers";
import { useNavigate } from 'react-router-dom';

export const columns: Column<FashionItemList>[] = [
  {
    Header: "Item Code",
    accessor: "itemCode",
  },
  {
    Header: "Product",
    accessor: "name",
    Cell: ({ row }) => (
      <div className="d-flex align-items-center">
        <div className="symbol symbol-50px me-5">
          <img src={row.original.image!} alt={row.original.name || "N/A"} />
        </div>
        <div className="d-flex justify-content-start flex-column">
          <span className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6">
            {row.original.name}
          </span>
          <span className="text-muted fw-semibold text-muted d-block fs-7">
            {row.original.gender}
          </span>
        </div>
      </div>
    ),
  },
  {
    Header: "Brand",
    accessor: "brand",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Color",
    accessor: "color",
  },
  {
    Header: "Size",
    accessor: "size",
  },
  {
    Header: "Condition",
    accessor: "condition",
  },
  {
    Header: "Selling Price",
    accessor: "sellingPrice",
    Cell: ({ value }) => `${value?.toLocaleString()} VND`,
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Type",
    accessor: "type",
  },
  {
    Header: "Actions",
    Cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => navigate(`/product/product-list/list-fashion/${row.original.masterItemId}/${row.original.itemId}`)}
        >
          View Details
        </button>
      );
    },
  },
];
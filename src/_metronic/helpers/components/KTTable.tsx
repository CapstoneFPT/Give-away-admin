import React from "react";
import { useTable, useSortBy, UseTableOptions } from "react-table";
import { KTIcon } from "./KTIcon";

interface KTTableProps {
  columns: any[];
  data: any[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  loading: boolean;
  totalPages: number;
}

export const KTTable: React.FC<KTTableProps> = ({
  columns,
  data,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  loading,
  totalPages,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns,
        data,
      } as UseTableOptions<object>,
      useSortBy
    );

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          disabled={i === currentPage || loading}
          className={`btn btn-sm ${
            i === currentPage ? "btn-primary" : "btn-light-primary"
          } me-2`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <>
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Items</span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            Total Items: {totalCount}
          </span>
        </h3>
      </div>
      <div className="card-body py-3">
        <div className="table-responsive">
          <table {...getTableProps()} className="table align-middle gs-0 gy-4">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="fw-bold text-muted bg-light"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(
                        (column as any).getSortByToggleProps()
                      )}
                      className="ps-4 min-w-125px rounded-start"
                    >
                      {column.render("Header")}
                      <span>
                        {(column as any).isSorted
                          ? (column as any).isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="card-footer d-flex justify-content-between align-items-center">
        <div>
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
        </div>
        <div>
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
            className="btn btn-sm btn-light-primary me-2"
          >
            <KTIcon iconName="double-left" className="fs-2" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="btn btn-sm btn-light-primary me-2"
          >
            <KTIcon iconName="left" className="fs-2" />
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="btn btn-sm btn-light-primary me-2"
          >
            <KTIcon iconName="right" className="fs-2" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="btn btn-sm btn-light-primary"
          >
            <KTIcon iconName="double-right" className="fs-2" />
          </button>
        </div>
      </div>
    </>
  );
};

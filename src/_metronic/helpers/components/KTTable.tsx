import React from 'react';
import { useTable, usePagination, useSortBy, useGlobalFilter, UsePaginationInstanceProps, TableInstance, UsePaginationState, UseSortByState, UseGlobalFiltersState, UseGlobalFiltersInstanceProps, TableState, UseTableOptions } from 'react-table';
import { KTIcon } from './KTIcon';

interface KTTableProps {
  columns: any[];
  data: any[];
  totalCount: number;
  pageCount: number;
  fetchData: (pageIndex: number, pageSize: number, sortBy: any) => void;
  loading: boolean;
}

export const KTTable: React.FC<KTTableProps> = ({
  columns,
  data,
  totalCount,
  pageCount: controlledPageCount,
  fetchData,
  loading,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy},
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
      manualPagination: true,
      manualSortBy: true,
      pageCount: controlledPageCount,
    } as UseTableOptions<object>,
    useGlobalFilter,
    useSortBy,
    usePagination
  ) as TableInstance<object> & UsePaginationInstanceProps<object> & UseGlobalFiltersInstanceProps<object> & {
    state: UsePaginationState<object> & UseSortByState<object> & UseGlobalFiltersState<object>
  };

  React.useEffect(() => {
    fetchData(pageIndex, pageSize, sortBy);
  }, [fetchData, pageIndex, pageSize, sortBy]);

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
                <tr {...headerGroup.getHeaderGroupProps()} className="fw-bold text-muted bg-light">
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps((column as any).getSortByToggleProps())} className="ps-4 min-w-125px rounded-start">
                      {column.render('Header')}
                      <span>
                        {(column as any).isSorted ? ((column as any).isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
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
          Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount} entries
        </div>
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage || loading} className="btn btn-sm btn-light-primary me-2">
            <KTIcon iconName="double-left" className="fs-2" />
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage || loading} className="btn btn-sm btn-light-primary me-2">
            <KTIcon iconName="left" className="fs-2" />
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage || loading} className="btn btn-sm btn-light-primary me-2">
            <KTIcon iconName="right" className="fs-2" />
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage || loading} className="btn btn-sm btn-light-primary">
            <KTIcon iconName="double-right" className="fs-2" />
          </button>
        </div>
      </div>
    </>
  );
};
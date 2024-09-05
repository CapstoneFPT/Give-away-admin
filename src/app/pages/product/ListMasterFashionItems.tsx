import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { KTIcon } from "../../../_metronic/helpers";
import { FashionItemApi, FashionItemList } from "../../../api";
import { useParams, useNavigate } from "react-router-dom";
import { KTTable } from '../../../_metronic/helpers/components/KTTable';
import { Content } from "../../../_metronic/layout/components/content";
import { columns } from "./_columns";

type Props = {
  className: string;
};

const ListMasterFashionItems: React.FC<Props> = ({ className }) => {
  const { masterItemId } = useParams<{ masterItemId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const fetchData = useCallback(async (pageIndex: number, pageSize: number, sortBy: any) => {
    const fashionItemApi = new FashionItemApi();
    const response = await fashionItemApi.apiFashionitemsGet(
      null!, // itemCode
      null!, // memberId
      null!, // gender
      null!, // color
      null!, // size
      null!, // condition
      null!, // minPrice
      null!, // maxPrice
      null!, // status
      null!, // type
      sortBy.length > 0 ? sortBy[0].id : null!, // sortBy
      sortBy.length > 0 ? sortBy[0].desc : false, // sortDescending
      pageIndex + 1, // pageNumber
      pageSize, // pageSize
      searchTerm, // name
      null!, // categoryId
      null!, // shopId
      masterItemId, // masterItemId
      null! // masterItemCode
    );
    return {
      data: response.data.items || [],
      pageCount: Math.ceil(response.data.totalCount! / pageSize),
      totalCount: response.data.totalCount!,
    };
  }, [searchTerm, masterItemId]);


  const { data, isLoading, error } = useQuery(
    ["FashionItems", searchTerm, masterItemId],
    () => fetchData(0, pageSize, []),
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );

  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <Content>
      <div className={`card ${className}`}>
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">Individual Products</span>
            <span className="text-muted mt-1 fw-semibold fs-7">
              Over {data?.totalCount || 0} products
            </span>
          </h3>
          <div className="card-toolbar">
            <div className="d-flex align-items-center position-relative">
              <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-4" />
              <input
                type="text"
                className="form-control form-control-solid w-250px ps-12"
                placeholder="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <KTTable
          columns={columns}
          data={data?.data || []}
          totalCount={data?.totalCount || 0}
          pageCount={data?.pageCount || 0}
          fetchData={fetchData}
          loading={isLoading}
        />
      </div>
    </Content>
  );
};

export default ListMasterFashionItems;

import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { KTCard, KTCardBody, KTIcon } from "../../../../_metronic/helpers";
import { FashionItemApi } from "../../../../api";

const fetchItemDetail = async (itemId: string) => {
  const fashionItemApi = new FashionItemApi();
  const response = await fashionItemApi.apiFashionitemsItemIdGet(itemId);
  return response.data.data; // Adjust if the data path is different
};

const ItemDetail: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();

  const {
    data: item,
    error,
    isLoading,
  } = useQuery(
    ["itemDetail", itemId],
    () => {
      if (!itemId) {
        throw new Error("Item ID is required");
      }
      return fetchItemDetail(itemId);
    },
    {
      enabled: !!itemId, // Only run the query if itemId is available
      retry: false, // Optionally disable retries for this query
    }
  );
  console.log(item);
  if (isLoading)
    return <div className="text-blue-500 text-center py-4">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-4">
        {`Failed to fetch item details: ${(error as Error).message}`}
      </div>
    );

  return (
    <KTCard className="card-flush py-4 flex-row-fluid ">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="card-title">
            <h2>Item Details ({item?.itemCode})</h2>
          </div>
          {!item?.isConsignment && (
            <div className="text-center">
              <button className="btn btn-success hover-rotate-end">
                Update
              </button>
            </div>
          )}
        </div>
      </div>
      <KTCardBody className="pt-0 ">
        {item && (
          <div className="table-responsive">
            <div className="row g-5 g-xl-8 mt-5">
              <div className="col-xl-12">
                <KTCard>
                  <KTCardBody>
                    <h3 className="fs-2 fw-bold mb-5">Product Images</h3>
                    <div className="d-flex flex-wrap gap-3">
                      {item.images?.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Product ${index + 1}`}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </div>
                  </KTCardBody>
                </KTCard>
              </div>
            </div>
            <table className="table align-middle table-row-bordered mb-0 fs-6 gy-5 min-w-300px  ">
              <tbody className="fw-semibold text-gray-600 ">
                <tr>
                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <KTIcon iconName="tag" className="fs-2 me-2" />
                      Item Code
                    </div>
                  </td>
                  <td className="fw-bold text-end">{item.itemCode}</td>
                </tr>
                <tr>
                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <KTIcon iconName="tag" className="fs-2 me-2" />
                      Type
                    </div>
                  </td>
                  <td className="fw-bold text-end">
                    {item?.isConsignment ? "Consigned Item" : "Shop Item"}
                  </td>
                </tr>
                <tr>
                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <KTIcon iconName="cash" className="fs-2 me-2" />
                      Selling Price
                    </div>
                  </td>
                  <td className="fw-bold text-end">
                    {item.sellingPrice!.toLocaleString()} VND
                  </td>
                </tr>
                <tr>
                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <KTIcon iconName="file-text" className="fs-2 me-2" />
                      Description
                    </div>
                  </td>
                  <td className="fw-bold text-end">{item.description}</td>
                </tr>
                <tr>
                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <KTIcon iconName="heart" className="fs-2 me-2" />
                      Condition
                    </div>
                  </td>
                  <td className="fw-bold text-end">{item.condition}</td>
                </tr>
                <tr>
                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <KTIcon iconName="info" className="fs-2 me-2" />
                      Status
                    </div>
                  </td>
                  <td className="fw-bold text-end">{item.status}</td>
                </tr>
                <tr>
                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <KTIcon iconName="location-pin" className="fs-2 me-2" />
                      Shop Address
                    </div>
                  </td>
                  <td className="fw-bold text-end">{item.shopAddress}</td>
                </tr>
                <tr>
                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <KTIcon iconName="list" className="fs-2 me-2" />
                      Category
                    </div>
                  </td>
                  <td className="fw-bold text-end">{item.categoryName}</td>
                </tr>
                <tr>
                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <KTIcon iconName="expand" className="fs-2 me-2" />
                      Size
                    </div>
                  </td>
                  <td className="fw-bold text-end">{item.size}</td>
                </tr>
                <tr>
                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <KTIcon iconName="color-lens" className="fs-2 me-2" />
                      Color
                    </div>
                  </td>
                  <td className="fw-bold text-end">{item.color}</td>
                </tr>
                <tr>
                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <KTIcon iconName="shop" className="fs-2 me-2" />
                      Brand
                    </div>
                  </td>
                  <td className="fw-bold text-end">{item.brand}</td>
                </tr>
                <tr>
                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <KTIcon iconName="user" className="fs-2 me-2" />
                      Gender
                    </div>
                  </td>
                  <td className="fw-bold text-end">{item.gender}</td>
                </tr>
                <tr>
                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <KTIcon iconName="info-circle" className="fs-2 me-2" />
                      Note
                    </div>
                  </td>
                  <td className="fw-bold text-end">{item.note}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </KTCardBody>
    </KTCard>
  );
};

export default ItemDetail;

import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
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

  if (isLoading)
    return <div className="text-blue-500 text-center py-4">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-4">
        {`Failed to fetch item details: ${(error as Error).message}`}
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      {item && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{item.name}</h1>
            <div className="flex justify-center space-x-4 mt-4">
              {item.images?.map((image, index) => (
                <img
                  style={{ maxWidth: 500 }}
                  key={index}
                  src={image}
                  className="w-48 h-48 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Item Code:</span>
              <span>{item.itemCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Selling Price:
              </span>
              <span>{item.sellingPrice!.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Description:</span>
              <span>{item.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Condition:</span>
              <span>{item.condition}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Status:</span>
              <span>{item.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Shop Address:</span>
              <span>{item.shopAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Category:</span>
              <span>{item.categoryName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Size:</span>
              <span>{item.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Color:</span>
              <span>{item.color}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Brand:</span>
              <span>{item.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Gender:</span>
              <span>{item.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Note:</span>
              <span>{item.note}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;

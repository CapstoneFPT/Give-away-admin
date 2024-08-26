import React, { useEffect, useState } from 'react';
import { KTIcon, toAbsoluteUrl } from '../../../helpers';
import { FashionItemApi } from '../../../../api';

type Props = {
  className: string;
};

const TablesWidget11: React.FC<Props> = ({ className }) => {
  const [products, setProducts] = useState<any[]>([]);

  const fetchMasterProduct = async () => {
    try {
      const productApi = new FashionItemApi();
      const response = await productApi.apiFashionitemsGet();
      setProducts(response.data.items || []);
    } catch (error) {
      console.error("There was an error fetching the products!", error);
    }
  };

  useEffect(() => {
    fetchMasterProduct();
  }, []);

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>New Arrivals</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Over {products.length} new products</span>
        </h3>
        <div className='card-toolbar'>
          <a href='#' className='btn btn-sm btn-light-primary'>
            <KTIcon iconName='plus' className='fs-2' />
            New Member
          </a>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='ps-4 min-w-325px rounded-start'>Product</th>
                <th className='min-w-125px'>Price</th>
                <th className='min-w-200px'>Condition</th>
                <th className='min-w-150px'>Brand</th>
                <th className='min-w-150px'>Status</th>
                <th className='min-w-200px text-end rounded-end'></th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {products.map((product) => (
                <tr key={product.itemId}>
                  <td>
                    <div className='d-flex align-items-center'>
                      <div className='symbol symbol-50px me-5'>
                        <img
                          src={product.image || toAbsoluteUrl('media/stock/600x400/img-placeholder.jpg')}
                          alt={product.name}
                        />
                      </div>
                      <div className='d-flex justify-content-start flex-column'>
                        <a href='#' className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                          {product.name}
                        </a>
                        <span className='text-muted fw-semibold text-muted d-block fs-7'>
                          {product.gender}, {product.size}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                      {product.sellingPrice.toLocaleString()} VND
                    </a>
                  </td>
                  <td>
                    <span className='text-muted fw-semibold text-muted d-block fs-7'>{product.condition}</span>
                  </td>
                  <td>
                    <span className='text-muted fw-semibold text-muted d-block fs-7'>{product.brand}</span>
                  </td>
                  <td>
                    <span className={`badge fs-7 fw-semibold ${
                      product.status === 'PendingForOrder' ? 'badge-light-warning' : 'badge-light-success'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className='text-end'>
                    <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
                      <KTIcon iconName='switch' className='fs-3' />
                    </a>
                    <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
                      <KTIcon iconName='pencil' className='fs-3' />
                    </a>
                    <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                      <KTIcon iconName='trash' className='fs-3' />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* end::Body */}
    </div>
  );
};

export { TablesWidget11 };

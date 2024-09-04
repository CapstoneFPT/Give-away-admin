import React from 'react';
import { KTIcon } from '../../../_metronic/helpers';

interface KTInfoItemProps {
  iconName: string;
  title: string;
  value: string | React.ReactNode;
  className?: string;
}

const KTInfoItem: React.FC<KTInfoItemProps> = ({ iconName, title, value, className = '' }) => {
  return (
    <div className={`border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3 ${className}`}>
      <div className="d-flex align-items-center">
        <KTIcon iconName={iconName} className="fs-3 text-primary me-2" />
        <div className="fs-6 text-gray-800 fw-bold">{title}</div>
      </div>
      <div className="fs-7 text-gray-600 mt-2">
        {value}
      </div>
    </div>
  );
};

export default KTInfoItem;
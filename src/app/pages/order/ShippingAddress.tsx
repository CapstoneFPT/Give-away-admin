import {KTCard, KTCardBody, KTIcon} from "../../../_metronic/helpers";
import {OrderDetailedResponse} from "../../../api";

const ShippingAddress: React.FC<{ orderDetail: OrderDetailedResponse | undefined }> = ({ orderDetail }) => (
    <KTCard className="card-flush py-4 flex-row-fluid position-relative">
        <div className="position-absolute top-0 end-0 bottom-0 opacity-10 d-flex align-items-center me-5">
            <KTIcon iconName='delivery' className='fs-2' />
        </div>
        <div className="card-header">
            <div className="card-title">
                <h2>Shipping Address</h2>
            </div>
        </div>
        <KTCardBody className="pt-0">
            {orderDetail?.address}
        </KTCardBody>
    </KTCard>
);

export default ShippingAddress;
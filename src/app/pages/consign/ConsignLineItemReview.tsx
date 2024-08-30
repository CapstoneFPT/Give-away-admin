import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { formatBalance } from "../utils/utils";
import { Content } from "../../../_metronic/layout/components/content";
import { ConsignSaleLineItemDetailedResponse, SizeType, GenderType } from '../../../api';

export const ConsignLineItemReview: React.FC = () => {
    const { consignSaleId, lineItemId } = useParams<{ consignSaleId: string, lineItemId: string }>();
    const navigate = useNavigate();
    const [lineItem, setLineItem] = useState<ConsignSaleLineItemDetailedResponse | null>(null);
    const [confirmedPrice, setConfirmedPrice] = useState<string>('');

    useEffect(() => {
        // Mock data - replace with API call in real scenario
        const mockItem: ConsignSaleLineItemDetailedResponse = {
            consignSaleLineItemId: lineItemId,
            consignSaleId: consignSaleId,
            dealPrice: 100000,
            note: "This is a sample note for the item. It can contain detailed information about the product's condition, history, or any special considerations.",
            confirmedPrice: null,
            productName: "Sample Product",
            brand: "Sample Brand",
            color: "Red",
            size: SizeType.M,
            gender: GenderType.Male,
            condition: "Good",
            createdDate: new Date().toISOString(),
            images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
        };

        setLineItem(mockItem);
        setConfirmedPrice(mockItem.confirmedPrice ? mockItem.confirmedPrice.toString() : '');
    }, [lineItemId, consignSaleId]);

    const handleConfirmedPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmedPrice(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically make an API call to update the confirmed price
        console.log('Updating confirmed price to:', confirmedPrice);
        // After successful update, navigate back to the consignment detail page
        navigate(`/consignment/${consignSaleId}`);
    };

    if (!lineItem) {
        return <div>Loading...</div>;
    }

    return (
        <Content>
            <div className="row g-5 g-xl-8">
                <div className="col-xl-6">
                    <KTCard>
                        <KTCardBody>
                            <h3 className='fs-2 fw-bold mb-5'>Product Information</h3>
                            <div className='row mb-5'>
                                <div className='col-6'>
                                    <p><strong>Product Name:</strong> {lineItem.productName}</p>
                                    <p><strong>Brand:</strong> {lineItem.brand}</p>
                                    <p><strong>Color:</strong> {lineItem.color}</p>
                                </div>
                                <div className='col-6'>
                                    <p><strong>Size:</strong> {lineItem.size}</p>
                                    <p><strong>Gender:</strong> {lineItem.gender}</p>
                                    <p><strong>Condition:</strong> {lineItem.condition}</p>
                                </div>
                            </div>
                        </KTCardBody>
                    </KTCard>
                </div>
                <div className="col-xl-6">
                    <KTCard>
                        <KTCardBody>
                            <h3 className='fs-2 fw-bold mb-5'>Consignment Details</h3>
                            <div className='row mb-5'>
                                <div className='col-6'>
                                    <p><strong>Consign Sale ID:</strong> {lineItem.consignSaleId}</p>
                                    <p><strong>Line Item ID:</strong> {lineItem.consignSaleLineItemId}</p>
                                    <p><strong>Created Date:</strong> {new Date(lineItem.createdDate!).toLocaleString()}</p>
                                </div>
                                <div className='col-6'>
                                    <p><strong>Deal Price:</strong> {formatBalance(lineItem.dealPrice || 0)}</p>
                                    <p><strong>Confirmed Price:</strong> {lineItem.confirmedPrice ? formatBalance(lineItem.confirmedPrice) : 'Not set'}</p>
                                </div>
                            </div>
                        </KTCardBody>
                    </KTCard>
                </div>
            </div>

            <div className="row g-5 g-xl-8 mt-5">
                <div className="col-xl-12">
                    <KTCard>
                        <KTCardBody>
                            <h3 className='fs-2 fw-bold mb-5'>Note</h3>
                            <div className='bg-light-primary p-5 rounded'>
                                {lineItem.note || 'No note available for this item.'}
                            </div>
                        </KTCardBody>
                    </KTCard>
                </div>
            </div>

            <div className="row g-5 g-xl-8 mt-5">
                <div className="col-xl-12">
                    <KTCard>
                        <KTCardBody>
                            <h3 className='fs-2 fw-bold mb-5'>Product Images</h3>
                            <div className='d-flex flex-wrap gap-3'>
                                {lineItem.images?.map((image, index) => (
                                    <img key={index} src={image} alt={`Product ${index + 1}`} style={{width: '150px', height: '150px', objectFit: 'cover'}} />
                                ))}
                            </div>
                        </KTCardBody>
                    </KTCard>
                </div>
            </div>

            <div className="row g-5 g-xl-8 mt-5">
                <div className="col-xl-12">
                    <KTCard>
                        <KTCardBody>
                            <h3 className='fs-2 fw-bold mb-5'>Update Confirmed Price</h3>
                            <form onSubmit={handleSubmit}>
                                <div className='row mb-5'>
                                    <div className='col-6'>
                                        <label htmlFor="confirmedPrice" className="form-label">Confirmed Price</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="confirmedPrice"
                                            value={confirmedPrice}
                                            onChange={handleConfirmedPriceChange}
                                            placeholder="Enter confirmed price"
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <button type="submit" className='btn btn-primary me-3'>
                                            <KTIcon iconName='check' className='fs-2 me-2'/>
                                            Update Confirmed Price
                                        </button>
                                        <button
                                            type="button"
                                            className='btn btn-secondary'
                                            onClick={() => navigate(`/consignment/${consignSaleId}`)}
                                        >
                                            <KTIcon iconName='arrow-left' className='fs-2 me-2'/>
                                            Back to Consignment
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </KTCardBody>
                    </KTCard>
                </div>
            </div>
        </Content>
    );
};

export default ConsignLineItemReview;
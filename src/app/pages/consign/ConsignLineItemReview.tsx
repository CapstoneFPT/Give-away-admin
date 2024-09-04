import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { formatBalance } from "../utils/utils";
import { Content } from "../../../_metronic/layout/components/content";
import { ConsignLineItemApi, ConsignSaleLineItemStatus, MasterItemApi } from '../../../api';
import { useMutation, useQuery } from "react-query";
import { useAuth } from "../../modules/auth";
import { AddToInventoryModal } from './AddToInventoryModal';
import { PriceDifferenceModal } from './PriceDifferenceModal';
import { ConfirmationModal } from "./ConfirmationModal.tsx";

export const ConsignLineItemReview: React.FC = () => {
    const { consignSaleId, lineItemId } = useParams<{ consignSaleId: string, lineItemId: string }>();
    const navigate = useNavigate();
    const [dealPrice, setDealPrice] = useState<string>('');
    const [isPriceChanged, setIsPriceChanged] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
    const [selectedMasterItem, setSelectedMasterItem] = useState<string>('');
    const [showPriceDifferenceModal, setShowPriceDifferenceModal] = useState<boolean>(false);
    const [priceChangeExplanation, setPriceChangeExplanation] = useState<string>('');

    const { currentUser } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryKey: ['consignSaleLineItem', consignSaleId, lineItemId],
        queryFn: async () => {
            const consignLineItemApi = new ConsignLineItemApi();
            const response = await consignLineItemApi.apiConsignlineitemsConsignLineItemIdGet(lineItemId!);
            return response.data;
        },
        onSuccess: (data) => {
            setDealPrice(!data.dealPrice ? data.expectedPrice!.toString() : data.dealPrice!.toString());
        }
    });
    const { data: masterItemsData, isLoading: masterItemsLoading, error: masterItemsError } = useQuery({
        queryKey: ['masterItems'],
        queryFn: async () => {
            const masterItemApi = new MasterItemApi();
            const response = await masterItemApi.apiMasterItemsGet(null!, null!, null!, null!, null!, currentUser?.shopId, data!.gender!, true);
            return response.data;
        }
    });

    const readyForConsignMutation = useMutation(
        (data: { dealPrice: number }) => {
            const consignSaleLineItemApi = new ConsignLineItemApi();
            return consignSaleLineItemApi.apiConsignlineitemsConsignLineItemIdReadyForConsignPut(lineItemId!, data);
        },
        {
            onSuccess: () => {
                navigate(`/consignment/${consignSaleId}`);
            },
            onError: (error) => {
                console.error('Error setting item ready for consign:', error);
            }
        }
    );


    const createIndividualMutation = useMutation(
        (data: { masterItemId: string, dealPrice: number }) => {
            const consignLineItemApi = new ConsignLineItemApi();
            return consignLineItemApi.apiConsignlineitemsConsignLineItemIdCreateIndividualAfterNegotiationPost(lineItemId!, data);
        },
        {
            onSuccess: () => {
                setShowModal(false);
                navigate(`/consignment/${consignSaleId}`);
            },
            onError: (error) => {
                console.error('Error creating individual item:', error);
            }
        }
    );

    const createIndividualAfterNegotiationMutation = useMutation(
        (data: { masterItemId: string }) => {
            const consignLineItemApi = new ConsignLineItemApi();
            return consignLineItemApi.apiConsignlineitemsConsignLineItemIdCreateIndividualAfterNegotiationPost(lineItemId!, data);
        },
        {
            onSuccess: () => {
                setShowModal(false);
                navigate(`/consignment/${consignSaleId}`);
            },
            onError: (error) => {
                console.log(lineItemId)
                console.error('Error creating individual item after negotiation:', error);
            }
        }
    );

    const negotiatePriceMutation = useMutation(
        (data: { dealPrice: number, responseFromShop: string }) => {
            const consignSaleLineItem = new ConsignLineItemApi();
            return consignSaleLineItem.apiConsignlineitemsConsignLineItemIdNegotiateItemPut(lineItemId!, data);
        },
        {
            onSuccess: () => {
                setShowPriceDifferenceModal(false);
                navigate(`/consignment/${consignSaleId}`);
            },
            onError: (error) => {
                console.error('Error negotiating item price:', error);
            }
        }
    );

    const handleMasterItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMasterItem(e.target.value);
    };

    const handleConfirmedPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = e.target.value;
        setDealPrice(newPrice);
        setIsPriceChanged(newPrice !== data?.expectedPrice?.toString());
    };

    const handleCreateItemModalSubmit = () => {
        if (!selectedMasterItem) {
            console.error('Please select a master item');
            return;
        }

        if (dealPrice === data?.expectedPrice?.toString()) {
            createIndividualMutation.mutate({
                masterItemId: selectedMasterItem,
                dealPrice: parseFloat(dealPrice)
            });
        } else {
            createIndividualAfterNegotiationMutation.mutate({
                masterItemId: selectedMasterItem
            });
        }
    };

    const handleCreateNewItem = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setShowPriceDifferenceModal(false);
        setPriceChangeExplanation('');
    };

    const handleConfirmation = () => {
        readyForConsignMutation.mutate({
            dealPrice: parseFloat(dealPrice)
        });
        setShowConfirmationModal(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (dealPrice === data?.expectedPrice?.toString()) {
            setShowConfirmationModal(true);
        } else {
            setShowPriceDifferenceModal(true);
        }
    };


    const handlePriceDifferenceSubmit = () => {
        if (!dealPrice || !priceChangeExplanation.trim()) {
            console.error('Please provide both a price and an explanation');
            return;
        }

        negotiatePriceMutation.mutate({
            dealPrice: parseFloat(dealPrice),
            responseFromShop: priceChangeExplanation
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !data) {
        return <div>Error loading data</div>;
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
                                    <p><strong>Product Name:</strong> {data.productName}</p>
                                    <p><strong>Brand:</strong> {data.brand}</p>
                                    <p><strong>Color:</strong> {data.color}</p>
                                </div>
                                <div className='col-6'>
                                    <p><strong>Size:</strong> {data.size}</p>
                                    <p><strong>Gender:</strong> {data.gender}</p>
                                    <p><strong>Condition:</strong> {data.condition}</p>
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
                                    <p><strong>Consignment Code :</strong> {data.consignSaleCode}</p>
                                    <p><strong>Line Item ID:</strong> {data.consignSaleLineItemId}</p>
                                    <p><strong>Created Date:</strong> {new Date(data.createdDate!).toLocaleString()}</p>
                                </div>
                                <div className='col-6'>
                                    <p><strong>Expected Price:</strong> {formatBalance(data.expectedPrice || 0)} VND</p>
                                    <p><strong>Deal Price:</strong> {formatBalance(data.dealPrice || 0)} VND</p>
                                    <p><strong>Confirmed Price:</strong> {data.confirmedPrice ? formatBalance(data.confirmedPrice) + ' VND' : 'Not set'}</p>
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
                                {data.note || 'No note available for this item.'}
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
                                {data.images?.map((image, index) => (
                                    <img key={index} src={image} alt={`Product ${index + 1}`} style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
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
                            <h3 className='fs-2 fw-bold mb-5'>Add Deal Price</h3>
                            <form onSubmit={handleSubmit}>
                                <div className='row mb-5'>
                                    <div className='col-6'>
                                        <label htmlFor="confirmedPrice" className="form-label">Deal Price</label>
                                        <input
                                            type="number"
                                            className={`form-control ${isPriceChanged ? 'border-warning' : ''}`}
                                            id="confirmedPrice"
                                            value={dealPrice}
                                            readOnly={!!data.dealPrice}
                                            onChange={handleConfirmedPriceChange}
                                            placeholder="Enter deal price"
                                        />
                                        {isPriceChanged && (
                                            <div className="text-warning mt-2">
                                                Changing the deal price will require negotiation
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <button type="submit" disabled={!!data.dealPrice} className='btn btn-primary me-3'>
                                            <KTIcon iconName='check' className='fs-2 me-2' />
                                            {data.dealPrice ? 'Deal Price Decided' : 'Submit Deal Price'}
                                        </button>
                                        <button
                                            type="button"
                                            className='btn btn-success me-3'
                                            disabled={!!data.individualItemId || !data.dealPrice || data.status != ConsignSaleLineItemStatus.ReadyForConsignSale}
                                            onClick={handleCreateNewItem}
                                        >
                                            <KTIcon iconName='plus' className='fs-2 me-2' />
                                            Add To Inventory
                                        </button>
                                        <button
                                            type="button"
                                            className='btn btn-secondary'
                                            onClick={() => navigate(`/consignment/${consignSaleId}`)}
                                        >
                                            <KTIcon iconName='arrow-left' className='fs-2 me-2' />
                                            Back to Consignment
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </KTCardBody>
                    </KTCard>
                </div>
            </div>

            <AddToInventoryModal
                isOpen={showModal}
                onClose={handleModalClose}
                data={data}
                selectedMasterItem={selectedMasterItem}
                handleMasterItemChange={handleMasterItemChange}
                masterItemsData={masterItemsData}
                handleCreateItemModalSubmit={handleCreateItemModalSubmit}
                createIndividualMutation={createIndividualMutation}
                createIndividualAfterNegotiationMutation={createIndividualAfterNegotiationMutation}
            />

            <PriceDifferenceModal
                isOpen={showPriceDifferenceModal}
                onClose={handleModalClose}
                data={data}
                dealPrice={dealPrice}
                priceChangeExplanation={priceChangeExplanation}
                setPriceChangeExplanation={setPriceChangeExplanation}
                handlePriceDifferenceSubmit={handlePriceDifferenceSubmit}
                negotiatePriceMutation={negotiatePriceMutation}
            />

            <ConfirmationModal
                isOpen={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={handleConfirmation}
                dealPrice={dealPrice}
                isLoading={readyForConsignMutation.isLoading}
            />

            {(createIndividualMutation.isError || negotiatePriceMutation.isError || readyForConsignMutation.isError) && (
                <div className="alert alert-danger" role="alert">
                    An error occurred while saving the changes. Please try again.
                </div>
            )}
        </Content>
    );
};

export default ConsignLineItemReview;
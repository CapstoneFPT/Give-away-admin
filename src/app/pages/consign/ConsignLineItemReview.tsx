import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {KTCard, KTCardBody, KTIcon, KTSVG} from "../../../_metronic/helpers";
import {formatBalance} from "../utils/utils";
import {Content} from "../../../_metronic/layout/components/content";
import {ConsignLineItemApi, MasterItemApi, MasterItemListResponse} from '../../../api';
import {useMutation, useQuery} from "react-query";
import {useAuth} from "../../modules/auth";

export const ConsignLineItemReview: React.FC = () => {
    const {consignSaleId, lineItemId} = useParams<{ consignSaleId: string, lineItemId: string }>();
    const navigate = useNavigate();
    const [confirmedPrice, setConfirmedPrice] = useState<string>('');
    const [isPriceChanged, setIsPriceChanged] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [selectedMasterItem, setSelectedMasterItem] = useState<string>('');


    const {currentUser} = useAuth();
    const consignLineItemApi = new ConsignLineItemApi();
    // const differentExpectValue = consignLineItemApi.apiConsignlineitemsConsignLineItemIdAprroveNegotiationPut(lineItemId!)
    // const equalExpectedValue = consignLineItemApi.apiConsignlineitemsConsignLineItemIdCreateIndividualPost(lineItemId!,
    //     {
    //         masterItemId: data?.masterItemId,
    //         dealPrice: confirmedPrice
    //     })

    const masterItemApi = new MasterItemApi();
    const response = masterItemApi.apiMasterItemsGet(null!, null!, null!, null!, null!, currentUser?.shopId);
    const createIndividualMutation = useMutation(
        (data: { masterItemId: string, dealPrice: number }) => {
            const consignLineItemApi = new ConsignLineItemApi();
            return consignLineItemApi.apiConsignlineitemsConsignLineItemIdCreateIndividualPost(lineItemId!, data);
        },
        {
            onSuccess: () => {
                // Handle successful creation
                setShowModal(false);
                navigate(`/consignment/${consignSaleId}`);
            },
            onError: (error) => {
                // Handle error
                console.error('Error creating individual item:', error);
                // You might want to show an error message to the user here
            }
        }
    );
    const handleMasterItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMasterItem(e.target.value);
    };
    const {data, isLoading, error} = useQuery({
        queryKey: ['consignSaleLineItem', consignSaleId, lineItemId],
        queryFn: async () => {
            const consignLineItemApi = new ConsignLineItemApi();
            const response = await consignLineItemApi.apiConsignlineitemsConsignLineItemIdGet(lineItemId!);
            return response.data;
        },
        onSuccess: (data) => {
            setConfirmedPrice(data.expectedPrice?.toString() || '');
        }
    });
    const {data: masterItemsData, isLoading: masterItemsLoading, error: masterItemsError} = useQuery({
        queryKey: ['masterItems'],
        queryFn: async () => {
            const masterItemApi = new MasterItemApi();
            const response = await masterItemApi.apiMasterItemsGet(null!, null!, null!, null!, null!, currentUser?.shopId);
            return response.data;
        }
    });
    const handleConfirmedPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = e.target.value;
        setConfirmedPrice(newPrice);
        setIsPriceChanged(newPrice !== data?.expectedPrice?.toString());
    };

    const handleModalSubmit = () => {
        if (!selectedMasterItem || !confirmedPrice) {
            console.error('Please select a master item and confirm the price');
            return;
        }

        console.log("Submit data:", {
            masterItemId: selectedMasterItem,
            dealPrice: parseFloat(confirmedPrice)
        })

        createIndividualMutation.mutate({
            masterItemId: selectedMasterItem,
            dealPrice: parseFloat(confirmedPrice)
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !data) {
        return <div>Error loading data</div>;
    }

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirmedPrice === data?.expectedPrice?.toString()) {
            setShowModal(true);
        } else {
            console.log('Updating confirmed price to:', confirmedPrice);
            navigate(`/consignment/${consignSaleId}`);
        }
    };


    if (!data) {
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
                                    <p><strong>Deal Price:</strong> {formatBalance(data.dealPrice || 0)}</p>
                                    <p><strong>Confirmed
                                        Price:</strong> {data.confirmedPrice ? formatBalance(data.confirmedPrice) : 'Not set'}
                                    </p>
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
                                    <img key={index} src={image} alt={`Product ${index + 1}`}
                                         style={{width: '150px', height: '150px', objectFit: 'cover'}}/>
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
                                            value={confirmedPrice}
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
                                        <button type="submit" className='btn btn-primary me-3'>
                                            <KTIcon iconName='check' className='fs-2 me-2'/>
                                            Add Deal Price
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
            {/* Modal */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{display: showModal ? 'block' : 'none'}}
                 tabIndex={-1} role="dialog">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create New Item</h5>
                            <div
                                className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                                onClick={handleModalClose}
                                aria-label="Close"
                            >
                                <KTSVG path="media/icons/duotune/arrows/arr061.svg" className="svg-icon svg-icon-2x"/>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="fw-bold mb-3">Consign Line Item Details:</h6>
                                    <table className="table table-borderless">
                                        <tbody>
                                        <tr>
                                            <th scope="row">Product Name:</th>
                                            <td>{data.productName}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Brand:</th>
                                            <td>{data.brand}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Color:</th>
                                            <td>{data.color}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Size:</th>
                                            <td>{data.size}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Gender:</th>
                                            <td>{data.gender}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Condition:</th>
                                            <td>{data.condition}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Expected Price:</th>
                                            <td>{formatBalance(data.expectedPrice || 0)}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="fw-bold mb-3">Choose a Master Item:</h6>
                                    <select
                                        id="masterItemSelect"
                                        className="form-select mb-3"
                                        value={selectedMasterItem}
                                        onChange={handleMasterItemChange}
                                    >
                                        <option value="">Select a master item</option>
                                        {masterItemsData && masterItemsData.items?.map((item: MasterItemListResponse) => (
                                            <option key={item.masterItemId} value={item.masterItemId}>
                                                {`${item.itemCode} - ${item.name} - ${item.brand} - ${item.gender}`}
                                            </option>
                                        ))}
                                    </select>

                                    {selectedMasterItem && (
                                        <div className="selected-master-item mt-4">
                                            <h6 className="fw-bold mb-3">Selected Master Item Details:</h6>
                                            {masterItemsData && masterItemsData.items?.find((item: MasterItemListResponse) => item.masterItemId === selectedMasterItem) && (
                                                <>
                                                    <table className="table table-borderless">
                                                        <tbody>
                                                        <tr>
                                                            <th scope="row">Code:</th>
                                                            <td>{masterItemsData.items.find((item: MasterItemListResponse) => item.masterItemId === selectedMasterItem)?.itemCode}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">Name:</th>
                                                            <td>{masterItemsData.items.find((item: MasterItemListResponse) => item.masterItemId === selectedMasterItem)?.name}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">Brand:</th>
                                                            <td>{masterItemsData.items.find((item: MasterItemListResponse) => item.masterItemId === selectedMasterItem)?.brand}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">Gender:</th>
                                                            <td>{masterItemsData.items.find((item: MasterItemListResponse) => item.masterItemId === selectedMasterItem)?.gender}</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    {masterItemsData.items.find((item: MasterItemListResponse) => item.masterItemId === selectedMasterItem)?.images && masterItemsData!.items!.find((item: MasterItemListResponse) => item!.masterItemId! === selectedMasterItem!)!.images!.length > 0 && (
                                                        <div className="text-center mt-3">
                                                            <img
                                                                src={masterItemsData.items.find((item: MasterItemListResponse) => item.masterItemId === selectedMasterItem)?.images?.[0]}
                                                                alt="Master Item"
                                                                className="img-fluid rounded"
                                                                style={{maxWidth: '200px', maxHeight: '200px'}}
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" onClick={handleModalClose}>
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleModalSubmit}
                                disabled={createIndividualMutation.isLoading}
                            >
                                {createIndividualMutation.isLoading ? (
                                    <span className="indicator-progress" style={{display: "block"}}>
              Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>) : 'Save changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <div className="modal-backdrop fade show"></div>}
            {createIndividualMutation.isError && (
                <div className="alert alert-danger" role="alert">
                    An error occurred while saving the changes. Please try again.
                </div>
            )}
        </Content>
    );
};

export default ConsignLineItemReview;
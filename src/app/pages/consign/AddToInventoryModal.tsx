import React from 'react';
import {ConsignSaleLineItemDetailedResponse, MasterItemListResponse} from '../../../api';
import { formatBalance } from "../utils/utils";
import KTModal from "../../../_metronic/helpers/components/KTModal.tsx";

interface AddToInventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ConsignSaleLineItemDetailedResponse;
    selectedMasterItem: string;
    handleMasterItemChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    masterItemsData: any ;
    handleCreateItemModalSubmit: () => void;
    createIndividualMutation: any;
    createIndividualAfterNegotiationMutation: any;
}

export const AddToInventoryModal: React.FC<AddToInventoryModalProps> = ({
                                                                            isOpen,
                                                                            onClose,
                                                                            data,
                                                                            selectedMasterItem,
                                                                            handleMasterItemChange,
                                                                            masterItemsData,
                                                                            handleCreateItemModalSubmit,
                                                                            createIndividualMutation,
                                                                            createIndividualAfterNegotiationMutation
                                                                        }) => {
    return (
        <KTModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add To Inventory"
            footer={
                <>
                    <button type="button" className="btn btn-light" onClick={onClose}>
                        Close
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleCreateItemModalSubmit}
                        disabled={createIndividualMutation.isLoading || createIndividualAfterNegotiationMutation.isLoading}
                    >
                        {(createIndividualMutation.isLoading || createIndividualAfterNegotiationMutation.isLoading) ? (
                            <span className="indicator-progress" style={{display: "block"}}>
                                Please wait...
                                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        ) : 'Save changes'}
                    </button>
                </>
            }
        >
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
                                    {masterItemsData.items.find((item: MasterItemListResponse) => item.masterItemId === selectedMasterItem)?.images && masterItemsData.items.find((item: MasterItemListResponse) => item.masterItemId === selectedMasterItem)!.images!.length > 0 && (
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
        </KTModal>
    );
};
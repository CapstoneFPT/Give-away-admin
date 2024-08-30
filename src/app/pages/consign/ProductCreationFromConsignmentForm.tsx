import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {KTCard, KTCardBody, KTIcon} from "../../../_metronic/helpers";
import {Content} from "../../../_metronic/layout/components/content";
import {ConsignSaleLineItemDetailedResponse, GenderType, SizeType} from '../../../api';
import {useDropzone} from "react-dropzone";

export const ProductCreationFromConsignmentForm: React.FC = () => {
    const {consignSaleId, lineItemId} = useParams<{ consignSaleId: string, lineItemId: string }>();
    const navigate = useNavigate();
    const [lineItem, setLineItem] = useState<ConsignSaleLineItemDetailedResponse | null>(null);
    const [masterItems, setMasterItems] = useState<any[]>([]);
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.gif']
        },
        maxFiles: 10
    });

    const removeFile = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    useEffect(() => {
        // Fetch consign line item data
        // Replace this with actual API call
        const mockLineItem: ConsignSaleLineItemDetailedResponse = {
            // ... (mock data similar to what we used before)
            consignSaleLineItemId: lineItemId,
            consignSaleId: consignSaleId,
            dealPrice: 100000,
            note: "This is a sample note for the item. It can contain detailed information about the product's condition, history, or any special considerations.",
            confirmedPrice: null,
            productName: "Sample Product",
            brand: "Sample Brand",
            color: "Red",
            consignSaleCode: "ABC123",
            fashionItemStatus: "Available",
            size: SizeType.M,
            gender: GenderType.Male,
            condition: "Good",
            createdDate: new Date().toISOString(),
            images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
        };
        setLineItem(mockLineItem);

        // Fetch master items
        // Replace this with actual API call
        const mockMasterItems = [
            {value: '1', label: 'Master Item 1'},
            {value: '2', label: 'Master Item 2'},
            // ... more items
        ];
        setMasterItems(mockMasterItems);
    }, [consignSaleId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted');
        // Navigate back to consignment list or wherever appropriate
        navigate('/consignment');
    };

    if (!lineItem) {
        return <div>Loading...</div>;
    }

    return (
        <Content>
            <KTCard>
                <KTCardBody>
                    <div className="card card-flush py-4">
                        <div className="card-header">
                            <div className="card-title">
                                <h2>Create New Product</h2>
                            </div>
                        </div>
                        <div className="card-body pt-0">
                            <div className="mb-10">
                                <label className="form-label">Master Items</label>
                                <select
                                    className='form-select form-select-lg form-select-solid'
                                    data-control='select2'
                                    data-placeholder='Select Language...'
                                    value={masterItems[0].value}
                                    onChange={(e) => console.log("JHaja")}
                                >
                                    {
                                        masterItems.map((item) => (
                                            <option key={item.value} value={item.value}>{item.label}</option>
                                        ))
                                    }
                                </select>
                                <div className="text-muted fs-7 mb-7">Select a master item for the product.</div>
                                <a href="#" className="btn btn-light-primary btn-sm mb-10">
                                    <KTIcon iconName='plus' className='fs-2'/>
                                    Create new category
                                </a>
                            </div>

                            <div className="mb-10">
                                <label className="form-label d-block">Tags</label>
                                <input type="text" className="form-control mb-2" placeholder="Enter tag"/>
                                <div className="text-muted fs-7">Add tags to a product.</div>
                            </div>
                        </div>
                    </div>

                    <div className="card card-flush py-4">
                        <div className="card-header">
                            <div className="card-title">
                                <h2>Media</h2>
                            </div>
                        </div>
                        <div className="card-body pt-0">
                            <div {...getRootProps()} className="dropzone">
                                <input {...getInputProps()} />
                                <div className="dz-message needsclick d-flex flex-column align-items-center">
                                    <KTIcon iconName='file-up' className='text-primary fs-3x mb-3' />
                                    <h4 className="text-gray-900 fw-bold fs-4">Drop files here or click to upload.</h4>
                                    <span className="fs-7 text-gray-500 mt-1">Upload up to 10 files</span>
                                </div>
                            </div>
                            <div className="text-muted fs-7 mt-2">Set the product media gallery.</div>

                            {files.length > 0 && (
                                <div className="mt-5">
                                    <h3 className="fs-5 fw-bold text-gray-900 mb-3">Uploaded Files:</h3>
                                    <div className="d-flex flex-wrap gap-5">
                                        {files.map((file, index) => (
                                            <div key={index} className="d-flex flex-column align-items-center">
                                                <div className="position-relative">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`preview ${index}`}
                                                        style={{width: '100px', height: '100px', objectFit: 'cover'}}
                                                        className="rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-10px',
                                                            right: '-10px',
                                                        }}
                                                    >
                                                        <KTIcon iconName='cross' className='fs-2'/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </KTCardBody>
            </KTCard>
        </Content>
    )
        ;
};


export default ProductCreationFromConsignmentForm;
import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { Content } from "../../../_metronic/layout/components/content";
import { ConsignLineItemApi, CreateIndividualItemRequestForConsign, SizeType } from '../../../api';
import {useThemeMode} from "../../../_metronic/partials";

const fetchMasterItems = async () => {
    // Replace with actual API call
    return [
        { value: '1', label: 'Master Item 1' },
        { value: '2', label: 'Master Item 2' },
    ];
};

const fetchLineItemDetails = async (lineItemId: string) => {
    // const api = new ConsignLineItemApi();
    // return await api.apiConsignlineitemsConsignLineItemIdGet(lineItemId);
    return {}
};


const validationSchema = Yup.object().shape({
    masterItemId: Yup.string().required('Master Item is required'),
    condition: Yup.string().required('Condition is required'),
    color: Yup.string().required('Color is required'),
    size: Yup.string().required('Size is required'),
    retailPrice: Yup.number().positive('Price must be positive').required('Retail Price is required'),
    note: Yup.string(),
});

const sizeOptions = Object.values(SizeType).map(size => ({ value: size, label: size }));

export const ProductCreationFromConsignmentForm: React.FC = () => {
    const { consignSaleId, lineItemId } = useParams<{ consignSaleId: string; lineItemId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {mode ,menuMode,updateMode,updateMenuMode} = useThemeMode();
    const [files, setFiles] = useState<File[]>([]);

    const { data: masterItems } = useQuery('masterItems', fetchMasterItems);
    const { data: lineItemDetails } = useQuery(['lineItemDetails', lineItemId], () => fetchLineItemDetails(lineItemId!));

    const createProductMutation = useMutation(
        (data: CreateIndividualItemRequestForConsign) => {
            const api = new ConsignLineItemApi();
            return api.apiConsignlineitemsConsignLineItemIdCreateIndividualPost(lineItemId!, data);
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries('lineItemDetails');
                navigate('/consignment');
            },
        }
    );

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

    const initialValues: CreateIndividualItemRequestForConsign = {
        masterItemId: '',
        // condition: 'Good',
        // color: '',
        // size: SizeType.M,
        // retailPrice: 0,
        // note: '',
    };

    if (!lineItemDetails || !masterItems) {
        return <div>Loading...</div>;
    }

    return (
        <Content>
            <KTCard>
                <KTCardBody>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                const imagePromises = files.map(file =>
                                    new Promise<string>((resolve, reject) => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => resolve(reader.result as string);
                                        reader.onerror = reject;
                                        reader.readAsDataURL(file);
                                    })
                                );

                                const base64Images = await Promise.all(imagePromises);
                                const data = { ...values, images: base64Images };
                                await createProductMutation.mutateAsync(data);
                            } catch (error) {
                                console.error('Error creating product:', error);
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting, setFieldValue, values }) => (
                            <Form placeholder={""}>
                                <div className="card card-flush py-4">
                                    <div className="card-header">
                                        <div className="card-title">
                                            <h2>Create New Product</h2>
                                        </div>
                                    </div>
                                    <div className="card-body pt-0">
                                        <div className="mb-10">
                                            <label className="form-label">Master Items</label>
                                            <Select
                                                options={masterItems}
                                                name="masterItemId"
                                                onChange={(option) => setFieldValue('masterItemId', option?.value)}
                                                placeholder="Select Master Item..."
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                            <ErrorMessage name="masterItemId" component="div" className="text-danger mt-2" />
                                        </div>

                                        <div className="mb-10">
                                            <label className="form-label">Condition</label>
                                            <Field name="condition" type="text" className="form-control" />
                                            <ErrorMessage name="condition" component="div" className="text-danger mt-2" />
                                        </div>

                                        <div className="mb-10">
                                            <label className="form-label">Color</label>
                                            <Field name="color" type="text" className="form-control" />
                                            <ErrorMessage name="color" component="div" className="text-danger mt-2" />
                                        </div>

                                        <div className="mb-10">
                                            <label className="form-label">Size</label>
                                            <Select
                                                options={sizeOptions}
                                                name="size"
                                                onChange={(option) => setFieldValue('size', option?.value)}
                                                value={sizeOptions.find(option => option.value === "M")}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                            <ErrorMessage name="size" component="div" className="text-danger mt-2" />
                                        </div>

                                        <div className="mb-10">
                                            <label className="form-label">Retail Price</label>
                                            <Field name="retailPrice" type="number" className="form-control" />
                                            <ErrorMessage name="retailPrice" component="div" className="text-danger mt-2" />
                                        </div>

                                        <div className="mb-10">
                                            <label className="form-label">Note</label>
                                            <Field as="textarea" name="note" className="form-control" rows={3} />
                                            <ErrorMessage name="note" component="div" className="text-danger mt-2" />
                                        </div>

                                        <div className="mb-10">
                                            <label className="form-label">Images</label>
                                            <div {...getRootProps()} className="dropzone">
                                                <input {...getInputProps()} />
                                                <div className="dz-message needsclick">
                                                    <KTIcon iconName='file-up' className='text-primary fs-3x' />
                                                    <h3 className="fs-5 fw-bold text-gray-900 mb-1">Drop files here or click to upload.</h3>
                                                    <span className="fs-7 text-gray-400">Upload up to 10 files</span>
                                                </div>
                                            </div>
                                            {files.length > 0 && (
                                                <div className="mt-5">
                                                    <h3 className="fs-5 fw-bold text-gray-900 mb-3">Uploaded Files:</h3>
                                                    <div className="d-flex flex-wrap gap-5">
                                                        {files.map((file, index) => (
                                                            <div key={index} className="d-flex flex-column align-items-center">
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
                                                                >
                                                                    <KTIcon iconName='cross' className='fs-2' />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="d-flex justify-content-end">
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                                {isSubmitting ? 'Creating...' : 'Create Product'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </KTCardBody>
            </KTCard>
        </Content>
    );
};

export default ProductCreationFromConsignmentForm;
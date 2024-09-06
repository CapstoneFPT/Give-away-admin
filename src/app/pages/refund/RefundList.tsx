import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { KTCard, KTCardBody, KTIcon } from '../../../_metronic/helpers';
import { RefundApi, RefundResponse, RefundStatus } from '../../../api';
import { formatBalance } from '../utils/utils';
import { Link } from 'react-router-dom';
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from '../../modules/auth';
import { KTTable } from '../../../_metronic/helpers/components/KTTable';
import { Column } from 'react-table';

const RefundList: React.FC = () => {
	const [customerName, setCustomerName] = useState("");
	const [customerPhone, setCustomerPhone] = useState("");
	const [statusFilter, setStatusFilter] = useState<RefundStatus | null>(null);
	const [orderCode, setOrderCode] = useState("");
	const [itemCode, setItemCode] = useState("");
	const [itemName, setItemName] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const { currentUser } = useAuth();
	const pageSize = 10;

	const fetchData = useCallback(async (page: number, pageSize: number) => {
		try {
			const refundApi = new RefundApi();
			const response = await refundApi.apiRefundsGet(
				page,
				pageSize,
				currentUser?.shopId,
				statusFilter ? [statusFilter] : undefined,
				undefined,
				undefined,
				customerName,
				customerPhone,
				undefined,
				orderCode,
				itemCode,
				itemName
			);

			if (!response || !response.data) {
				throw new Error("No data received from the API");
			}

			return {
				data: response.data.items || [],
				totalCount: response.data.totalCount || 0,
				totalPages: response.data.totalPages || 0,
			};
		} catch (error) {
			console.error("Error fetching data:", error);
			throw error;
		}
	}, [currentUser?.shopId, statusFilter, customerName, customerPhone, orderCode, itemCode, itemName]);

	const { data, isLoading, error } = useQuery(
		["Refunds", customerName, customerPhone, statusFilter, orderCode, itemCode, itemName, currentPage],
		() => fetchData(currentPage, pageSize),
		{ refetchOnWindowFocus: false, keepPreviousData: true }
	);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const columns: Column<RefundResponse>[] = [
		{
			Header: 'Order Code',
			accessor: 'orderCode',
		},
		{
			Header: 'Item Code',
			accessor: 'itemCode',
		},
		{
			Header: 'Item Name',
			accessor: 'itemName',
		},
		{
			Header: 'Created Date',
			accessor: 'createdDate',
			Cell: ({ value }) => value ? new Date(value).toLocaleString() : 'N/A',
		},
		{
			Header: 'Unit Price',
			accessor: 'unitPrice',
			Cell: ({ value }) => formatBalance(value || 0) + ' VND',
		},
		{
			Header: 'Customer Name',
			accessor: 'customerName',
		},
		{
			Header: 'Customer Phone',
			accessor: 'customerPhone',
		},
		{
			Header: 'Customer Email',
			accessor: 'customerEmail',
		},
		{
			Header: 'Refund Percentage',
			accessor: 'refundPercentage',
			Cell: ({ value }) => value ? `${value}%` : 'N/A',
		},
		{
			Header: 'Refund Amount',
			accessor: 'refundAmount',
			Cell: ({ value }) => value ? formatBalance(value) + ' VND' : 'N/A',
		},
		{
			Header: 'Status',
			accessor: 'refundStatus',
			Cell: ({ value }) => (
				<span className={`badge badge-light-${getStatusColor(value)}`}>
					{value}
				</span>
			),
		},
		{
			Header: 'Actions',
			Cell: ({ row }) => (
				<Link
					to={`/refund/${row.original.refundId}`}
					className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
				>
					<KTIcon iconName="eye" className="fs-3" />
				</Link>
			),
		},
	];

	const getStatusColor = (status?: RefundStatus) => {
		switch (status) {
			case RefundStatus.Pending:
				return 'warning';
			case RefundStatus.Approved:
				return 'success';
			case RefundStatus.Rejected:
				return 'danger';
			default:
				return 'primary';
		}
	};

	if (error) return <div>An error occurred: {(error as Error).message}</div>;

	return (
		<Content>
			<KTCard>
				<KTCardBody>
					<div className="card-header border-0 pt-5">
						<div className="card-toolbar">
							<div className="d-flex align-items-center">
								<input
									type="text"
									className="form-control form-control-solid w-225px me-2"
									placeholder="Search by Customer Name"
									value={customerName}
									onChange={(e) => setCustomerName(e.target.value)}
								/>
								<input
									type="text"
									className="form-control form-control-solid w-225px me-2"
									placeholder="Search by Customer Phone"
									value={customerPhone}
									onChange={(e) => setCustomerPhone(e.target.value)}
								/>
								<select
									className="form-select form-select-solid w-200px me-2"
									value={statusFilter || ""}
									onChange={(e) => setStatusFilter(e.target.value as RefundStatus)}
								>
									<option value="">All Statuses</option>
									{Object.values(RefundStatus).map((status) => (
										<option key={status} value={status}>{status}</option>
									))}
								</select>
								<input
									type="text"
									className="form-control form-control-solid w-225px me-2"
									placeholder="Search by Order Code"
									value={orderCode}
									onChange={(e) => setOrderCode(e.target.value)}
								/>
								<input
									type="text"
									className="form-control form-control-solid w-225px me-2"
									placeholder="Search by Item Code"
									value={itemCode}
									onChange={(e) => setItemCode(e.target.value)}
								/>
								<input
									type="text"
									className="form-control form-control-solid w-225px me-2"
									placeholder="Search by Item Name"
									value={itemName}
									onChange={(e) => setItemName(e.target.value)}
								/>
							</div>
						</div>
					</div>

					<KTTable
						columns={columns}
						data={data?.data || []}
						totalCount={data?.totalCount || 0}
						currentPage={currentPage}
						totalPages={data?.totalPages || 0}
						pageSize={pageSize}
						onPageChange={handlePageChange}
						loading={isLoading}
					/>
				</KTCardBody>
			</KTCard>
		</Content>
	);
};

export default RefundList;
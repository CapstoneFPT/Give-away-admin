import {Column} from "react-table";
import {ConsignSale} from "../../../api";

const consignmentColumns : Column<ConsignSale>[] = [
    {
        Header : (props) => (
            <th>Consign Sale Id</th>
        ),
        id : 'consignSaleId',
        accessor : 'consignSaleId'
    },
    {
        Header : (props) => (
            <th>Consign Sale Code</th>
        ),
        id : 'consignSaleCode',
        accessor : 'consignSaleCode'
    },
    {
        Header : (props) => (
            <th>Created Date</th>
        ),
        id : 'createdDate',
        accessor : 'createdDate'
    },
    {
        Header : (props) => (
            <th>Total Price</th>
        ),
        id : 'totalPrice',
        accessor : 'totalPrice'
    }
]

export {consignmentColumns}
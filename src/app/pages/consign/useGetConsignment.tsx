import {ConsignSale} from "../../../api";
import {useState} from "react";

const useGetConsignment = () => {
const [consignments, setConsignments] = useState<ConsignSale[]>([]);

const fetchConsignments = () => {

}


    return {
        consignments, fetchConsignments
    }
}

export {useGetConsignment}
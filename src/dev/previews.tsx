import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import AddOrderPage from "../app/pages/order/AddOrderPage.tsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/AddOrderPage">
                <AddOrderPage/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;
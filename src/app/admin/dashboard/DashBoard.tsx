import { FC } from "react";

import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";
import { Chart } from "./Chart";

const DashBoard: FC = () => {
  return (
    <>
      <ToolbarWrapper />
      <Content>
        {/* begin::Row */}
        <div className="row g-5 g-xl-8">
          <div className="col-xl-6">
            <Chart className="card-xl-stretch mb-5 mb-xl-8" />{" "}
            {/* Render the Charts component */}
          </div>
        </div>
        {/* end::Row */}
      </Content>
    </>
  );
};

export default DashBoard;

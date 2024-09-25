import { FC } from "react";

import { Content } from "../../../_metronic/layout/components/content";
import { Chart } from "./Chart";
import { Total } from "./Total";
import { ChartAdmin } from "./ChartAdmin";

const DashBoard: FC = () => {
  return (
    <>
      <Content>
        {/* begin::Row */}
        <div className="row g-5 g-xl-8">
          <div className="col-xl-12">
            <ChartAdmin className="card-xl-stretch mb-5 mb-xl-8" />
          </div>
          <div className="col-xl-6">
            <Chart className="card-xl-stretch mb-5 mb-xl-8" />{" "}
          
            {/* Render the Charts component */}
          </div>
          <div className="col-xl-6">
          <Total className="card-xl-stretch mb-5 mb-xl-6" />
          </div>
        </div>
        {/* end::Row */}
      </Content>
    </>
  );
};

export default DashBoard;

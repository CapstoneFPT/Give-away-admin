import React from "react";
import AuctionAdminList from "./AuctionAdminTable";
import { KTCard } from "../../../_metronic/helpers";

const Auction = () => {
  return (
    <>
      <KTCard>
        <AuctionAdminList className="mb-5 mb-xl-8" />
      </KTCard>
    </>
  );
};

export default Auction;

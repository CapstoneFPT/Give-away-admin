import React from "react";
import AuctionList from "./AuctionList";
import { KTCard } from "../../../_metronic/helpers";

const Auction = () => {
  return (
    <>
      <KTCard>
        <AuctionList className="mb-5 mb-xl-8" />
      </KTCard>
    </>
  );
};

export default Auction;

import React from "react";
import AuctionAdminList from "./AuctionAdminTable";
import { KTCard } from "../../../_metronic/helpers";

const Auction = () => {
  return (
    <>
      <KTCard>
        <AuctionAdminList />
      </KTCard>
    </>
  );
};

export default Auction;

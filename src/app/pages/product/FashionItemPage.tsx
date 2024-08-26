import React, { useEffect, useState } from "react";
import FashionItemsTable from "./FashionItemTable";
import { PageTitle } from "../../../_metronic/layout/core";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

const FashionItemsPage = () => {
  return (
    <>
      <Routes>
        <Route element={<Outlet />}>
          <Route
            path="product-list"
            element={
              <>
                <PageTitle
                  breadcrumbs={[
                    {
                      title: "Fashion Items",
                      path: "/product/product-list",
                      isActive: true,
                      isSeparator: true,
                    },
                    {
                      title: "Test",
                      path: "",
                      isActive: false,
                      isSeparator: true,
                    }
                  ]}
                >
                  Fashion Items
                </PageTitle>
                <FashionItemsTable className="mb-5 mb-xl-8" />
              </>
            }
          />
        </Route>

        <Route index element={<Navigate to="product-list" />} />
      </Routes>
    </>
  );
};

export default FashionItemsPage;

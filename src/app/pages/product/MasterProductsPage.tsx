import MasterProductsTable from "./MasterProductsTable";

import { Navigate, Outlet, Route, Routes } from "react-router-dom";

const MasterProductsPage = () => {
  return (
    <>
      <Routes>
        <Route element={<Outlet />}>
          <Route
            path="product-list"
            element={
              <>
                <MasterProductsTable className="mb-5 mb-xl-8" />
              </>
            }
          />
        </Route>

        <Route index element={<Navigate to="product-list" />} />
      </Routes>
    </>
  );
};

export default MasterProductsPage;

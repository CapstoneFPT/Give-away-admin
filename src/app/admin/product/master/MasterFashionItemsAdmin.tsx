import MasterFashionItemsAdminTable from "./MasterFashionItemsAdminTable";

import { Navigate, Outlet, Route, Routes } from "react-router-dom";

const MasterFashionItemsAdminPage = () => {
  return (
    <>
      <Routes>
        <Route element={<Outlet />}>
          <Route index element={<Navigate to="product-list" />} />
          <Route
            path="product-list"
            element={
              <>
                <MasterFashionItemsAdminTable className="mb-5 mb-xl-8" />
              </>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default MasterFashionItemsAdminPage;

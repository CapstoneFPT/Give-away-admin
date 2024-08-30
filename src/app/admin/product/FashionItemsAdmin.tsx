import FashionItemsAdminTable from "./FashionItemsAdminTable";

import { Navigate, Outlet, Route, Routes } from "react-router-dom";

const FashionItemsAdminPage = () => {
  return (
    <>
      <Routes>
        <Route element={<Outlet />}>
          <Route
            path="product-list"
            element={
              <>
                <FashionItemsAdminTable className="mb-5 mb-xl-8" />
              </>
            }
          />
        </Route>

        <Route index element={<Navigate to="product-list" />} />
      </Routes>
    </>
  );
};

export default FashionItemsAdminPage;

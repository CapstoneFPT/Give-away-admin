import FashionItemsTable from "./FashionItemTable";

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

import React, { FC, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MasterLayout } from "../../_metronic/layout/MasterLayout";
import TopBarProgress from "react-topbar-progress-indicator";
import { DashboardWrapper } from "../pages/dashboard/DashboardWrapper";
import { MenuTestPage } from "../pages/MenuTestPage";
import { getCSSVariableValue } from "../../_metronic/assets/ts/_utils";
import { WithChildren } from "../../_metronic/helpers";
import BuilderPageWrapper from "../pages/layout-builder/BuilderPageWrapper";
import Auction from "../pages/auction/Auction";
import ProtectedRoute from "./ProtectedRoutes.tsx";
import OrderPage from "../pages/order/OrderPage.tsx";
import RefundPage from "../pages/refund/RefundPage.tsx";
import OrderDetail from "../pages/order/OrderDetail.tsx";
import { ConsignDetail } from "../pages/consign/ConsignDetail.tsx";
import ConsignLineItemReview from "../pages/consign/ConsignLineItemReview.tsx";
import ProductCreationFromConsignmentForm from "../pages/consign/ProductCreationFromConsignmentForm.tsx";
import ListMasterFashionItems from "../pages/product/ListMasterFashionItems.tsx";
import AddOrderPage from "../pages/order/AddOrderPage.tsx";
import { useAuth } from "../modules/auth";
import FashionItemsAdminTable from "../admin/product/item/FashionItemsAdminTable.tsx";
import MasterFashionItemsAdminPage from "../admin/product/master/MasterFashionItemsAdmin.tsx";
const PrivateRoutes = () => {
  const { currentUser } = useAuth();
  const ProfilePage = lazy(() => import("../modules/profile/ProfilePage"));
  const WizardsPage = lazy(() => import("../modules/wizards/WizardsPage"));
  const AccountPage = lazy(() => import("../modules/accounts/AccountPage"));
  const WidgetsPage = lazy(() => import("../modules/widgets/WidgetsPage"));
  const ChatPage = lazy(() => import("../modules/apps/chat/ChatPage"));
  const UsersPage = lazy(
    () => import("../modules/apps/user-management/UsersPage")
  );
  const ConsignmentPage = lazy(
    () => import("../pages/consign/ConsignmentPage.tsx")
  );
  const FashionItemsPage = lazy(
    () => import("../pages/product/FashionItemPage")
  );

  const getDefaultRoute = () => {
    switch (currentUser?.role) {
      case "Admin":
        return "/consignment";
      case "Staff":
        return "/order";
      default:
        return "/auth"; // Fallback to dashboard if role is unknown
    }
  };

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/*Redirect to Dashboard after success login/registartion */}
        <Route index element={<Navigate to={getDefaultRoute()} />} />

        <Route path="auth/*" element={<Navigate to={getDefaultRoute()} />} />
        {/* Pages */}
        <Route path="dashboard" element={<DashboardWrapper />} />
        <Route path="builder" element={<BuilderPageWrapper />} />
        <Route path="menu-test" element={<MenuTestPage />} />
        <Route path="auction" element={<Auction />} />
        <Route path="order/*" element={<OrderPage />} />
        <Route path="refund" element={<RefundPage />} />
        <Route
          path="product-admin/*"
          element={
            <ProtectedRoute
              roles={["Admin"]}
              children={
                <SuspensedView>
                  <MasterFashionItemsAdminPage />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path="/product-admin/product-list/list-fashion/:masterItemId"
          element={
            <ProtectedRoute
              roles={["Admin"]}
              children={
                <SuspensedView>
                  <FashionItemsAdminTable className="mb-5 mb-xl-8" />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path="product/*"
          element={
            <ProtectedRoute
              roles={["Admin", "Staff"]}
              children={
                <SuspensedView>
                  <FashionItemsPage />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path="consignment/*"
          element={
            <ProtectedRoute
              roles={["Staff", "Admin"]}
              children={
                <SuspensedView>
                  <ConsignmentPage />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path="order/add-order"
          element={
            <SuspensedView>
              <AddOrderPage />
            </SuspensedView>
          }
        />
        <Route
          path="order-detail/:orderId"
          element={
            <ProtectedRoute
              roles={["Staff"]}
              children={
                <SuspensedView>
                  <OrderDetail />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path="/product/product-list/list-fashion/:masterItemId"
          element={
            <ProtectedRoute
              roles={["Staff"]}
              children={
                <SuspensedView>
                  <ListMasterFashionItems className="mb-5 mb-xl-8" />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path="/consignment/:consignSaleId/line-item/:lineItemId"
          element={<ConsignLineItemReview />}
        />
        <Route
          path="/create-item/:consignSaleId/line-item/:lineItemId"
          element={<ProductCreationFromConsignmentForm />}
        />
        <Route
          path="consignment/:consignSaleId"
          element={
            <ProtectedRoute
              roles={["Staff", "Admin"]}
              children={
                <SuspensedView>
                  <ConsignDetail />
                </SuspensedView>
              }
            />
          }
        />

        {/* Lazy Modules */}
        <Route
          path="crafted/pages/profile/*"
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/pages/wizards/*"
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/widgets/*"
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/account/*"
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path="apps/chat/*"
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path="apps/user-management/*"
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" />} />
        {/* <Route path='*' element={<Navigate to='/error/403'/>}/> */}
      </Route>
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue("--bs-primary");
  TopBarProgress.config({
    barColors: {
      "0": baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes };

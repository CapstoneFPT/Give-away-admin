import React, { FC, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MasterLayout } from "../../_metronic/layout/MasterLayout";
import TopBarProgress from "react-topbar-progress-indicator";

import { MenuTestPage } from "../pages/MenuTestPage";
import { getCSSVariableValue } from "../../_metronic/assets/ts/_utils";
import { WithChildren } from "../../_metronic/helpers";
import BuilderPageWrapper from "../pages/layout-builder/BuilderPageWrapper";
import Auction from "../pages/auction/Auction";
import ProtectedRoute from "./ProtectedRoutes.tsx";
import OrderPage from "../pages/order/OrderPage.tsx";
import RefundPage from "../pages/refund/RefundPage.tsx";
import OrderDetailPage from "../pages/order/OrderDetailPage.tsx";
import { ConsignDetail } from "../pages/consign/ConsignDetail.tsx";
import ConsignLineItemReview from "../pages/consign/ConsignLineItemReview.tsx";
import ListMasterFashionItems from "../pages/product/ListMasterFashionItems.tsx";
import AddOrderPage from "../pages/order/AddOrderPage.tsx";
import { useAuth } from "../modules/auth";
import ItemDetail from "../admin/product/item/ItemDetail.tsx";
import MasterFashionItemsAdminTable from "../admin/product/master/MasterFashionItemsAdminTable.tsx";
import FashionItemsAdminTable from "../admin/product/item/FashionItemsAdminTable.tsx";
import DashBoard from "../admin/dashboard/DashBoard.tsx";
import OrderAdminPage from "../admin/order/OrderAdminPage.tsx";
import ProductDetail from "../pages/product/ProductDetail.tsx";
import OrderAdminDetailPage from "../admin/order/OrderAdminDetailPage.tsx";
import AuctionAdminPage from "../admin/auction/AuctionAdminPage.tsx";
import RefundDetail from "../pages/refund/RefundDetail.tsx";
import CreateAuction from "../pages/auction/CreateAuction.tsx";
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
    () => import("../pages/product/MasterProductsPage.tsx")
  );

  const getDefaultRoute = () => {
    switch (currentUser?.role) {
      case "Admin":
        return "/dashboard";
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
        <Route path="dashboard" element={<DashBoard />} />
        <Route path="builder" element={<BuilderPageWrapper />} />
        <Route path="menu-test" element={<MenuTestPage />} />

        <Route path="/order/order-list" element={<OrderPage />} />
        <Route path="refund" element={<RefundPage />} />
        <Route path="refund/:refundId" element={<RefundDetail />} />
        {/* Product Admin Routes */}
        <Route
          path="auction-admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <SuspensedView>
                <AuctionAdminPage />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="order-admin/:orderId"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <SuspensedView>
                <OrderAdminDetailPage />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="order-admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <SuspensedView>
                <OrderAdminPage />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="product-admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <SuspensedView>
                <MasterFashionItemsAdminTable className="mb-5 mb-xl-8" />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="product-admin/:masterItemId"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <SuspensedView>
                <FashionItemsAdminTable className="mb-5 mb-xl-8" />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="product-admin/item-details/:itemId"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <SuspensedView>
                <ItemDetail />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="product/*"
          element={
            <ProtectedRoute
              roles={["Staff"]}
              children={
                <SuspensedView>
                  <FashionItemsPage />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path="auction/list"
          element={
            <ProtectedRoute
              roles={["Staff"]}
              children={
                <SuspensedView>
                  <Auction />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path="auction/create"
          element={
            <ProtectedRoute
              roles={["Staff"]}
              children={
                <SuspensedView>
                  <CreateAuction />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path="consignment/*"
          element={
            <ProtectedRoute
              roles={["Staff"]}
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
            <ProtectedRoute
              roles={["Staff"]}
              children={
                <SuspensedView>
                  <AddOrderPage />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path="order-detail/:orderId"
          element={
            <ProtectedRoute
              roles={["Staff"]}
              children={
                <SuspensedView>
                  <OrderDetailPage />
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
          path="/product/product-list/list-fashion/:masterItemId/:itemId"
          element={
            <ProtectedRoute
              roles={["Staff"]}
              children={
                <SuspensedView>
                  <ProductDetail />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path="/consignment/:consignSaleId/line-item/:lineItemId"
          element={
            <ProtectedRoute
              roles={["Staff"]}
              children={
                <SuspensedView>
                  <ConsignLineItemReview />
                </SuspensedView>
              }
            />
          }
        />
        <Route
          path="consignment/:consignSaleId"
          element={
            <ProtectedRoute
              roles={["Staff"]}
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

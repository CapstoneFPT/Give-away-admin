/* eslint-disable @typescript-eslint/no-unused-vars */
import { useIntl } from "react-intl";
import { KTIcon } from "../../../../helpers";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { useAuth } from "../../../../../app/modules/auth/index.ts";

const SidebarMenuMain = () => {
  const intl = useIntl();
  const { currentUser } = useAuth();
  return (
    <>
      {currentUser?.role === "Admin" && (
        <>
          <SidebarMenuItem
            to="/dashboard"
            icon="element-11"
            title={intl.formatMessage({ id: "MENU.DASHBOARD" })}
            fontIcon="bi-app-indicator"
          />
          <SidebarMenuItemWithSub
            to="/account"
            title="Account"
            icon="profile-circle"
            fontIcon="bi-person"
          >
            <SidebarMenuItem
              to="/account-admin"
              title="Account Management"
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
          <SidebarMenuItemWithSub
            to="/consignment"
            title="Consignment"
            icon="element-11"
            fontIcon="bi-box"
          >
            <SidebarMenuItem
              to="/consignment/list"
              title="View Consignments"
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
          <SidebarMenuItemWithSub
            to="/product"
            title="Product"
            icon="element-11"
            fontIcon="bi-bag"
          >
            <SidebarMenuItem
              to="/product-admin"
              title="Product Management"
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
          <SidebarMenuItemWithSub
            to="/order"
            title="Orders"
            icon="element-11"
            fontIcon="bi-cart"
          >
            <SidebarMenuItem
              to="/order-admin"
              title="View Orders"
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
          <SidebarMenuItemWithSub
            to="/auction"
            title="Auction"
            icon="element-11"
            fontIcon="bi-hammer"
          >
            <SidebarMenuItem
              to="/auction-admin"
              title="Auction Management"
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
          <SidebarMenuItemWithSub
            to="/transaction"
            title="Transaction"
            icon="element-11"
            fontIcon="bi-cash-coin"
          >
            <SidebarMenuItem
              to="/transaction"
              title="View Transactions"
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
        </>
      )}
      {currentUser?.role === "Staff" && (
        <>
          <SidebarMenuItem
            to="/dashboard"
            icon="element-11"
            title={intl.formatMessage({ id: "MENU.DASHBOARD" })}
            fontIcon="bi-app-indicator"
          />
          <SidebarMenuItemWithSub
            to="/consignment"
            title="Consignment"
            icon="element-11"
            fontIcon="bi-box"
          >
            <SidebarMenuItem
              to="/consignment/list"
              title="View Consignments"
              hasBullet={true}
            />
            <SidebarMenuItem
              to="/consignment/create"
              title="Create Consignment Offline"
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
          <SidebarMenuItemWithSub
            to="/product"
            title="Product"
            icon="element-10"
            fontIcon="bi-bag"
          >
            <SidebarMenuItem
              to="/product"
              title="View Products"
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
          <SidebarMenuItemWithSub
            to="/auction"
            title="Auction"
            icon="element-11"
            fontIcon="bi-hammer"
          >
            <SidebarMenuItem
              to="/auction/list"
              title="View Auctions"
              hasBullet={true}
            />
            <SidebarMenuItem
              to="/auction/create"
              title="Create Auction"
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
          <SidebarMenuItemWithSub
            to="/refund"
            title="Refund"
            icon="element-9"
            fontIcon="bi-arrow-counterclockwise"
          >
            <SidebarMenuItem
              to="/refund"
              title="Refund List"
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
          <SidebarMenuItemWithSub
            to="/order"
            title="Order"
            icon="element-12"
            fontIcon="bi-cart"
          >
            <SidebarMenuItem
              to="/order/order-list"
              title="Order List"
              hasBullet={true}
            />
            <SidebarMenuItem
              to="/order/add-order"
              title="Create Order Offline"
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
        </>
      )}
    </>
  );
};

export { SidebarMenuMain };

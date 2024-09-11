/* eslint-disable @typescript-eslint/no-unused-vars */
import { useIntl } from "react-intl";
import { KTIcon } from "../../../../helpers";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { MenuItem } from "../../header/header-menus/MenuItem.tsx";
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
          <SidebarMenuItem
            to="/consignment/list"
            icon="element-11"
            title="Consignment"
            fontIcon="bi-app-indicator"
          />
          <SidebarMenuItem
            to="/product-admin"
            icon="element-11"
            title="Product Management"
            fontIcon="bi-app-indicator"
          />
          <SidebarMenuItem
            to="/order-admin"
            icon="element-11"
            title="Orders"
            fontIcon="bi-app-indicator"
          />
          <SidebarMenuItem
            to="/auction-admin"
            icon="element-11"
            title="Auction"
            fontIcon="bi-app-indicator"
          />
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
          <SidebarMenuItem
            to="/consignment/list"
            title={"Consignment"}
            icon={"element-11"}
          />

          <SidebarMenuItem title="Product" to="/product" icon={"element-10"} />
          <SidebarMenuItem
            title="Auction"
            to="/auction/list"
            icon={"element-11"}
          />
          <SidebarMenuItem title="Refund List" to="refund" icon={"element-9"} />
          <SidebarMenuItem
            title="Order List"
            to="/order/order-list"
            icon={"element-12"}
          />
          <SidebarMenuItemWithSub
            to="/create"
            title="Create"
            icon="element-plus"
            fontIcon="bi-plus-circle"
          >
            <SidebarMenuItem
              to="/consignment/create"
              title="Create Consignment Offline"
              hasBullet={true}
            />
            <SidebarMenuItem
              to="/auction/create"
              title="Create Auction"
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
      {/* <SidebarMenuItem
        to="/builder"
        icon="switch"
        title="Layout Builder"
        fontIcon="bi-layers"
      />
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            Crafted
          </span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to="/crafted/pages"
        title="Pages"
        fontIcon="bi-archive"
        icon="element-plus"
      >
        <SidebarMenuItemWithSub
          to="/crafted/pages/profile"
          title="Profile"
          hasBullet={true}
        >
          <SidebarMenuItem
            to="/crafted/pages/profile/overview"
            title="Overview"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/profile/projects"
            title="Projects"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/profile/campaigns"
            title="Campaigns"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/profile/documents"
            title="Documents"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/profile/connections"
            title="Connections"
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>

        <SidebarMenuItemWithSub
          to="/crafted/pages/wizards"
          title="Wizards"
          hasBullet={true}
        >
          <SidebarMenuItem
            to="/crafted/pages/wizards/horizontal"
            title="Horizontal"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/wizards/vertical"
            title="Vertical"
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to="/crafted/accounts"
        title="Accounts"
        icon="profile-circle"
        fontIcon="bi-person"
      >
        <SidebarMenuItem
          to="/crafted/account/overview"
          title="Overview"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/account/settings"
          title="Settings"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to="/error"
        title="Errors"
        fontIcon="bi-sticky"
        icon="cross-circle"
      >
        <SidebarMenuItem to="/error/404" title="Error 404" hasBullet={true} />
        <SidebarMenuItem to="/error/500" title="Error 500" hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to="/crafted/widgets"
        title="Widgets"
        icon="element-7"
        fontIcon="bi-layers"
      >
        <SidebarMenuItem
          to="/crafted/widgets/lists"
          title="Lists"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/statistics"
          title="Statistics"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/charts"
          title="Charts"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/mixed"
          title="Mixed"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/tables"
          title="Tables"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/feeds"
          title="Feeds"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            Apps
          </span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to="/apps/chat"
        title="Chat"
        fontIcon="bi-chat-left"
        icon="message-text-2"
      >
        <SidebarMenuItem
          to="/apps/chat/private-chat"
          title="Private Chat"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/apps/chat/group-chat"
          title="Group Chart"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/apps/chat/drawer-chat"
          title="Drawer Chart"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <SidebarMenuItem
        to="/apps/user-management/users"
        icon="abstract-28"
        title="User management"
        fontIcon="bi-layers"
      /> */}
    </>
  );
};

export { SidebarMenuMain };

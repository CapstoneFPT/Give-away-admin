/* eslint-disable @typescript-eslint/no-unused-vars */
import clsx from "clsx";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import { HeaderUserMenu } from "../../../partials";
import { useLayout } from "../../core";
import { useAuth } from "../../../../app/modules/auth";
import { useEffect, useState } from "react";
import { ShopApi, ShopDetailResponse } from "../../../../api"; // Adjust the import path as needed

const itemClass = "ms-1 ms-md-4";
const userAvatarClass = "symbol-35px";
const btnIconClass = "fs-2";

const Navbar = () => {
  const { config } = useLayout();
  const { currentUser } = useAuth();
  const [shopDetails, setShopDetails] = useState<ShopDetailResponse | null>(
    null
  );

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (currentUser?.shopId) {
        try {
          const shopApi = new ShopApi();
          const response = await shopApi.apiShopsShopIdGet(currentUser.shopId);
          if (response && response.data && response.data.data) {
            setShopDetails(response.data.data);
          } else {
            console.error("Invalid response structure:", response);
          }
        } catch (error) {
          console.error("Error fetching shop details:", error);
        }
      }
    };

    fetchShopDetails();
  }, [currentUser?.shopId]);

  return (
    <div className="app-navbar flex-shrink-0 d-flex align-items-stretch justify-content-between w-100">
      <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
        {currentUser?.role === "Staff" && shopDetails && (
          <span className="fw-bold fs-4 text-dark me-4">
            Shop: {shopDetails.address}
          </span>
        )}
      </div>

      <div className="d-flex align-items-stretch justify-content-between flex-lg-grow-1">
        <div className="d-flex align-items-center ms-1 ms-lg-3">
          {/* Add any additional navbar items here */}
        </div>

        <div className="d-flex align-items-center">
          <div className={clsx("app-navbar-item", itemClass)}>
            <span className="fw-bolder fs-5 text-dark px-2">
              {currentUser?.email}
            </span>
          </div>

          <div className={clsx("app-navbar-item", itemClass)}>
            <div
              className={clsx("cursor-pointer symbol", userAvatarClass)}
              data-kt-menu-trigger="{default: 'click'}"
              data-kt-menu-attach="parent"
              data-kt-menu-placement="bottom-end"
            >
              <img
                style={{
                  width: "35px",
                  height: "35px",
                }}
                src={toAbsoluteUrl("media/avatars/300-3.jpg")}
                alt=""
              />
            </div>
            <HeaderUserMenu />
          </div>

          {config.app?.header?.default?.menu?.display && (
            <div
              className="app-navbar-item d-lg-none ms-2 me-n3"
              title="Show header menu"
            >
              <div
                className="btn btn-icon btn-active-color-primary w-35px h-35px"
                id="kt_app_header_menu_toggle"
              >
                <KTIcon iconName="text-align-left" className={btnIconClass} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { Navbar };

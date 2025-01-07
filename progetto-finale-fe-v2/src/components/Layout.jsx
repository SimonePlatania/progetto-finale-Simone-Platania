import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const Layout = () => {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")); // o sessionStorage

  // Pagine dove non mostrare il NotificationBell
  const excludedPaths = ["/login", "/registra", "/registra-gestore"];
  const shouldShowNotification = !excludedPaths.includes(location.pathname);

  return (
    <div>
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {shouldShowNotification && currentUser && (
            <NotificationBell userId={currentUser.id} />
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

import { Outlet } from "react-router-dom";
import Appbar from "./Appbar";

const AccountLayout = () => {
  return (
    <>
      <Appbar />
      <main>
        <div className="mx-auto max-w-7xl py-2 sm:px-4 lg:px-6">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AccountLayout;

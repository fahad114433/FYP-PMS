import { Outlet } from "react-router";
import { useSelector } from "react-redux";

function UserRoute() {
    const { userInfo } = useSelector((state) => state.auth);

    if (!userInfo) {
      return <Navigate to="/login" replace />;
    }
    if (userInfo.isAdmin) {
      return (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-red-500">
            Access Denied! You are not authorized to view this page.
          </h1>
        </div>
      );
    }
    return <Outlet />;
}

export default UserRoute;

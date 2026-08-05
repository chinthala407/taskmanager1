import { Outlet } from "react-router-dom";

import UserSidebar from "../components/user/UserSidebar";
import UserNavbar from "../components/user/UserNavbar";
import "./AdminLayout.css";

function UserLayout() {

    return (

        <div className="admin-layout">

            <UserNavbar />

            <UserSidebar />

            <main className="admin-main">

                <div className="page-wrapper">

                    <Outlet />

                </div>

            </main>

        </div>

    );

}

export default UserLayout;
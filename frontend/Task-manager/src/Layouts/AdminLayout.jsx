import { Outlet } from "react-router-dom";

import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";

import "./AdminLayout.css";

function AdminLayout() {

    return (

        <div className="admin-layout">

            <AdminNavbar />

            <AdminSidebar />

            <main className="admin-main">

                <div className="page-wrapper">

                    <Outlet />

                </div>

            </main>

        </div>

    );

}

export default AdminLayout;
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

import "../admin/AdminSidebar.css";


function UserSidebar() {

    const [unreadCount, setUnreadCount] = useState(0);


    const token = localStorage.getItem("token");



    // ======================================================
    // Fetch Unread Notifications
    // ======================================================

    const fetchUnreadNotifications = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/user/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const unreadCount =
                response.data.filter(
                    notification =>
                        !notification.is_read
                ).length;


            setUnreadCount(unreadCount);

        }
        catch (error) {

            console.log(
                "Unread notification error:",
                error
            );

        }

    };



    // ======================================================
    // Initial Fetch + Refresh
    // ======================================================

    useEffect(() => {

        fetchUnreadNotifications();


        const interval = setInterval(() => {

            fetchUnreadNotifications();

        }, 5000);


        return () => {

            clearInterval(interval);

        };

    }, []);



    // ======================================================
    // Sidebar
    // ======================================================

    return (

        <aside className="admin-sidebar">


            <nav className="sidebar-menu">


                {/* ================= Dashboard ================= */}

                <NavLink
                    to="/user"
                    end
                    className="sidebar-link"
                >
                    Dashboard
                </NavLink>



                {/* ================= My Tasks ================= */}

                <NavLink
                    to="/user/tasks"
                    className="sidebar-link"
                >
                    My Tasks
                </NavLink>



                {/* ================= Completed ================= */}

                <NavLink
                    to="/user/completed"
                    className="sidebar-link"
                >
                    Completed
                </NavLink>



                {/* ================= Reports ================= */}

                <NavLink
                    to="/user/reports"
                    className="sidebar-link"
                >
                    Reports
                </NavLink>



                {/* ================= Notifications ================= */}

                <NavLink
                    to="/user/notifications"
                    className="sidebar-link"
                >

                    <span>
                        Notifications
                    </span>


                    {
                        unreadCount > 0 && (

                            <span className="notification-badge">

                                {
                                    unreadCount > 99
                                        ? "99+"
                                        : unreadCount
                                }

                            </span>

                        )
                    }

                </NavLink>



                {/* ================= Profile ================= */}

                <NavLink
                    to="/user/profile"
                    className="sidebar-link"
                >
                    Profile
                </NavLink>



                {/* ================= Settings ================= */}

                <NavLink
                    to="/user/settings"
                    className="sidebar-link"
                >
                    Settings
                </NavLink>


            </nav>


        </aside>

    );

}


export default UserSidebar;
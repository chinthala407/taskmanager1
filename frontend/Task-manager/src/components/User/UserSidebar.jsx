import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import "../admin/AdminSidebar.css";


function UserSidebar({ isOpen, onClose }) {

    const [unreadCount, setUnreadCount] = useState(0);

    const navigate = useNavigate();
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


    useEffect(() => {

        fetchUnreadNotifications();


        const interval = setInterval(() => {

            fetchUnreadNotifications();

        }, 5000);


        return () => {

            clearInterval(interval);

        };

    }, []);


    // close the drawer after navigating (mobile only — no-op on desktop)
    const handleLinkClick = () => {
        if (onClose) onClose();
    };


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };


    // ======================================================
    // Sidebar
    // ======================================================

    return (

        <aside className={`admin-sidebar ${isOpen ? "mobile-open" : ""}`}>


            <nav className="sidebar-top">


                {/* ================= Dashboard ================= */}

                <NavLink
                    to="/user"
                    end
                    className="menu-item"
                    onClick={handleLinkClick}
                >
                    Dashboard
                </NavLink>



                {/* ================= My Tasks ================= */}

                <NavLink
                    to="/user/tasks"
                    className="menu-item"
                    onClick={handleLinkClick}
                >
                    My Tasks
                </NavLink>



                {/* ================= Completed ================= */}

                <NavLink
                    to="/user/completed"
                    className="menu-item"
                    onClick={handleLinkClick}
                >
                    Completed
                </NavLink>



                {/* ================= Reports ================= */}

                <NavLink
                    to="/user/reports"
                    className="menu-item"
                    onClick={handleLinkClick}
                >
                    Reports
                </NavLink>



                {/* ================= Notifications ================= */}

                <NavLink
                    to="/user/notifications"
                    className="menu-item"
                    onClick={handleLinkClick}
                >

                    <span>
                        Notifications
                    </span>


                    {
                        unreadCount > 0 && (

                            <span className="sidebar-badge">

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
                    className="menu-item"
                    onClick={handleLinkClick}
                >
                    Profile
                </NavLink>



                {/* ================= Settings ================= */}

                <NavLink
                    to="/user/settings"
                    className="menu-item"
                    onClick={handleLinkClick}
                >
                    Settings
                </NavLink>


            </nav>


            {/* Only visible on mobile per AdminSidebar.css (.sidebar-logout-btn) */}
            <button
                className="sidebar-logout-btn"
                onClick={handleLogout}
            >
                Logout
            </button>


        </aside>

    );

}


export default UserSidebar;
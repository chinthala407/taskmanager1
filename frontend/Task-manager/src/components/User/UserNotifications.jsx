import { useEffect, useState } from "react";
import axios from "axios";

import "./UserNotifications.css";


function UserNotifications() {

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);


    const token = localStorage.getItem("token");



    // ======================================================
    // Fetch Notifications
    // ======================================================

    const fetchNotifications = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/user/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            setNotifications(response.data);

        }
        catch (error) {

            console.log(
                "Notification fetch error:",
                error
            );

        }
        finally {

            setLoading(false);

        }

    };



    // ======================================================
    // Mark All Notifications As Read
    // ======================================================

    const markAllAsRead = async () => {

        try {

            await axios.patch(
                "http://localhost:5000/api/user/notifications/read-all",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            // Update UI immediately

            setNotifications(prev =>

                prev.map(notification => ({

                    ...notification,

                    is_read: true

                }))

            );


            // Tell the rest of the app (e.g. the sidebar badge)
            // that notifications were just cleared, so it can
            // refetch its count right away instead of waiting
            // for its next polling interval.
            window.dispatchEvent(
                new Event("notifications-read")
            );

        }
        catch (error) {

            console.log(
                "Mark all notifications error:",
                error
            );

        }

    };



    // ======================================================
    // Initial Fetch
    // ======================================================

    useEffect(() => {

        const loadNotifications = async () => {

            // First get notifications

            await fetchNotifications();


            // Then mark them as read

            await markAllAsRead();

        };


        loadNotifications();

    }, []);



    // ======================================================
    // Automatic Refresh
    // ======================================================

    useEffect(() => {

        const interval = setInterval(() => {

            fetchNotifications();

        }, 5000);


        return () => {

            clearInterval(interval);

        };

    }, []);



    // ======================================================
    // Format Notification Time
    // ======================================================

    const formatTime = (createdAt) => {

        if (!createdAt) {

            return "";

        }


        const notificationDate =
            new Date(createdAt);


        if (
            isNaN(
                notificationDate.getTime()
            )
        ) {

            return "";

        }


        const now = new Date();


        const difference =
            Math.floor(
                (now - notificationDate) / 1000
            );



        if (difference < 60) {

            return "Just now";

        }



        if (difference < 3600) {

            return `${Math.floor(
                difference / 60
            )} minutes ago`;

        }



        if (difference < 86400) {

            return `${Math.floor(
                difference / 3600
            )} hours ago`;

        }



        if (difference < 172800) {

            return "Yesterday";

        }



        return notificationDate.toLocaleDateString(
            "en-IN"
        );

    };



    // ======================================================
    // Loading
    // ======================================================

    if (loading) {

        return (

            <div className="user-notifications-page">

                <div className="user-notifications-card">

                    <h2>
                        Notifications
                    </h2>

                    <p>
                        Loading notifications...
                    </p>

                </div>

            </div>

        );

    }



    // ======================================================
    // UI
    // ======================================================

    return (

        <div className="user-notifications-page">


            <div className="user-notifications-card">


                <h2>
                    Notifications
                </h2>



                {
                    notifications.length === 0

                    ?

                    (

                        <p className="no-notifications">

                            No notifications

                        </p>

                    )

                    :

                    (

                        notifications.map(
                            (notification) => (

                                <div

                                    key={notification.id}

                                    className={
                                        `user-notification-item ${
                                            notification.is_read
                                                ? ""
                                                : "unread"
                                        }`
                                    }

                                >

                                    <p>
                                        {
                                            notification.message
                                        }
                                    </p>


                                    <span>

                                        {
                                            formatTime(
                                                notification.created_at
                                            )
                                        }

                                    </span>


                                </div>

                            )
                        )

                    )
                }


            </div>


        </div>

    );

}


export default UserNotifications;

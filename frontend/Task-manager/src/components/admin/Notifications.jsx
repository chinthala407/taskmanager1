import { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";


function Notifications() {

    const [notifications, setNotifications] = useState([]);

    const [selected, setSelected] = useState(null);



    // Fetch Notifications
    useEffect(() => {

        const fetchNotifications = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:5000/api/admin/notifications"
                );


                setNotifications(response.data);



                // Mark notifications as read

                await axios.put(
                    "http://localhost:5000/api/admin/notifications/read"
                );


            }
            catch(error) {

                console.log(error);

            }

        };


        fetchNotifications();


    }, []);





    // Delete Notification

    const handleDelete = async (id) => {

        try {


            await axios.delete(

                `http://localhost:5000/api/admin/notifications/${id}`

            );



            setNotifications(

                notifications.filter(

                    item => item.id !== id

                )

            );


            setSelected(null);


        }
        catch(error) {

            console.log(error);

        }

    };





    return (

        <div className="notifications-page">


            <div className="page-header">

                <h1>
                    Notifications
                </h1>


                <p>
                    View important system updates and activities.
                </p>


            </div>





            <div className="notification-list">


                {

                    notifications.length > 0

                    ?

                    notifications.map((item) => (


                        <div

                            className="notification-card"

                            key={item.id}

                            onClick={() => setSelected(item.id)}

                        >



                            <div className="notification-content">


                                <h3>
                                    {item.title}
                                </h3>



                                <p>
                                    {item.message}
                                </p>


                            </div>





                            <div className="notification-actions">


                                <span>

                                    {

                                        item.created_at

                                        ?

                                        new Date(
                                            item.created_at
                                        ).toLocaleString()

                                        :

                                        "Just now"

                                    }


                                </span>





                                {

                                    selected === item.id && (


                                        <button

                                            className="delete-btn"

                                            onClick={(e)=>{


                                                e.stopPropagation();


                                                handleDelete(item.id);


                                            }}

                                        >

                                            Delete

                                        </button>


                                    )

                                }



                            </div>




                        </div>


                    ))


                    :


                    <div className="no-notifications">


                        <h3>
                            No new notifications
                        </h3>


                        <p>
                            You are all caught up.
                        </p>


                    </div>


                }



            </div>



        </div>


    );

}


export default Notifications;
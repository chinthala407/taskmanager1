import "./UserNotifications.css";


function UserNotifications() {


    const notifications = [

        {
            id:1,
            message:"Your task 'Complete React UI' is pending",
            time:"10 minutes ago"
        },


        {
            id:2,
            message:"API Integration task completed",
            time:"1 hour ago"
        },


        {
            id:3,
            message:"New task assigned to you",
            time:"Yesterday"
        }

    ];



    return (


        <div className="notifications-page">


            <div className="notifications-card">


                <h2>
                    Notifications
                </h2>



                {
                    notifications.map((notification)=>(


                        <div

                            className="notification-item"

                            key={notification.id}

                        >


                            <p>
                                {notification.message}
                            </p>


                            <span>
                                {notification.time}
                            </span>



                        </div>


                    ))

                }



            </div>


        </div>


    );

}


export default UserNotifications;
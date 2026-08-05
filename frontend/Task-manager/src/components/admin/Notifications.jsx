import "./Notifications.css";


function Notifications(){

    const notifications = [

        {
            id:1,
            title:"New User Registered",
            message:"A new user has joined the platform.",
            time:"10 minutes ago"
        },

        {
            id:2,
            title:"Task Completed",
            message:"A task has been completed successfully.",
            time:"30 minutes ago"
        },

        {
            id:3,
            title:"System Update",
            message:"Application settings were updated.",
            time:"1 hour ago"
        }

    ];


    return(

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
                    notifications.map((item)=>(

                        <div 
                            className="notification-card"
                            key={item.id}
                        >

                            <div>

                                <h3>
                                    {item.title}
                                </h3>

                                <p>
                                    {item.message}
                                </p>

                            </div>


                            <span>
                                {item.time}
                            </span>


                        </div>

                    ))
                }


            </div>


        </div>

    );

}


export default Notifications;
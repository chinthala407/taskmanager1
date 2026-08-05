import { useState } from "react";
import "./Settings.css";


function Settings() {


    const [settings,setSettings] = useState({

        name:"Admin",

        email:"admin@taskmanager.com",

        emailNotifications:true,

        taskNotifications:true,

        allowRegistration:true,

        maintenanceMode:false

    });



    const handleChange=(e)=>{

        const {name,value,type,checked}=e.target;


        setSettings({

            ...settings,

            [name]:type==="checkbox" ? checked : value

        });

    };



    const saveSettings=()=>{

        console.log(settings);

        alert("Settings saved successfully");

    };



    return (

        <div className="settings-page">


            <div className="settings-header">

                <h1>Settings</h1>

                <p>
                    Manage your Task Manager system preferences.
                </p>

            </div>



            <div className="settings-grid">



                {/* Profile */}

                <div className="settings-card">

                    <h2> Profile Settings</h2>


                    <label>
                        Admin Name
                    </label>


                    <input

                    type="text"

                    name="name"

                    value={settings.name}

                    onChange={handleChange}

                    />



                    <label>
                        Email
                    </label>


                    <input

                    type="email"

                    name="email"

                    value={settings.email}

                    onChange={handleChange}

                    />


                </div>





                {/* Security */}

                <div className="settings-card">


                    <h2>Security Settings</h2>


                    <label>
                        Current Password
                    </label>


                    <input

                    type="password"

                    placeholder="Enter current password"

                    />



                    <label>
                        New Password
                    </label>


                    <input

                    type="password"

                    placeholder="Enter new password"

                    />


                </div>







                {/* Notifications */}


                <div className="settings-card">


                    <h2>Notification Settings</h2>



                    <div className="setting-option">

                    <input

                    type="checkbox"

                    name="emailNotifications"

                    checked={settings.emailNotifications}

                    onChange={handleChange}

                    />

                    <span>
                        Email Notifications
                    </span>


                    </div>





                    <div className="setting-option">


                    <input

                    type="checkbox"

                    name="taskNotifications"

                    checked={settings.taskNotifications}

                    onChange={handleChange}

                    />


                    <span>
                        Task Notifications
                    </span>


                    </div>


                </div>








                {/* System */}


                <div className="settings-card">


                    <h2>System Settings</h2>



                    <div className="setting-option">


                    <input

                    type="checkbox"

                    name="allowRegistration"

                    checked={settings.allowRegistration}

                    onChange={handleChange}

                    />


                    <span>
                        Allow New User Registration
                    </span>


                    </div>





                    <div className="setting-option">


                    <input

                    type="checkbox"

                    name="maintenanceMode"

                    checked={settings.maintenanceMode}

                    onChange={handleChange}

                    />


                    <span>
                        Maintenance Mode
                    </span>


                    </div>


                </div>



            </div>





            <button

            className="save-btn"

            onClick={saveSettings}

            >

            Save Changes

            </button>



        </div>

    );

}


export default Settings;
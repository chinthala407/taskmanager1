import { useState } from "react";
import "./UserSettings.css";


function UserSettings() {


    const [settings, setSettings] = useState(() => {


        const savedSettings = localStorage.getItem("userSettings");


        return savedSettings

            ? JSON.parse(savedSettings)

            : {

                taskNotifications: true,

                emailNotifications: true,

                darkMode: false,

                profileVisibility: true

            };


    });
    const updateSetting = (key, value) => {


        const updatedSettings = {


            ...settings,

            [key]: value


        };



        setSettings(updatedSettings);



        localStorage.setItem(

            "userSettings",

            JSON.stringify(updatedSettings)

        );


    };
        




    return (


        <div className="user-settings-page">


            <div className="user-settings-card">



                <h2>

                    User Settings

                </h2>





                <div className="settings-section">


                    <h3>

                        Notifications

                    </h3>



                    <div className="settings-row">


                        <span>

                            Task Notifications

                        </span>



                        <input

                            type="checkbox"

                            checked={settings.taskNotifications}

                            onChange={(e) =>

                                updateSetting(

                                    "taskNotifications",

                                    e.target.checked

                                )

                            }

                        />


                    </div>





                    <div className="settings-row">


                        <span>

                            Email Notifications

                        </span>



                        <input

                            type="checkbox"

                            checked={settings.emailNotifications}

                            onChange={(e) =>

                                updateSetting(

                                    "emailNotifications",

                                    e.target.checked

                                )

                            }

                        />


                    </div>


                </div>







                <div className="settings-section">


                    <h3>

                        Appearance

                    </h3>




                    <div className="settings-row">


                        <span>

                            Dark Mode

                        </span>



                        <input

                            type="checkbox"

                            checked={settings.darkMode}

                            onChange={(e) =>

                                updateSetting(

                                    "darkMode",

                                    e.target.checked

                                )

                            }

                        />


                    </div>


                </div>







                <div className="settings-section">


                    <h3>

                        Privacy

                    </h3>




                    <div className="settings-row">


                        <span>

                            Profile Visibility

                        </span>



                        <input

                            type="checkbox"

                            checked={settings.profileVisibility}

                            onChange={(e) =>

                                updateSetting(

                                    "profileVisibility",

                                    e.target.checked

                                )

                            }

                        />


                    </div>


                </div>
                <div className="settings-section">

    <h3>
        Account Settings
    </h3>


    <div className="settings-input">

        <label>
            Username
        </label>

        <input
            type="text"
            placeholder="Enter username"
        />

    </div>



    <div className="settings-input">

        <label>
            Email
        </label>


        <input
            type="email"
            placeholder="Enter email"
        />

    </div>



    <div className="settings-input">

        <label>
            Phone Number
        </label>


        <input
            type="text"
            placeholder="Enter phone number"
        />

    </div>


</div>





<div className="settings-section">


    <h3>
        Security
    </h3>



    <button className="secondary-btn">

        Change Password

    </button>



    <div className="settings-row">


        <span>
            Two Factor Authentication
        </span>


        <input
            type="checkbox"
        />


    </div>


</div>






<div className="settings-section">


    <h3>
        Task Preferences
    </h3>




    <div className="settings-input">


        <label>
            Default Priority
        </label>


        <select>


            <option>
                Low
            </option>


            <option>
                Medium
            </option>


            <option>
                High
            </option>


        </select>


    </div>





    <div className="settings-input">


        <label>
            Task View
        </label>


        <select>


            <option>
                List View
            </option>


            <option>
                Board View
            </option>


            <option>
                Calendar View
            </option>


        </select>


    </div>


</div>






<div className="settings-section">


    <h3>
        Data Management
    </h3>


    <p>
        Download your tasks and account data.
    </p>


    <button className="secondary-btn">

        Export Data

    </button>


</div>






<div className="danger-section">


    <h3>
        Danger Zone
    </h3>


    <p>
        Permanently delete your account.
    </p>


    <button className="delete-btn">

        Delete Account

    </button>


</div>




                <button className="save-settings-btn">

                    Save Settings

                </button>



            </div>


        </div>


    );

}


export default UserSettings;
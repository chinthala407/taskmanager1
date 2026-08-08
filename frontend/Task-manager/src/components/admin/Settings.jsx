import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Settings.css";

function Settings() {

    const navigate = useNavigate();

    const [settings, setSettings] = useState({

        name: "",
        email: "",
        allowRegistration: true,
        maintenanceMode: false

    });

    // Fetch logged-in admin details
    useEffect(() => {

    const fetchSettings = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/admin/system-settings",
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );


            setSettings((prev)=>({

                ...prev,

                allowRegistration:
                response.data.allow_registration,

                maintenanceMode:
                response.data.maintenance_mode

            }));


        } catch(error){

            console.log(error);

        }

    };


    fetchSettings();


},[]);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setSettings({

            ...settings,

            [name]: type === "checkbox" ? checked : value

        });

    };

    const saveSettings = async () => {

    try {

        const token = localStorage.getItem("token");


        await axios.put(
            "http://localhost:5000/api/admin/system-settings",
            {
                allow_registration:
                settings.allowRegistration,

                maintenance_mode:
                settings.maintenanceMode
            },
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );


        alert("Settings updated successfully");


    }
    catch(error){

        console.log(error);

    }

};

    const changePassword = () => {

        navigate("/forgot-password");

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

                {/* Profile Settings */}

                <div className="settings-card">

                    <h2>Profile Settings</h2>

                    <label>Admin Name</label>

                    <input
                        type="text"
                        name="name"
                        value={settings.name}
                        onChange={handleChange}
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={settings.email}
                        onChange={handleChange}
                    />

                </div>

                {/* Security Settings */}

                <div className="settings-card">

                    <h2>Security Settings</h2>

                    <p>
                        Password changes require OTP verification.
                    </p>

                    <button
                        className="change-password-btn"
                        onClick={changePassword}
                    >
                        Change Password
                    </button>

                </div>

                {/* System Settings */}

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
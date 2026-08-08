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

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Fetch logged-in admin details + system settings
    useEffect(() => {

    const fetchProfileAndSettings = async () => {

        try {

            const token = localStorage.getItem("token");

            const [profileRes, settingsRes] = await Promise.all([

                axios.get(
                    "http://localhost:5000/api/admin/profile",
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                ),

                axios.get(
                    "http://localhost:5000/api/admin/system-settings",
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                )

            ]);


            setSettings((prev)=>({

                ...prev,

                name: profileRes.data.name || "",

                email: profileRes.data.email || "",

                allowRegistration:
                settingsRes.data.allow_registration,

                maintenanceMode:
                settingsRes.data.maintenance_mode

            }));


        } catch(error){

            console.log(error);

        }

    };


    fetchProfileAndSettings();


},[]);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setSettings({

            ...settings,

            [name]: type === "checkbox" ? checked : value

        });

    };

    const saveSettings = async () => {

    setSaving(true);
    setMessage("");

    try {

        const token = localStorage.getItem("token");

        const headers = {
            Authorization:`Bearer ${token}`
        };

        // Save profile (name/email) and system settings together
        await Promise.all([

            axios.put(
                "http://localhost:5000/api/admin/profile",
                {
                    name: settings.name,
                    email: settings.email
                },
                { headers }
            ),

            axios.put(
                "http://localhost:5000/api/admin/system-settings",
                {
                    allow_registration:
                    settings.allowRegistration,

                    maintenance_mode:
                    settings.maintenanceMode
                },
                { headers }
            )

        ]);


        setMessage("Settings updated successfully");


    }
    catch(error){

        console.log(error);

        setMessage(
            error.response?.data?.message || "Failed to update settings"
        );

    }
    finally {

        setSaving(false);

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
                disabled={saving}
            >
                {saving ? "Saving..." : "Save Changes"}
            </button>

            {message && (
                <p className="settings-message">
                    {message}
                </p>
            )}

        </div>

    );

}

export default Settings;

import { useNavigate } from "react-router-dom";
import taskIcon from "../../assets/task-check-icon.png";
import ThemeToggle from "../admin/ThemeToggle";
import "../admin/AdminNavbar.css";

function UserNavbar({ onMenuClick }) {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };

    return (

        <header className="admin-navbar">

            <div className="navbar-left">

                <button
                    className="sidebar-toggle-btn"
                    onClick={onMenuClick}
                    aria-label="Toggle sidebar"
                >
                    ☰
                </button>

                <div className="brand">

                    <img
                        src={taskIcon}
                        alt="Task Manager"
                    />

                    <h2>
                        <span className="task-text">
                            Task
                        </span>

                        <span className="manager-text">
                            Manager
                        </span>
                    </h2>

                </div>

            </div>

            <div className="navbar-right">

                <ThemeToggle />

                <div className="profile">

                    <h4>{user?.name || "User"}</h4>

                    <p>{user?.email || "Task Manager User"}</p>

                </div>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </header>

    );

}

export default UserNavbar;
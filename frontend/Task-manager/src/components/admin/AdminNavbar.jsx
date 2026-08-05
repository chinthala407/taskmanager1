import { useNavigate } from "react-router-dom";
import taskIcon from "../../assets/task-check-icon.png";
import "./AdminNavbar.css";

function AdminNavbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };

    return (

        <header className="admin-navbar">

            <div className="navbar-left">

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



            <div className="navbar-center">

                <input
                    type="text"
                    placeholder="Search users, tasks..."
                    className="search-box"
                />

            </div>



            <div className="navbar-right">

                <div className="profile">

                    <h4>Administrator</h4>

                    <p>System Administrator</p>

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

export default AdminNavbar;
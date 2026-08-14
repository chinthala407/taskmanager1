import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import taskIcon from "../../assets/task-check-icon.png";
import "../admin/AdminNavbar.css";

function UserNavbar({ search, setSearch, onMenuClick }) {

    const navigate = useNavigate();
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };

    return (

        <>

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

                <div className="navbar-center">

                    <input
                        type="text"
                        placeholder="Search your tasks..."
                        className="search-box"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <div className="navbar-right">

                    <button
                        className="search-toggle-btn"
                        onClick={() => setMobileSearchOpen((prev) => !prev)}
                        aria-label="Toggle search"
                    >
                        {mobileSearchOpen ? <FaTimes /> : <FaSearch />}
                    </button>

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

            {mobileSearchOpen && (

                <div className="mobile-search-bar">

                    <input
                        type="text"
                        placeholder="Search your tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />

                </div>

            )}

        </>

    );

}

export default UserNavbar;

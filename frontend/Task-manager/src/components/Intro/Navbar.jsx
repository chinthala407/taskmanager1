import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import taskLogo from "../../assets/task-check-icon.png";
function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">

            {/* Logo */}
            <div className="logo">

                <img
                    src={taskLogo}
                    alt="Task Manager"
                    className="logo-img"
                />

                <span className="logo-text">
                    <span className="task-text">Task</span>
                    <span className="manager-text">Manager</span>
                </span>

            </div>


            {/* Hamburger */}
            <button
                className="hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
            >

                <span></span>
                <span></span>
                <span></span>

            </button>


            {/* Navigation */}
            <div
                className={`navbar-content ${
                    menuOpen ? "menu-open" : ""
                }`}
            >

                <ul className="nav-links">

                    <li>
                        <a href="#home" onClick={closeMenu}>
                            Home
                        </a>
                    </li>

                    <li>
                        <a href="#features" onClick={closeMenu}>
                            Features
                        </a>
                    </li>

                    <li>
                        <a href="#how-it-works" onClick={closeMenu}>
                            How It Works
                        </a>
                    </li>

                    <li>
                        <a href="#contact" onClick={closeMenu}>
                            Contact
                        </a>
                    </li>

                </ul>


                <div className="nav-buttons">

                    <Link
                        to="/login"
                        className="nav-btn-link"
                        onClick={closeMenu}
                    >
                        <button className="navbar-login-btn">
                            Login
                        </button>
                    </Link>

                    <Link
                        to="/register"
                        className="nav-btn-link"
                        onClick={closeMenu}
                    >
                        <button className="navbar-register-btn">
                            Register
                        </button>
                    </Link>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;
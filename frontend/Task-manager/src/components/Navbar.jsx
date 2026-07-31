import { Link } from "react-router-dom";
import "./Navbar.css";
import taskLogo from "../assets/task-check-icon.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img
          src={taskLogo}
          alt="TaskManager Logo"
          className="logo-img"
        />
        <div className="logo-text">
          <span className="task-text">Task</span>
          <span className="manager-text">Manager</span>
      </div>
      </div>

      <ul className="nav-links">
        <li><a href="#hero">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#footer">Contact</a></li>
      </ul>

      <div className="nav-buttons">
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>

        <Link to="/register">
          <button className="register-btn">Register</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
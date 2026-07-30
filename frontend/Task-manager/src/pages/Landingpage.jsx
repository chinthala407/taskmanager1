import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-container">

      <div className="hero">

        <h1>Task Manager</h1>

        <p>
          Organize your daily work, manage tasks,
          track progress, and stay productive.
        </p>

        <div className="buttons">

          <Link to="/login">
            <button className="login-btn">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="register-btn">
              Register
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default LandingPage;
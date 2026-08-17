import { Link } from "react-router-dom";
import "./Hero.css";
import heroImage from "../../assets/task-hero.png";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1>Organize Your Work, Achieve More</h1>

        <p>
          Manage your daily tasks, track progress, and stay productive with
          our modern Task Management application.
        </p>

        <div className="hero-buttons">
          <Link to="/register">
            <button className="get-started-btn">Get Started</button>
          </Link>

          <Link to="/login">
            <button className="hero-login-btn">Login</button>
          </Link>
        </div>
      </div>

      <div className="hero-image">
        <img src={heroImage} alt="Task Management" />
      </div>
    </section>
  );
}

export default Hero;
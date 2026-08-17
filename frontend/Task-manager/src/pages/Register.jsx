import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import "./Register.css";
import registerImage from "../assets/register-illustration.png";
import { useTheme } from "../context/ThemeContext";
import { FaCheckCircle,FaArrowLeft} from "react-icons/fa";

function Register() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      setMessage(res.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setConfirmPassword("");

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Registration Failed"
      );
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/google",
          { access_token: tokenResponse.access_token }
        );

        setMessage(res.data.message || "Registered with Google successfully");

      } catch (err) {
        setMessage(
          err.response?.data?.message || "Google registration failed"
        );
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setMessage("Google sign-in was cancelled or failed");
    },
  });

  return (
    <div className="register-container" data-theme={theme}>

      {/* Left Side */}

      <div className="left-panel">

        <img
          src={registerImage}
          alt="Register Illustration"
          className="register-image"
        />

        <h2>Organize Your Work Smarter</h2>

        <p className="quote">
          "Every great achievement begins with one completed task."
        </p>

        <div className="register-features">
            <div><FaCheckCircle className="feature-check-icon" /> Manage Tasks Efficiently</div>
            <div><FaCheckCircle className="feature-check-icon" /> Collaborate with Your Team</div>
            <div><FaCheckCircle className="feature-check-icon" /> Stay Organized Every Day</div>
        </div>

      </div>

      {/* Right Side */}

      <div className="right-panel">

        <div className="register-card">
         <button
            type="button"
            className="register-back-home-btn"
            onClick={() => navigate("/")}
          >
          <FaArrowLeft className="back-home-icon" /> Back to Home
          </button>
          <h1>Create Your Account </h1>

          <p className="register-subtitle">
            Join thousands of professionals managing their work efficiently.
          </p>

          <form onSubmit={handleRegister}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="register-btn">
              Create Account
            </button>

          </form>

          <p className="register-security">
             Your information is securely encrypted.
          </p>

          {message && (
            <p className="register-message">
              {message}
            </p>
          )}

          <p className="register-login-link">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>

          <button
            type="button"
            className="register-google-btn"
            onClick={() => googleLogin()}
            disabled={googleLoading}
          >
            {googleLoading ? "Signing in..." : "Continue With Google"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;
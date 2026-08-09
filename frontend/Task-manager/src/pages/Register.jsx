import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import "./Register.css";
import registerImage from "../assets/register-illustration.png";

function Register() {
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
        // tokenResponse.access_token is sent to the backend, which
        // verifies it with Google and creates/logs in the user.
        const res = await axios.post(
          "http://localhost:5000/api/auth/google",
          { access_token: tokenResponse.access_token }
        );

        setMessage(res.data.message || "Registered with Google successfully");

        // e.g. store token and redirect
        // localStorage.setItem("token", res.data.token);
        // navigate("/dashboard");

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
    <div className="register-container">

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
            <div><span>✅</span> Manage Tasks Efficiently</div>
            <div><span>✅</span> Collaborate with Your Team</div>
            <div><span>✅</span> Stay Organized Every Day</div>
        </div>

      </div>

      {/* Right Side */}

      <div className="right-panel">

        <div className="login-card">

          <h1>Create Your Account </h1>

          <p className="subtitle">
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

          <p className="security">
             Your information is securely encrypted.
          </p>

          {message && (
            <p className="message">
              {message}
            </p>
          )}

          <p className="login-link">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>

          <button
            type="button"
            className="google-btn"
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
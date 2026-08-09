import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import loginBackground from "../assets/login-background.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const user = response.data.user;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role?.toLowerCase() === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {

  if (error.response) {

    alert(error.response.data.message);

  } else {

    alert("Unable to connect to the server.");

  }

}
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/google",
          { access_token: tokenResponse.access_token }
        );

        const user = response.data.user;

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role?.toLowerCase() === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else {
          alert("Unable to connect to the server.");
        }
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      alert("Google sign-in was cancelled or failed.");
    },
  });

return (
  <div className="login-page">

    <div className="login-left">
      <img src={loginBackground} alt="Task Manager" />
    </div>

    <div className="login-right">

      <div className="login-card">

        <h1>Task Manager</h1>
        <h2>Welcome Back </h2>
        <p className="subtitle">
          Sign in to continue managing your tasks.
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-field">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>

          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <div className="forgot-password">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

        </form>

        <button
          type="button"
          className="google-btn"
          onClick={() => googleLogin()}
          disabled={googleLoading}
        >
          {googleLoading ? "Signing in..." : "Continue With Google"}
        </button>

        <p className="register-text">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>

      </div>

    </div>

  </div>
);

}

export default Login;
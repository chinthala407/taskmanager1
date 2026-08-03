import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email,
          password,
        }
      );

      alert(response.data.message);

      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Password Reset Failed");
    }
  };

  return (
    <div className="container">
      <div className="login-card">

        <h1>Task Manager</h1>

        <h2>Reset Password</h2>

        <form onSubmit={handleResetPassword}>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">
            Reset Password
          </button>

        </form>

      </div>
    </div>
  );
}

export default ResetPassword;
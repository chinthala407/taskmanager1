import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyOTP.css";

function VerifyOTP() {
  const [otp, setOtp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      alert(response.data.message);

      navigate("/reset-password", {
        state: { email },
      });

    } catch (error) {
      alert(error.response?.data?.message || "OTP Verification Failed");
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <h1>Task Manager</h1>

        <h2>Verify OTP</h2>

        <form onSubmit={handleVerifyOTP}>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit">
            Verify OTP
          </button>

        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;
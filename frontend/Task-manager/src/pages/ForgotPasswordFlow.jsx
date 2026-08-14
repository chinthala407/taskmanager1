import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPasswordFlow.css"; // reuse your existing card/form styles

const AUTH_API_BASE = "http://localhost:5000/api/auth";

function ForgotPasswordFlow() {

    // "email" -> "otp" -> "reset"
    const [step, setStep] = useState("email");

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const navigate = useNavigate();


    // =========================
    // Step 1: Send OTP
    // =========================

    const handleSendOtp = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email) {
            setError("Please enter your email.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                `${AUTH_API_BASE}/forgot-password`,
                { email }
            );

            setSuccess(response.data.message || "OTP sent to your email.");
            setStep("otp");

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message || "Unable to send OTP."
            );

        } finally {
            setLoading(false);
        }

    };


    // =========================
    // Resend OTP
    // =========================

    const handleResendOtp = async () => {

        setError("");
        setSuccess("");

        try {

            setResendLoading(true);

            const response = await axios.post(
                `${AUTH_API_BASE}/forgot-password`,
                { email }
            );

            setSuccess(response.data.message || "A new OTP has been sent.");

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message || "Unable to resend OTP."
            );

        } finally {
            setResendLoading(false);
        }

    };


    // =========================
    // Step 2: Verify OTP
    // =========================

    const handleVerifyOtp = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!otp) {
            setError("Please enter the OTP.");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                `${AUTH_API_BASE}/verify-otp`,
                { email, otp }
            );

            setSuccess(response.data.message || "OTP verified.");
            setStep("reset");

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message || "OTP verification failed."
            );

        } finally {
            setLoading(false);
        }

    };


    // =========================
    // Step 3: Reset Password
    // =========================

    const handleResetPassword = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!password || !confirmPassword) {
            setError("Please fill all fields.");
            return;
        }

        if (password.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                `${AUTH_API_BASE}/reset-password`,
                { email, otp, password }
            );

            setSuccess(response.data.message || "Password reset successfully.");

            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message || "Password Reset Failed"
            );

        } finally {
            setLoading(false);
        }

    };


    // =========================
    // Back navigation
    // =========================

    const handleBack = () => {

        setError("");
        setSuccess("");

        if (step === "otp") {
            setStep("email");
        } else if (step === "reset") {
            setStep("otp");
        }

    };


    return (

        <div className="container">

            <div className="login-card">

                <h1>Task Manager</h1>

                {step === "email" && (
                    <>
                        <h2>Forgot Password</h2>

                        {error && <p className="error-text">{error}</p>}
                        {success && <p className="success-text">{success}</p>}

                        <form onSubmit={handleSendOtp}>

                            <input
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <button type="submit" disabled={loading}>
                                {loading ? "Sending..." : "Send OTP"}
                            </button>

                        </form>

                        <p>
                            <Link to="/login">Back to Login</Link>
                        </p>
                    </>
                )}

                {step === "otp" && (
                    <>
                        <h2>Verify OTP</h2>

                        <p className="modal-description">
                            Enter the OTP sent to <strong>{email}</strong>.
                        </p>

                        {error && <p className="error-text">{error}</p>}
                        {success && <p className="success-text">{success}</p>}

                        <form onSubmit={handleVerifyOtp}>

                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />

                            <span
                                className={`modal-resend${resendLoading ? " disabled" : ""}`}
                                onClick={!resendLoading ? handleResendOtp : undefined}
                            >
                                {resendLoading ? "Resending OTP..." : "Didn't get the code? Resend OTP"}
                            </span>

                            <button type="submit" disabled={loading}>
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>

                            <button
                                type="button"
                                className="back-btn"
                                onClick={handleBack}
                                disabled={loading || resendLoading}
                            >
                                Back
                            </button>

                        </form>
                    </>
                )}

                {step === "reset" && (
                    <>
                        <h2>Reset Password</h2>

                        {error && <p className="error-text">{error}</p>}
                        {success && <p className="success-text">{success}</p>}

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

                            <button type="submit" disabled={loading}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>

                            <button
                                type="button"
                                className="back-btn"
                                onClick={handleBack}
                                disabled={loading}
                            >
                                Back
                            </button>

                        </form>
                    </>
                )}

            </div>

        </div>

    );

}

export default ForgotPasswordFlow;

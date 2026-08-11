import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserSettings.css";

const API_BASE = "http://localhost:5000/api/user";

const getAuthToken = () => localStorage.getItem("token");

const authFetch = (path, options = {}) => {
    return fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
            ...(options.headers || {}),
        },
    });
};

function UserSettings() {

    const navigate = useNavigate();

    // =========================
    // Change Password
    // =========================

    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);


    // =========================
    // Delete Account
    // =========================

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [deleteError, setDeleteError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);


    // =========================
    // Open Password Modal
    // =========================

    const openPasswordModal = () => {

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setPasswordError("");
        setPasswordSuccess("");

        setShowPasswordModal(true);
    };


    // =========================
    // Close Password Modal
    // =========================

    const closePasswordModal = () => {

        if (passwordLoading) return;

        setShowPasswordModal(false);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setPasswordError("");
        setPasswordSuccess("");
    };


    // =========================
    // Change Password
    // =========================

    const handleChangePassword = async () => {

        setPasswordError("");
        setPasswordSuccess("");

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {

            setPasswordError("Please fill all password fields.");

            return;
        }


        if (newPassword.length < 6) {

            setPasswordError(
                "New password must be at least 6 characters."
            );

            return;
        }


        if (newPassword !== confirmPassword) {

            setPasswordError(
                "New password and confirm password do not match."
            );

            return;
        }


        if (currentPassword === newPassword) {

            setPasswordError(
                "New password must be different from current password."
            );

            return;
        }


        try {

            setPasswordLoading(true);

            const response = await authFetch(
                "/change-password",
                {
                    method: "PUT",

                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setPasswordError(
                    data.message || "Unable to change password."
                );

                return;
            }


            setPasswordSuccess(
                "Password changed successfully."
            );


            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");


            setTimeout(() => {

                setShowPasswordModal(false);

                setPasswordSuccess("");

            }, 1500);


        } catch (error) {

            console.error(
                "Change Password Error:",
                error
            );

            setPasswordError(
                "Something went wrong. Please try again."
            );

        } finally {

            setPasswordLoading(false);
        }
    };


    // =========================
    // Open Delete Modal
    // =========================

    const openDeleteModal = () => {

        setDeleteError("");

        setShowDeleteModal(true);
    };


    // =========================
    // Close Delete Modal
    // =========================

    const closeDeleteModal = () => {

        if (deleteLoading) return;

        setDeleteError("");

        setShowDeleteModal(false);
    };


    // =========================
    // Delete Account
    // =========================

    const handleDeleteAccount = async () => {

        setDeleteError("");

        try {

            setDeleteLoading(true);


            const response = await authFetch(
                "/account",
                {
                    method: "DELETE",
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setDeleteError(
                    data.message ||
                    "Unable to delete account."
                );

                return;
            }


            // Remove authentication data
            localStorage.removeItem("token");
            localStorage.removeItem("user");


            // Close modal
            setShowDeleteModal(false);


            // Redirect to login
            navigate("/login", {
                replace: true,
            });


        } catch (error) {

            console.error(
                "Delete Account Error:",
                error
            );

            setDeleteError(
                "Something went wrong while deleting your account."
            );

        } finally {

            setDeleteLoading(false);
        }
    };


    return (

        <div className="user-settings-page">

            <div className="user-settings-card">

                <h2>User Settings</h2>


                {/* =========================
                    SECURITY
                ========================= */}

                <div className="settings-section">

                    <h3>Security</h3>

                    <p>
                        Manage your account password.
                    </p>

                    <button
                        className="secondary-btn"
                        onClick={openPasswordModal}
                    >
                        Change Password
                    </button>

                </div>


                {/* =========================
                    DANGER ZONE
                ========================= */}

                <div className="danger-section">

                    <h3>Danger Zone</h3>

                    <p>
                        Permanently delete your account and
                        associated data.
                    </p>

                    <button
                        className="delete-btn"
                        onClick={openDeleteModal}
                    >
                        <span className="btn-icon"></span>
                        Delete Account
                    </button>

                </div>

            </div>


            {/* =====================================================
                CHANGE PASSWORD MODAL
            ===================================================== */}

            {showPasswordModal && (

                <div
                    className="modal-overlay"
                    onClick={closePasswordModal}
                >

                    <div
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <h3>Change Password</h3>

                        <p className="modal-description">
                            Enter your current password and choose
                            a new password.
                        </p>


                        {passwordError && (

                            <p className="error-text">
                                {passwordError}
                            </p>

                        )}


                        {passwordSuccess && (

                            <p className="success-text">
                                {passwordSuccess}
                            </p>

                        )}


                        <div className="settings-input">

                            <label>
                                Current Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="settings-input">

                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="settings-input">

                            <label>
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="modal-actions">

                            <button
                                className="secondary-btn"
                                onClick={closePasswordModal}
                                disabled={passwordLoading}
                            >
                                Cancel
                            </button>


                            <button
                                className="save-settings-btn"
                                onClick={handleChangePassword}
                                disabled={passwordLoading}
                            >

                                {passwordLoading
                                    ? "Changing..."
                                    : "Change Password"}

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                DELETE ACCOUNT MODAL
            ===================================================== */}

            {showDeleteModal && (

                <div
                    className="modal-overlay"
                    onClick={closeDeleteModal}
                >

                    <div
                        className="modal-card delete-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <h3>
                            Delete Account?
                        </h3>


                        <p className="delete-warning">

                            This action is permanent and cannot
                            be undone.

                        </p>


                        <p>

                            Your account credentials, profile
                            information and tasks will be
                            permanently deleted.

                        </p>


                        {deleteError && (

                            <p className="error-text">
                                {deleteError}
                            </p>

                        )}


                        <div className="modal-actions">

                            <button
                                className="secondary-btn"
                                onClick={closeDeleteModal}
                                disabled={deleteLoading}
                            >
                                No, Keep Account
                            </button>


                            <button
                                className="delete-btn"
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading}
                            >

                                {deleteLoading
                                    ? "Deleting..."
                                    : "Yes, Delete My Account"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default UserSettings;


const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getUserDashboard,
    createTask,
    getUserTasks,
    getUserNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    getUserProfile,
    changeUserPassword,
    deleteUserAccount,
    exportUserData
} = require("../controllers/userController");


// ======================================================
// User Dashboard
// ======================================================

router.get(
    "/dashboard",
    verifyToken,
    getUserDashboard
);


// ======================================================
// Get User Tasks
// ======================================================

router.get(
    "/tasks",
    verifyToken,
    getUserTasks
);


// ======================================================
// Create Task
// ======================================================

router.post(
    "/tasks",
    verifyToken,
    createTask
);


// ======================================================
// Get User Notifications
// ======================================================

router.get(
    "/notifications",
    verifyToken,
    getUserNotifications
);


// ======================================================
// Mark Notification As Read
// ======================================================

router.patch(
    "/notifications/:id/read",
    verifyToken,
    markNotificationRead
);


// ======================================================
// Mark All Notifications As Read
// ======================================================

router.patch(
    "/notifications/read-all",
    verifyToken,
    markAllNotificationsRead
);


// ======================================================
// Test Route
// ======================================================

router.get(
    "/test",
    (req, res) => {

        res.json({
            message: "User route working"
        });

    }
);


// ======================================================
// User Profile
// ======================================================

router.get(
    "/profile",
    verifyToken,
    getUserProfile
);




// ======================================================
// Change Password
// ======================================================
router.put(
    "/change-password",
    verifyToken,
    changeUserPassword
);


// ======================================================
// Delete Account
// ======================================================

router.delete(
    "/account",
    verifyToken,
    deleteUserAccount
);


// ======================================================
// Export User Data
// ======================================================

router.get(
    "/export",
    verifyToken,
    exportUserData
);


module.exports = router;

router.get("/route-test", (req, res) => {
    res.json({
        message: "USER ROUTES ARE LOADED"
    });
});
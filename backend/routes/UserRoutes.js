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
    updateUserProfile
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
router.patch(
    "/notifications/read-all",
    verifyToken,
    markAllNotificationsRead
);
// ======================================================
// User Profile
// ======================================================

router.get(
    "/profile",
    verifyToken,
    getUserProfile
);


router.put(
    "/profile",
    verifyToken,
    updateUserProfile
);

module.exports = router;
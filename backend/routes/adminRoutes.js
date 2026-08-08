const express = require("express");

const router = express.Router();
const {
    deleteNotification
} = require("../controllers/adminController");
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const {

    getDashboardStats,
    getDashboardData,
    getReports,

    getAllUsers,
    getAllTasks,

    deleteTask,
    updateTask,

    updateUserStatus,

    getNotifications,
    getNotificationCounts,

    markNotificationsRead,
    markUsersSeen,
    markTasksSeen,

    getAdminProfile,
    updateAdminProfile,

    deleteUser,

    getSystemSettings,
    updateSystemSettings

} = require("../controllers/adminController");




// ================= Dashboard =================

router.get("/stats", getDashboardStats);

router.get("/dashboard", getDashboardData);




// ================= Users =================

router.get("/users", getAllUsers);

router.put("/users/seen", markUsersSeen);

router.put("/users/:id/status", updateUserStatus);

router.delete("/users/:id", deleteUser);




console.log("✅ adminRoutes.js file loaded - tasks/seen route is registered here");

// ================= Tasks =================

router.get("/tasks", getAllTasks);

// NOTE: this must come BEFORE "/tasks/:id" routes.
// Express matches routes top-to-bottom, and "/tasks/:id" would
// otherwise treat "seen" as an :id value and swallow this request,
// routing it into updateTask instead of markTasksSeen.
router.put("/tasks/seen", markTasksSeen);

router.delete("/tasks/:id", deleteTask);

router.put("/tasks/:id", updateTask);




// ================= Reports =================

router.get("/reports", getReports);




// ================= Notifications =================
router.delete("/notifications/:id",deleteNotification);
router.get("/notifications", getNotifications);
// ================= Badge Counts =================
router.get("/notification-counts", getNotificationCounts);

// ================= Mark Read =================
router.put("/notifications/read", markNotificationsRead);




// ================= Admin Profile =================



router.get(
    "/profile",
    verifyToken,
    isAdmin,
    getAdminProfile
);

router.put(
    "/profile",
    verifyToken,
    isAdmin,
    updateAdminProfile
);
router.get(
    "/system-settings",
    verifyToken,
    isAdmin,
    getSystemSettings
);


router.put(
    "/system-settings",
    verifyToken,
    isAdmin,
    updateSystemSettings
);

module.exports = router;
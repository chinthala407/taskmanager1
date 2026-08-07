const express = require("express");

const router = express.Router();
const {
    deleteNotification
} = require("../controllers/adminController");

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

    deleteUser


} = require("../controllers/adminController");




// ================= Dashboard =================

router.get("/stats", getDashboardStats);

router.get("/dashboard", getDashboardData);




// ================= Users =================

router.get("/users", getAllUsers);

router.put("/users/:id/status", updateUserStatus);

router.delete("/users/:id", deleteUser);




// ================= Tasks =================

router.get("/tasks", getAllTasks);

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

// ================= Mark Users Seen =================
router.put("/users/seen", markUsersSeen);

// ================= Mark Tasks Seen =================
router.put("/tasks/seen", markTasksSeen);




// ================= Admin Profile =================

router.get("/profile", getAdminProfile);




module.exports = router;
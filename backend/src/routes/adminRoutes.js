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
    updateSystemSettings,

    sendAdminChangePasswordOtp,
    changeAdminPassword,

    getAllSupportTickets,
    updateSupportTicket,
    replySupportTicketAsAdmin

} = require("../controllers/adminController");




// ================= Dashboard =================

router.get("/stats", getDashboardStats);

router.get("/dashboard", getDashboardData);




// ================= Users =================

router.get("/users", getAllUsers);

router.put("/users/seen", markUsersSeen);

router.put("/users/:id/status", updateUserStatus);

router.delete("/users/:id", deleteUser);






// ================= Tasks =================

router.get("/tasks", getAllTasks);


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


// ================= Admin Change Password (OTP flow) =================

router.post(
    "/send-change-password-otp",
    verifyToken,
    isAdmin,
    sendAdminChangePasswordOtp
);

router.put(
    "/change-password",
    verifyToken,
    isAdmin,
    changeAdminPassword
);


// ================= Support Tickets =================

router.get(
    "/support/tickets",
    verifyToken,
    isAdmin,
    getAllSupportTickets
);

router.patch(
    "/support/tickets/:id",
    verifyToken,
    isAdmin,
    updateSupportTicket
);

router.post(
    "/support/tickets/:id/reply",
    verifyToken,
    isAdmin,
    replySupportTicketAsAdmin
);


module.exports = router;
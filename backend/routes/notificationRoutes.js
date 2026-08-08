const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    getUserNotifications

} = require("../controllers/notificationController");

// ================= User Notifications =================

router.get(
    "/",
    authMiddleware,
    getUserNotifications
);

module.exports = router;
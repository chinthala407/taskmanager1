const express = require("express");

const router = express.Router();


const {
    getDashboardStats,
    getAllUsers,
    getAllTasks,
    deleteTask,
    updateUserStatus,
    getReports
} = require("../controllers/adminController");



// Dashboard stats
router.get("/stats", getDashboardStats);


// Get all users
router.get("/users", getAllUsers);

router.get("/tasks", getAllTasks);

router.delete("/tasks/:id", deleteTask);
router.put("/users/:id/status",updateUserStatus);
router.get("/reports", getReports);
module.exports = router;
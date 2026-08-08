const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    getUserTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getCompletedTasks,
    getUserReportTasks

} = require("../controllers/taskController");

// ================= Create Task =================

router.post(
    "/",
    authMiddleware,
    createTask
);

// ================= Get User Tasks =================

router.get(
    "/user",
    authMiddleware,
    getUserTasks
);

// ================= Update Task =================

router.put(
    "/:id",
    authMiddleware,
    updateTask
);

// ================= Delete Task =================

router.delete(
    "/:id",
    authMiddleware,
    deleteTask
);

// ================= Update Task Status =================

router.patch(
    "/:id/status",
    authMiddleware,
    updateTaskStatus
);

// ================= Completed Tasks =================

router.get(
    "/completed",
    authMiddleware,
    getCompletedTasks
);

// ================= Reports =================

router.get(
    "/reports",
    authMiddleware,
    getUserReportTasks
);

module.exports = router;
const db = require("../config/db");


// Notification function from UserController
const {
    createUserNotification
} = require("./UserController");



// ======================================================
// Get User Tasks
// ======================================================

const getUserTasks = async (req, res) => {

    try {

        const userId = req.user.id;


        const result = await db.query(

            `
            SELECT
                id,
                title,
                description,
                priority,
                due_date,
                status,
                user_id
            FROM tasks
            WHERE user_id = $1
            ORDER BY id DESC
            `,

            [userId]

        );


        res.json(result.rows);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};



// ======================================================
// Create Task
// ======================================================

const createTask = async (req, res) => {

    try {

        const userId = req.user.id;


        const {
            title,
            description,
            priority,
            dueDate
        } = req.body;


        const result = await db.query(

            `
            INSERT INTO tasks
            (
                user_id,
                title,
                description,
                priority,
                status,
                due_date,
                created_at
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                'Pending',
                $5,
                NOW()
            )

            RETURNING *
            `,

            [
                userId,
                title,
                description,
                priority,
                dueDate
            ]

        );


        const task = result.rows[0];


        // Create notification for new task

        await createUserNotification(
            userId,
            `New task "${task.title}" has been created`
        );


        res.status(201).json({

            message: "Task created successfully",

            task: task

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

};



// ======================================================
// Update Task
// ======================================================

const updateTask = async (req, res) => {

    try {

        const taskId = req.params.id;

        const userId = req.user.id;


        const {
            title,
            description,
            priority,
            status,
            due_date
        } = req.body;



        // Get existing task first

        const oldTaskResult = await db.query(

            `
            SELECT
                id,
                title,
                status
            FROM tasks
            WHERE id = $1
            AND user_id = $2
            `,

            [
                taskId,
                userId
            ]

        );


        if (oldTaskResult.rows.length === 0) {

            return res.status(404).json({

                message: "Task not found"

            });

        }


        const oldTask = oldTaskResult.rows[0];



        // Update task

        const result = await db.query(

            `
            UPDATE tasks

            SET
                title = $1,
                description = $2,
                priority = $3,
                status = $4,
                due_date = $5

            WHERE id = $6
            AND user_id = $7

            RETURNING *
            `,

            [
                title,
                description,
                priority,
                status,
                due_date,
                taskId,
                userId
            ]

        );


        const updatedTask = result.rows[0];



        // Create notification only if status changed

        if (
            oldTask.status &&
            status &&
            oldTask.status.toLowerCase() !==
            status.toLowerCase()
        ) {


            if (
                status.toLowerCase() === "completed"
            ) {

                await createUserNotification(

                    userId,

                    `Task "${updatedTask.title}" has been completed`

                );

            }
            else {

                await createUserNotification(

                    userId,

                    `Task "${updatedTask.title}" status changed to ${status}`

                );

            }

        }



        res.status(200).json({

            message: "Task updated successfully",

            task: updatedTask

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Internal Server Error"

        });

    }

};



// ======================================================
// Delete Task
// ======================================================

const deleteTask = async (req, res) => {

    try {

        const id = req.params.id;

        const userId = req.user.id;


        const result = await db.query(

            `
            DELETE FROM tasks

            WHERE id = $1
            AND user_id = $2

            RETURNING *
            `,

            [
                id,
                userId
            ]

        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                message: "Task not found"

            });

        }


        res.json({

            message: "Task deleted successfully"

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

};



// ======================================================
// Complete Task
// ======================================================

const updateTaskStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const userId = req.user.id;



        // Get task first

        const oldTaskResult = await db.query(

            `
            SELECT
                id,
                title,
                status
            FROM tasks

            WHERE id = $1
            AND user_id = $2
            `,

            [
                id,
                userId
            ]

        );


        if (oldTaskResult.rows.length === 0) {

            return res.status(404).json({

                message: "Task not found"

            });

        }


        const oldTask = oldTaskResult.rows[0];



        // Update status

        const result = await db.query(

            `
            UPDATE tasks

            SET status = 'Completed'

            WHERE id = $1
            AND user_id = $2

            RETURNING *
            `,

            [
                id,
                userId
            ]

        );


        const task = result.rows[0];



        // Only create notification
        // if task was not already completed

        if (
            oldTask.status.toLowerCase() !==
            "completed"
        ) {

            await createUserNotification(

                userId,

                `Task "${task.title}" has been completed`

            );

        }


        res.json(task);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

};



// ======================================================
// Get Completed Tasks
// ======================================================

const getCompletedTasks = async (req, res) => {

    try {

        const userId = req.user.id;


        const result = await db.query(

            `
            SELECT
                id,
                title,
                description,
                priority,
                status,
                due_date,
                created_at

            FROM tasks

            WHERE user_id = $1

            AND LOWER(status) = 'completed'

            ORDER BY created_at DESC
            `,

            [userId]

        );


        res.json(result.rows);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

};



// ======================================================
// Get User Tasks For Reports
// ======================================================

const getUserReportTasks = async (req, res) => {

    try {

        const userId = req.user.id;


        const result = await db.query(

            `
            SELECT
                id,
                title,
                description,
                priority,
                status,
                created_at,
                due_date

            FROM tasks

            WHERE user_id = $1

            ORDER BY created_at DESC
            `,

            [userId]

        );


        res.json(result.rows);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};



// ======================================================
// Export
// ======================================================

module.exports = {

    createTask,

    getUserTasks,

    updateTask,

    deleteTask,

    updateTaskStatus,

    getCompletedTasks,

    getUserReportTasks

};
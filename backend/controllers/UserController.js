const db = require("../config/db");



// ======================================================
// Create User Notification
// ======================================================

const createUserNotification = async (userId, message) => {

    try {

        await db.query(

            `
            INSERT INTO user_notifications
            (
                user_id,
                message,
                is_read
            )

            VALUES
            (
                $1,
                $2,
                false
            )
            `,

            [
                userId,
                message
            ]

        );

    }
    catch (error) {

        console.log(
            "Notification Error:",
            error
        );

    }

};



// ======================================================
// Get User Notifications
// ======================================================

const getUserNotifications = async (req, res) => {

    try {

        const userId = req.user.id;


        const result = await db.query(

            `
            SELECT
                id,
                message,
                is_read,
                created_at

            FROM user_notifications

            WHERE user_id = $1

            ORDER BY created_at DESC
            `,

            [userId]

        );


        res.status(200).json(result.rows);

    }
    catch (error) {

        console.log(
            "Get Notifications Error:",
            error
        );


        res.status(500).json({

            message: "Internal Server Error"

        });

    }

};



// ======================================================
// Mark Notification As Read
// ======================================================

const markNotificationRead = async (req, res) => {

    try {

        const userId = req.user.id;

        const notificationId = req.params.id;


        await db.query(

            `
            UPDATE user_notifications

            SET is_read = true

            WHERE id = $1

            AND user_id = $2
            `,

            [
                notificationId,
                userId
            ]

        );


        res.status(200).json({

            message: "Notification marked as read"

        });

    }
    catch (error) {

        console.log(
            "Mark Notification Error:",
            error
        );


        res.status(500).json({

            message: "Internal Server Error"

        });

    }

};



// ======================================================
// User Dashboard
// ======================================================

const getUserDashboard = async (req, res) => {

    try {

        console.log(
            "USER ID:",
            req.user.id
        );


        const userId = req.user.id;



        // ================= User Details =================

        const userResult = await db.query(

            `
            SELECT
                name,
                email

            FROM users

            WHERE id = $1
            `,

            [userId]

        );



        // ================= Task Statistics =================

        const statsResult = await db.query(

            `
            SELECT

                COUNT(*) AS total,

                COUNT(*) FILTER(
                    WHERE LOWER(status) = 'completed'
                ) AS completed,

                COUNT(*) FILTER(
                    WHERE LOWER(status) = 'pending'
                ) AS pending,

                COUNT(*) FILTER(
                    WHERE LOWER(status) = 'in progress'
                ) AS progress

            FROM tasks

            WHERE user_id = $1
            `,

            [userId]

        );



        // ================= Recent Tasks =================

        const tasksResult = await db.query(

            `
            SELECT

                id,
                title,
                description,
                status,
                priority,
                due_date,
                created_at

            FROM tasks

            WHERE user_id = $1

            ORDER BY created_at DESC

            LIMIT 5
            `,

            [userId]

        );



        res.json({

            user: userResult.rows[0],

            stats: statsResult.rows[0],

            recentTasks: tasksResult.rows

        });

    }
    catch (error) {

        console.log(error);


        res.status(500).json({

            message: "Server Error"

        });

    }

};



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
                status,
                due_date,
                created_at

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
// Create Task
// ======================================================

const createTask = async (req, res) => {

    console.log(
        "===== CREATE TASK API HIT ====="
    );


    try {

        console.log(
            "BODY:",
            req.body
        );


        console.log(
            "USER:",
            req.user
        );


        const userId = req.user.id;


        const {
            title,
            description,
            priority,
            dueDate
        } = req.body;



        // ================= Insert Task =================

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
                created_at,
                is_seen_by_admin
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                'Pending',
                $5,
                NOW(),
                false
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


        console.log(
            "INSERT RESULT:",
            task
        );



        // ==================================================
        // Create Notification For New Task
        // ==================================================

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

        console.log(
            "DATABASE ERROR:",
            error
        );


        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================================
// Mark All Notifications As Read
// ======================================================

const markAllNotificationsRead = async (req, res) => {

    try {

        const userId = req.user.id;

        await db.query(

            `
            UPDATE user_notifications

            SET is_read = true

            WHERE user_id = $1
            AND is_read = false
            `,

            [userId]

        );


        res.status(200).json({

            message: "All notifications marked as read"

        });

    }
    catch (error) {

        console.log(
            "Mark All Notifications Error:",
            error
        );


        res.status(500).json({

            message: "Internal Server Error"

        });

    }

};
// ======================================================
// Get User Profile
// ======================================================

const getUserProfile = async (req, res) => {

    try {

        const userId = req.user.id;


        const result = await db.query(

            `
            SELECT
                id,
                name,
                email,
                role,
                phone,
                address

            FROM users

            WHERE id = $1
            `,

            [userId]

        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                message: "User not found"

            });

        }


        res.status(200).json(
            result.rows[0]
        );

    }
    catch (error) {

        console.log(
            "Get Profile Error:",
            error
        );


        res.status(500).json({

            message: "Internal Server Error"

        });

    }

};
// ======================================================
// Update User Profile
// ======================================================

const updateUserProfile = async (req, res) => {

    try {

        const userId = req.user.id;


        const {
            name,
            phone,
            address
        } = req.body;


        const result = await db.query(

            `
            UPDATE users

            SET
                name = $1,
                phone = $2,
                address = $3

            WHERE id = $4

            RETURNING
                id,
                name,
                email,
                role,
                phone,
                address
            `,

            [
                name,
                phone,
                address,
                userId
            ]

        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                message: "User not found"

            });

        }


        res.status(200).json({

            message: "Profile updated successfully",

            user: result.rows[0]

        });

    }
    catch (error) {

        console.log(
            "Update Profile Error:",
            error
        );


        res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

// ======================================================
// Export
// ======================================================

module.exports = {

    getUserDashboard,

    getUserTasks,

    createTask,

    getUserNotifications,

    createUserNotification,

    markNotificationRead,
    markAllNotificationsRead,
    getUserProfile,

    updateUserProfile

};
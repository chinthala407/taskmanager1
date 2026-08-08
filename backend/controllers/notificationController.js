const db = require("../config/db");


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
            "Get User Notifications Error:",
            error
        );


        res.status(500).json({

            message: "Internal Server Error"

        });

    }

};



// ======================================================
// Create User Notification
// ======================================================

const createUserNotification = async (
    userId,
    message
) => {

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
            "Create User Notification Error:",
            error
        );

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
            "Mark Notification Read Error:",
            error
        );


        res.status(500).json({

            message: "Internal Server Error"

        });

    }

};



// ======================================================
// Create Overdue Notifications
// ======================================================

const createOverdueNotifications = async () => {

    try {

        const result = await db.query(

            `
            SELECT
                id,
                user_id,
                title
            FROM tasks
            WHERE
                due_date < CURRENT_TIMESTAMP
                AND LOWER(status) != 'completed'
            `

        );


        for (const task of result.rows) {


            const message =
                `Task "${task.title}" is overdue and still not completed`;


            // Prevent duplicate notifications

            const existing = await db.query(

                `
                SELECT id

                FROM user_notifications

                WHERE user_id = $1

                AND message = $2

                LIMIT 1
                `,

                [
                    task.user_id,
                    message
                ]

            );


            if (existing.rows.length === 0) {

                await createUserNotification(

                    task.user_id,

                    message

                );

            }

        }

    }
    catch (error) {

        console.log(
            "Overdue Notification Error:",
            error
        );

    }

};



// ======================================================
// Export
// ======================================================

module.exports = {

    getUserNotifications,

    createUserNotification,

    markNotificationRead,

    createOverdueNotifications

};
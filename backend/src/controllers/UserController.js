const db = require("../config/db");
const bcrypt = require("bcrypt");
const PDFDocument = require("pdfkit");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const chartCanvas = new ChartJSNodeCanvas({
    width: 500,
    height: 300,
    backgroundColour: "white"
});


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


        res.status(200).json(
            result.rows
        );

    }
    catch (error) {

        console.log(
            "Get Notifications Error:",
            error
        );


        res.status(500).json({

            message:
                "Internal Server Error"

        });

    }

};


// ======================================================
// Mark Notification As Read
// ======================================================

const markNotificationRead = async (req, res) => {

    try {

        const userId = req.user.id;

        const notificationId =
            req.params.id;


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

            message:
                "Notification marked as read"

        });

    }
    catch (error) {

        console.log(
            "Mark Notification Error:",
            error
        );


        res.status(500).json({

            message:
                "Internal Server Error"

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

            user:
                userResult.rows[0],

            stats:
                statsResult.rows[0],

            recentTasks:
                tasksResult.rows

        });

    }
    catch (error) {

        console.log(error);


        res.status(500).json({

            message:
                "Server Error"

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


        res.json(
            result.rows
        );

    }
    catch (error) {

        console.log(error);


        res.status(500).json({

            message:
                "Server Error"

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


        // ==================================================
        // Validate Task Title
        // ==================================================

        if (!title || title.trim() === "") {

            return res.status(400).json({

                success: false,

                message:
                    "Task title is required."

            });

        }


        // ==================================================
        // Validate Due Date
        // ==================================================

        if (dueDate) {

            /*
             * Get today's date.
             *
             * We use the local date rather than comparing
             * the complete time values.
             */

            const today = new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );


            /*
             * Convert the submitted due date
             * into a Date object.
             */

            const selectedDate =
                new Date(dueDate);

            selectedDate.setHours(
                0,
                0,
                0,
                0
            );


            /*
             * Reject past dates.
             */

            if (selectedDate < today) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Due date cannot be in the past."

                });

            }

        }


        // ==================================================
        // Insert Task
        // ==================================================

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
                dueDate || null
            ]
        );


        const task =
            result.rows[0];


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


        // ==================================================
        // Success Response
        // ==================================================

        return res.status(201).json({

            success: true,

            message:
                "Task created successfully",

            task:
                task

        });


    }
    catch (error) {

        console.log(
            "DATABASE ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};




// ======================================================
// Delete Notification
// ======================================================

const deleteNotification = async (req, res) => {

    try {

        const userId = req.user.id;

        const notificationId =
            req.params.id;


        const result = await db.query(
            `
            DELETE FROM user_notifications

            WHERE id = $1

            AND user_id = $2

            RETURNING id
            `,
            [
                notificationId,
                userId
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Notification not found"

            });

        }


        res.status(200).json({

            message:
                "Notification deleted successfully"

        });

    }
    catch (error) {

        console.log(
            "Delete Notification Error:",
            error
        );


        res.status(500).json({

            message:
                "Internal Server Error"

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

            message:
                "All notifications marked as read"

        });

    }
    catch (error) {

        console.log(
            "Mark All Notifications Error:",
            error
        );


        res.status(500).json({

            message:
                "Internal Server Error"

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

                message:
                    "User not found"

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

            message:
                "Internal Server Error"

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

                message:
                    "User not found"

            });

        }


        res.status(200).json({

            message:
                "Profile updated successfully",

            user:
                result.rows[0]

        });

    }
    catch (error) {

        console.log(
            "Update Profile Error:",
            error
        );


        res.status(500).json({

            message:
                "Internal Server Error"

        });

    }

};


// ======================================================
// CHANGE PASSWORD
// ======================================================

const changeUserPassword = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            currentPassword,
            newPassword
        } = req.body;


        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                message:
                    "Current password and new password are required."
            });

        }


        if (newPassword.length < 6) {

            return res.status(400).json({
                message:
                    "New password must be at least 6 characters."
            });

        }


        // Get the current hashed password
        const result = await db.query(
            `
            SELECT password
            FROM users
            WHERE id = $1
            `,
            [userId]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "User not found."
            });

        }


        const storedPassword = result.rows[0].password;


        // Compare entered current password
        const passwordMatch = await bcrypt.compare(
            currentPassword,
            storedPassword
        );


        if (!passwordMatch) {

            return res.status(401).json({
                message:
                    "Current password is incorrect."
            });

        }


        // Hash the new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );


        // Update database
        const updateResult = await db.query(
            `
            UPDATE users
            SET password = $1
            WHERE id = $2
            RETURNING id
            `,
            [
                hashedPassword,
                userId
            ]
        );


        if (updateResult.rows.length === 0) {

            return res.status(404).json({
                message:
                    "Password could not be updated."
            });

        }


        console.log(
            "Password updated for user:",
            userId
        );


        return res.status(200).json({
            message:
                "Password changed successfully."
        });

    }
    catch (error) {

        console.error(
            "CHANGE PASSWORD ERROR:",
            error
        );


        return res.status(500).json({
            message:
                error.message
        });

    }

};


// ======================================================
// DELETE USER ACCOUNT
// ======================================================

const deleteUserAccount = async (req, res) => {

    const client =
        await db.connect();


    try {

        const userId =
            req.user.id;


        // Start transaction
        await client.query(
            "BEGIN"
        );


        // ==================================================
        // Delete user's tasks
        // ==================================================

        await client.query(
            `
            DELETE FROM tasks

            WHERE user_id = $1
            `,
            [userId]
        );


        // ==================================================
        // Delete user's notifications
        // ==================================================

        await client.query(
            `
            DELETE FROM user_notifications

            WHERE user_id = $1
            `,
            [userId]
        );


        // ==================================================
        // Delete user credentials/account
        // ==================================================

        const result =
            await client.query(
                `
                DELETE FROM users

                WHERE id = $1

                RETURNING id
                `,
                [userId]
            );


        if (
            result.rows.length === 0
        ) {

            await client.query(
                "ROLLBACK"
            );


            return res.status(404).json({

                message:
                    "User not found."

            });

        }


        // Commit all deletions
        await client.query(
            "COMMIT"
        );


        res.status(200).json({

            message:
                "Account and all associated data deleted successfully."

        });

    }
    catch (error) {

        await client.query(
            "ROLLBACK"
        );


        console.log(
            "Delete Account Error:",
            error
        );


        res.status(500).json({

            message:
                "Internal Server Error"

        });

    }
    finally {

        client.release();

    }

};


// ======================================================
// Export User Data
// ======================================================

const exportUserData = async (req, res) => {

    try {

        const userId = req.user.id;


        // ================= User Details =================

        const userResult = await db.query(
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


        if (userResult.rows.length === 0) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }

        const user = userResult.rows[0];


        // ================= All Tasks =================

        const tasksResult = await db.query(
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


        // ================= All Notifications =================

        const notificationsResult = await db.query(
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


        const tasks = tasksResult.rows;
        const notifications = notificationsResult.rows;


        // ================= Statistics (matches UserReports.jsx) =================

        const totalTasks = tasks.length;

        const completed = tasks.filter(
            (task) => task.status?.toLowerCase() === "completed"
        ).length;

        const pending = tasks.filter(
            (task) => task.status?.toLowerCase() === "pending"
        ).length;

        const progress = tasks.filter(
            (task) => task.status?.toLowerCase() === "in progress"
        ).length;

        const high = tasks.filter(
            (task) => task.priority?.toLowerCase() === "high"
        ).length;

        const medium = tasks.filter(
            (task) => task.priority?.toLowerCase() === "medium"
        ).length;

        const low = tasks.filter(
            (task) => task.priority?.toLowerCase() === "low"
        ).length;


        // ================= Monthly Tasks =================

        const monthCount = {};

        tasks.forEach((task) => {

            const month = new Date(task.created_at).toLocaleString(
                "en-US",
                { month: "short" }
            );

            monthCount[month] = (monthCount[month] || 0) + 1;

        });


        // ==================================================
        // Generate Chart Images (same 4 charts as UserReports.jsx)
        // ==================================================

        const chartPlugins = {
            legend: {
                position: "bottom"
            }
        };

        let statusChartImage = null;
        let priorityChartImage = null;
        let completionChartImage = null;
        let monthlyChartImage = null;

        try {

            statusChartImage = await chartCanvas.renderToBuffer({
                type: "doughnut",
                data: {
                    labels: ["Pending", "In Progress", "Completed"],
                    datasets: [{
                        data: [pending, progress, completed],
                        backgroundColor: ["#f59e0b", "#3b82f6", "#22c55e"],
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        ...chartPlugins,
                        title: { display: true, text: "Task Status" }
                    }
                }
            });

        }
        catch (chartError) {
            console.log("Status Chart Error:", chartError);
        }

        try {

            priorityChartImage = await chartCanvas.renderToBuffer({
                type: "doughnut",
                data: {
                    labels: ["Low", "Medium", "High"],
                    datasets: [{
                        data: [low, medium, high],
                        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        ...chartPlugins,
                        title: { display: true, text: "Task Priority" }
                    }
                }
            });

        }
        catch (chartError) {
            console.log("Priority Chart Error:", chartError);
        }

        try {

            completionChartImage = await chartCanvas.renderToBuffer({
                type: "pie",
                data: {
                    labels: ["Completed", "Remaining"],
                    datasets: [{
                        data: [completed, totalTasks - completed],
                        backgroundColor: ["#22c55e", "#94a3b8"],
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        ...chartPlugins,
                        title: { display: true, text: "Completion Rate" }
                    }
                }
            });

        }
        catch (chartError) {
            console.log("Completion Chart Error:", chartError);
        }

        try {

            if (Object.keys(monthCount).length > 0) {

                monthlyChartImage = await chartCanvas.renderToBuffer({
                    type: "bar",
                    data: {
                        labels: Object.keys(monthCount),
                        datasets: [{
                            label: "Tasks Created",
                            data: Object.values(monthCount),
                            backgroundColor: "#3b82f6",
                            borderWidth: 1
                        }]
                    },
                    options: {
                        plugins: {
                            ...chartPlugins,
                            title: { display: true, text: "Monthly Task Creation" }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { stepSize: 1 }
                            }
                        }
                    }
                });

            }

        }
        catch (chartError) {
            console.log("Monthly Chart Error:", chartError);
        }


        // ==================================================
        // Build PDF
        // ==================================================

        const doc = new PDFDocument({
            margin: 50
        });


        // Stream the PDF straight to the response.
        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="user-data-export-${userId}.pdf"`
        );

        doc.pipe(res);


        // ---------------- Title ----------------

        doc
            .fontSize(20)
            .text("My Data Export", { align: "center" });

        doc.moveDown();

        doc
            .fontSize(9)
            .fillColor("gray")
            .text(
                `Generated on ${new Date().toLocaleString()}`,
                { align: "center" }
            );

        doc.fillColor("black");
        doc.moveDown(1.5);


        // ---------------- Profile Section ----------------

        doc.fontSize(14).text("Profile", { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(11);
        doc.text(`Name: ${user.name || "-"}`);
        doc.text(`Email: ${user.email || "-"}`);
        doc.text(`Role: ${user.role || "-"}`);
        doc.text(`Phone: ${user.phone || "-"}`);
        doc.text(`Address: ${user.address || "-"}`);

        doc.moveDown(1.5);


        // ---------------- Report / Charts Section ----------------

        doc.fontSize(14).text("Report", { underline: true });
        doc.moveDown(0.5);

        const chartWidth = 240;
        const chartHeight = 180;
        const leftX = doc.page.margins.left;
        const rightX = leftX + chartWidth + 20;

        const drawChartPair = (imgA, imgB) => {

            if (!imgA && !imgB) return;

            // Add a new page if there isn't enough room for this row.
            if (doc.y + chartHeight + 10 > doc.page.height - doc.page.margins.bottom) {
                doc.addPage();
            }

            const rowY = doc.y;

            if (imgA) {
                doc.image(imgA, leftX, rowY, { fit: [chartWidth, chartHeight] });
            }

            if (imgB) {
                doc.image(imgB, rightX, rowY, { fit: [chartWidth, chartHeight] });
            }

            doc.y = rowY + chartHeight + 15;

        };

        if (statusChartImage || priorityChartImage || completionChartImage || monthlyChartImage) {

            drawChartPair(statusChartImage, priorityChartImage);
            drawChartPair(completionChartImage, monthlyChartImage);

        }
        else {

            doc.fontSize(11).text("No chart data available.");
            doc.moveDown(1);

        }

        doc.moveDown(0.5);


        // ---------------- Tasks Section ----------------

        doc.fontSize(14).text("Tasks", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11);

        if (tasks.length === 0) {

            doc.text("No tasks found.");

        }
        else {

            tasks.forEach((task, index) => {

                doc.font("Helvetica-Bold").text(
                    `${index + 1}. ${task.title}`
                );

                doc.font("Helvetica");

                if (task.description) {
                    doc.text(`   Description: ${task.description}`);
                }

                doc.text(`   Priority: ${task.priority || "-"}`);
                doc.text(`   Status: ${task.status || "-"}`);

                doc.text(
                    `   Due Date: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}`
                );

                doc.text(
                    `   Created: ${new Date(task.created_at).toLocaleString()}`
                );

                doc.moveDown(0.5);

            });

        }

        doc.moveDown(1);


        // ---------------- Notifications Section ----------------

        doc.fontSize(14).text("Notifications", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11);

        if (notifications.length === 0) {

            doc.text("No notifications found.");

        }
        else {

            notifications.forEach((notification, index) => {

                doc.font("Helvetica-Bold").text(
                    `${index + 1}. ${notification.is_read ? "[Read]" : "[Unread]"}`
                );

                doc.font("Helvetica");

                doc.text(`   ${notification.message}`);

                doc.text(
                    `   Created: ${new Date(notification.created_at).toLocaleString()}`
                );

                doc.moveDown(0.5);

            });

        }


        doc.end();

    }
    catch (error) {

        console.log(
            "Export User Data Error:",
            error
        );

        // Only send a JSON error if headers haven't already
        // been sent (i.e. PDF streaming hasn't started yet).
        if (!res.headersSent) {

            res.status(500).json({

                message:
                    "Internal Server Error"

            });

        }
        else {

            res.end();

        }

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

    deleteNotification,

    markAllNotificationsRead,

    getUserProfile,

    updateUserProfile,

    changeUserPassword,

    deleteUserAccount,

    exportUserData

};
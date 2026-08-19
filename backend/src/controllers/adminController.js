const db = require("../config/db");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/sendEmail");

// ADDED: reuse the same thread-building helper and notification
// helper the user-side support flow already uses, so admin ticket
// replies/threads come out in the exact same shape.
const {
    attachThread
} = require("./supportController");

const {
    createUserNotification
} = require("./userController");

// ================= Dashboard =================
const getDashboardData = async (req, res) => {

    try {

        // Statistics
        const usersResult = await db.query(
            "SELECT COUNT(*) FROM users WHERE LOWER(role)='user'"
        );

        const tasksResult = await db.query(
            "SELECT COUNT(*) FROM tasks"
        );

        const completedResult = await db.query(
            "SELECT COUNT(*) FROM tasks WHERE LOWER(status)='completed'"
        );

        const pendingResult = await db.query(
            "SELECT COUNT(*) FROM tasks WHERE LOWER(status)='pending'"
        );

        // Monthly User Growth
        const growthResult = await db.query(`
            SELECT
                TO_CHAR(created_at,'Mon') AS month,
                COUNT(*)::INT AS users
            FROM users
            WHERE LOWER(role)='user'
            GROUP BY
                EXTRACT(MONTH FROM created_at),
                TO_CHAR(created_at,'Mon')
            ORDER BY
                EXTRACT(MONTH FROM created_at)
        `);

        // Latest Registered Users
        const recentUsers = await db.query(`
            SELECT
                id,
                name,
                created_at
            FROM users
            WHERE LOWER(role)='user'
            ORDER BY created_at DESC
            LIMIT 5
        `);

        // Latest Created Tasks
        const recentTasks = await db.query(`
            SELECT
                id,
                title,
                status,
                created_at
            FROM tasks
            ORDER BY created_at DESC
            LIMIT 5
        `);

        const activities = [];

        // Recent Users
        recentUsers.rows.forEach(user => {

            activities.push({

                id: user.id,

                entityType: "user",

                message: `${user.name} registered`,

                time: user.created_at

            });

        });

        // Recent Tasks
        recentTasks.rows.forEach(task => {

            activities.push({

                id: task.id,

                entityType: "task",

                message:
                    task.status.toLowerCase() === "completed"
                        ? `${task.title} completed`
                        : `${task.title} created`,

                time: task.created_at


            });

        });

        // Latest first
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.json({

            totalUsers: Number(usersResult.rows[0].count),

            totalTasks: Number(tasksResult.rows[0].count),

            completed: Number(completedResult.rows[0].count),

            pending: Number(pendingResult.rows[0].count),

            monthlyGrowth: growthResult.rows,

            recentActivities: activities

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ================= Dashboard Stats =================
const getDashboardStats = async (req, res) => {

    try {

        const usersResult = await db.query(
            "SELECT COUNT(*) FROM users WHERE LOWER(role)='user'"
        );

        const tasksResult = await db.query(
            "SELECT COUNT(*) FROM tasks"
        );

        const completedResult = await db.query(
            "SELECT COUNT(*) FROM tasks WHERE LOWER(status)='completed'"
        );

        const pendingResult = await db.query(
            "SELECT COUNT(*) FROM tasks WHERE LOWER(status)='pending'"
        );

        res.json({

            totalUsers: Number(usersResult.rows[0].count),

            totalTasks: Number(tasksResult.rows[0].count),

            completed: Number(completedResult.rows[0].count),

            pending: Number(pendingResult.rows[0].count)

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ================= Reports =================
const getReports = async (req, res) => {

    try {

        const users = await db.query(
            "SELECT COUNT(*) FROM users WHERE LOWER(role)='user'"
        );

        const tasks = await db.query(
            "SELECT COUNT(*) FROM tasks"
        );

        const completed = await db.query(
            "SELECT COUNT(*) FROM tasks WHERE LOWER(status)='completed'"
        );

        const pending = await db.query(
            "SELECT COUNT(*) FROM tasks WHERE LOWER(status)='pending'"
        );

        res.json({

            totalUsers: Number(users.rows[0].count),

            totalTasks: Number(tasks.rows[0].count),

            completedTasks: Number(completed.rows[0].count),

            pendingTasks: Number(pending.rows[0].count)

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ================= Users =================
const getAllUsers = async (req, res) => {

    try {

        const result = await db.query(`

            SELECT

                id,

                name,

                email,

                role,

                created_at,

                status

            FROM users

            WHERE LOWER(role)='user'

            ORDER BY id ASC

        `);

        res.json(result.rows);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ================= Tasks =================
const getAllTasks = async (req, res) => {

    try {

        const result = await db.query(`

            SELECT

                tasks.id,

                tasks.title,

                tasks.description,

                tasks.status,

                tasks.due_date,

                tasks.created_at,

                users.name AS username,

                users.email

            FROM tasks

            JOIN users

            ON tasks.user_id = users.id

            ORDER BY tasks.id ASC

        `);

        res.json(result.rows);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ================= Delete Task =================
const deleteTask = async (req, res) => {

    try {

        const { id } = req.params;

        await db.query(

            "DELETE FROM tasks WHERE id=$1",

            [id]

        );

        res.json({

            message: "Task deleted successfully"

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};
// ================= Update Task =================

const updateTask = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            description,
            status,
            due_date
        } = req.body;

        const result = await db.query(

            `
            UPDATE tasks

            SET
                title=$1,
                description=$2,
                status=$3,
                due_date=$4

            WHERE id=$5

            RETURNING *

            `,

            [
                title,
                description,
                status,
                due_date,
                id
            ]

        );

        res.json({

            message: "Task updated successfully",

            task: result.rows[0]

        });

    }
    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Server Error"

        });

    }

};

// ================= Block / Unblock =================
const updateUserStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;

        const result = await db.query(

            `

            UPDATE users

            SET status=$1

            WHERE id=$2

            RETURNING id,name,email,status

            `,

            [status, id]

        );

        res.json({

            message: "User status updated successfully",

            user: result.rows[0]

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};
// ================= Notifications =================

const getNotifications = async (req, res) => {

    try {

        const result = await db.query(`

            SELECT
                id,
                type,
                title,
                message,
                is_read,
                created_at

            FROM notifications

            ORDER BY created_at DESC

        `);


        res.json(result.rows);


    }
    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Server Error"

        });

    }

};
// ================= Navbar Counts =================

const getNotificationCounts = async (req, res) => {
    try {

        const users = await db.query(`
            SELECT COUNT(*)
            FROM users
            WHERE is_seen_by_admin = false
            AND LOWER(role)='user'
        `);

        const tasks = await db.query(`
            SELECT COUNT(*)
            FROM tasks
            WHERE is_seen_by_admin = false
        `);

        const notifications = await db.query(`
            SELECT COUNT(*)
            FROM notifications
            WHERE is_read = false
        `);

        // ADDED: badge count for the Support nav link.
        // Support tickets don't have an is_seen_by_admin column like
        // users/tasks do, so this counts still-open tickets instead
        // (status = 'submitted', i.e. not yet picked up). If you'd
        // rather match the is_seen_by_admin pattern exactly, that
        // needs a migration adding that column to support_tickets -
        // let me know and I'll switch this over.
        const support = await db.query(`
            SELECT COUNT(*)
            FROM support_tickets
            WHERE LOWER(status) = 'submitted'
        `);

        res.json({

            users: Number(users.rows[0].count),

            tasks: Number(tasks.rows[0].count),

            notifications: Number(notifications.rows[0].count),

            support: Number(support.rows[0].count)

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }
};

// ================= Delete User =================

const deleteUser = async(req,res)=>{


    try{


        const {id}=req.params;



        await db.query(

            "DELETE FROM users WHERE id=$1",

            [id]

        );



        res.json({

            message:"User deleted successfully"

        });



    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Server Error"

        });


    }


};
// ================= Mark Notifications Read =================

const markNotificationsRead = async(req,res)=>{

    try{


        await db.query(`

            UPDATE notifications

            SET is_read=true

            WHERE is_read=false

        `);



        res.json({

            message:"Notifications marked as read"

        });


    }

    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Server Error"

        });

    }

};

// ================= Delete Notification =================

const deleteNotification = async(req,res)=>{

    try{

        const {id}=req.params;


        await db.query(

            `
            DELETE FROM notifications
            WHERE id=$1
            `,

            [id]

        );


        res.json({

            message:"Notification deleted"

        });


    }
    catch(error){

        console.log(error);


        res.status(500).json({

            message:"Server Error"

        });

    }

};
   const markUsersSeen = async (req, res) => {
    try {

        await db.query(`
            UPDATE users
            SET is_seen_by_admin = true
            WHERE is_seen_by_admin = false
            AND LOWER(role)='user'
        `);

        res.json({
            message: "Users marked as seen"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};
const markTasksSeen = async (req, res) => {

    try {

        await db.query(`
            UPDATE tasks
            SET is_seen_by_admin = true
            WHERE is_seen_by_admin = false
        `);

        res.json({

            message: "Tasks marked as seen"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};
const getAdminProfile = async (req, res) => {
    try {

        const adminId = req.user.id; // From JWT middleware

        const result = await db.query(
            `SELECT id, name, email
             FROM users
             WHERE id = $1`,
            [adminId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};

// ================= Update Admin Profile =================

const updateAdminProfile = async (req, res) => {

    try {

        const adminId = req.user.id; // From JWT middleware

        const { name, email } = req.body;

        const result = await db.query(
            `
            UPDATE users
            SET name = $1,
                email = $2
            WHERE id = $3
            RETURNING id, name, email
            `,
            [name, email, adminId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        res.json({
            message: "Profile updated successfully",
            admin: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ================= System Settings =================

const getSystemSettings = async (req, res) => {

    try {

        const result = await db.query(
            `
            SELECT 
                allow_registration,
                maintenance_mode,
                updated_at
            FROM settings
            WHERE id=1
            `
        );


        res.json(result.rows[0]);


    } catch(error) {

        console.log(error);

        res.status(500).json({

            message:"Server Error"

        });

    }

};




// ================= Update System Settings =================

const updateSystemSettings = async (req,res)=>{

    try{

        const {
            allow_registration,
            maintenance_mode
        } = req.body;



        const result = await db.query(

            `
            UPDATE settings

            SET
            allow_registration=$1,
            maintenance_mode=$2,
            updated_at=NOW()

            WHERE id=1

            RETURNING *

            `,

            [
                allow_registration,
                maintenance_mode
            ]

        );


        res.json({

            message:"System settings updated successfully",

            settings:result.rows[0]

        });


    }
    catch(error){

        console.log(error);


        res.status(500).json({

            message:"Server Error"

        });

    }

};

// ================= Send OTP For Admin Change Password =================
// Uses req.user.id (from the JWT, verified by verifyToken + isAdmin) rather
// than trusting an email in the body - an admin can only ever request an
// OTP for their own account. The submitted email is just a UX confirmation.

const sendAdminChangePasswordOtp = async (req, res) => {

    try {

        const adminId = req.user.id;

        const { email } = req.body;

        const result = await db.query(
            "SELECT id, email FROM users WHERE id = $1",
            [adminId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        const admin = result.rows[0];

        if (email && email.toLowerCase() !== admin.email.toLowerCase()) {
            return res.status(400).json({
                message: "Email does not match your account."
            });
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true,
        });

        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await db.query(
            "UPDATE users SET otp=$1, otp_expiry=$2 WHERE id=$3",
            [otp, otpExpiry, adminId]
        );

        await sendEmail(
            admin.email,
            "Task Manager - Change Password OTP",
            `Your OTP is ${otp}. It is valid for 10 minutes.`
        );

        res.json({
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ================= Change Admin Password With OTP =================

const changeAdminPassword = async (req, res) => {

    try {

        const adminId = req.user.id;

        const { otp, newPassword } = req.body;

        if (!otp || !newPassword) {
            return res.status(400).json({
                message: "OTP and new password are required."
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters."
            });
        }

        const result = await db.query(
            "SELECT otp, otp_expiry FROM users WHERE id = $1",
            [adminId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        const admin = result.rows[0];

        if (!admin.otp || !admin.otp_expiry) {
            return res.status(400).json({
                message: "Please request a new OTP."
            });
        }

        if (admin.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (new Date() > new Date(admin.otp_expiry)) {
            return res.status(400).json({
                message: "OTP Expired"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query(
            "UPDATE users SET password=$1, otp=NULL, otp_expiry=NULL WHERE id=$2",
            [hashedPassword, adminId]
        );

        res.json({
            message: "Password changed successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ================= Support Tickets (Admin) =================

const getAllSupportTickets = async (req, res) => {

    try {

        const result = await db.query(`

            SELECT

                support_tickets.id,
                support_tickets.title,
                support_tickets.description,
                support_tickets.category,
                support_tickets.priority,
                support_tickets.status,
                support_tickets.created_at,
                support_tickets.updated_at,

                users.id AS user_id,
                users.name AS user_name,
                users.email AS user_email

            FROM support_tickets

            JOIN users
            ON support_tickets.user_id = users.id

            ORDER BY support_tickets.created_at DESC

        `);

        const ticketsWithThread = await Promise.all(

            result.rows.map(
                (ticket) => attachThread(ticket)
            )

        );

        res.json(ticketsWithThread);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};




const updateSupportTicket = async (req, res) => {

    try {

        const { id } = req.params;

        const { status, priority } = req.body;

        const existing = await db.query(
            "SELECT * FROM support_tickets WHERE id=$1",
            [id]
        );

        if (existing.rows.length === 0) {

            return res.status(404).json({

                message: "Ticket not found"

            });

        }

        const current = existing.rows[0];

        const result = await db.query(

            `
            UPDATE support_tickets

            SET
                status=$1,
                priority=$2,
                updated_at=NOW()

            WHERE id=$3

            RETURNING *
            `,

            [
                status || current.status,
                priority || current.priority,
                id
            ]

        );

        res.json({

            message: "Ticket updated successfully",

            ticket: result.rows[0]

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ----- Reply To Ticket (admin side) -----

const replySupportTicketAsAdmin = async (req, res) => {

    try {

        const ticketId = req.params.id;

        const { message } = req.body;

        if (!message || message.trim() === "") {

            return res.status(400).json({

                message: "Reply message cannot be empty."

            });

        }

        const ticketResult = await db.query(
            "SELECT * FROM support_tickets WHERE id=$1",
            [ticketId]
        );

        if (ticketResult.rows.length === 0) {

            return res.status(404).json({

                message: "Ticket not found"

            });

        }

        const ticket = ticketResult.rows[0];

        // Insert reply, tagged as coming from the admin
        await db.query(

            `
            INSERT INTO support_ticket_messages
            (
                ticket_id,
                sender_role,
                message,
                created_at
            )

            VALUES
            (
                $1,
                'admin',
                $2,
                NOW()
            )
            `,

            [
                ticketId,
                message
            ]

        );

        const updatedTicketResult = await db.query(

            `
            UPDATE support_tickets

            SET updated_at = NOW()

            WHERE id = $1

            RETURNING *
            `,

            [ticketId]

        );

        const ticketWithThread = await attachThread(
            updatedTicketResult.rows[0]
        );

        // Let the user know support replied
        await createUserNotification(

            ticket.user_id,

            `Support replied to your ticket "${ticket.title}"`

        );

        res.status(200).json({

            message: "Reply sent",

            ticket: ticketWithThread

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


module.exports = {

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

    deleteNotification,

    getAdminProfile,

    updateAdminProfile,

    markUsersSeen,

    markTasksSeen,

    deleteUser,

    getSystemSettings,

    updateSystemSettings,

    sendAdminChangePasswordOtp,

    changeAdminPassword,

    getAllSupportTickets,

    updateSupportTicket,

    replySupportTicketAsAdmin

};
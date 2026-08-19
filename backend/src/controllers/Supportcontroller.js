const db = require("../config/db");


// Notification function from UserController
const {
    createUserNotification
} = require("./userController");


// ======================================================
// Format A Time-Relative Label ("time" field on thread)
// ======================================================

const formatRelativeTime = (dateString) => {

    const messageDate = new Date(dateString);

    const now = new Date();

    const difference = Math.floor(
        (now - messageDate) / 1000
    );


    if (difference < 60) {

        return "Just now";

    }


    if (difference < 3600) {

        return `${Math.floor(difference / 60)} minutes ago`;

    }


    if (difference < 86400) {

        return `${Math.floor(difference / 3600)} hours ago`;

    }


    if (difference < 172800) {

        return "Yesterday";

    }


    return messageDate.toLocaleDateString("en-IN");

};


// ======================================================
// Attach Thread Messages To A Ticket
// ======================================================
// CHANGED: now exported (see bottom) so adminController.js can
// reuse this exact same thread-building logic instead of
// duplicating it - keeps the "thread"/"from"/"text"/"time" shape
// identical on both the user and admin side.

const attachThread = async (ticket) => {

    const messagesResult = await db.query(

        `
        SELECT
            sender_role,
            message,
            created_at

        FROM support_ticket_messages

        WHERE ticket_id = $1

        ORDER BY created_at ASC
        `,

        [ticket.id]

    );


    const thread = messagesResult.rows.map(

        (row) => ({

            from: row.sender_role,

            text: row.message,

            time: formatRelativeTime(row.created_at)

        })

    );


    return {

        ...ticket,

        thread: thread

    };

};


// ======================================================
// Get User Support Tickets
// ======================================================

const getUserSupportTickets = async (req, res) => {

    try {

        const userId = req.user.id;


        const result = await db.query(

            `
            SELECT
                id,
                title,
                description,
                category,
                priority,
                status,
                created_at,
                updated_at

            FROM support_tickets

            WHERE user_id = $1

            ORDER BY created_at DESC
            `,

            [userId]

        );


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

            message: error.message

        });

    }

};


// ======================================================
// Create Support Ticket
// ======================================================

const createSupportTicket = async (req, res) => {

    try {

        const userId = req.user.id;


        const {
            title,
            category,
            priority,
            description
        } = req.body;


        // ==================================================
        // Validate Title
        // ==================================================

        if (!title || title.trim() === "") {

            return res.status(400).json({

                message:
                    "Title is required."

            });

        }


        // ==================================================
        // Validate Description
        // ==================================================

        if (!description || description.trim() === "") {

            return res.status(400).json({

                message:
                    "Please describe what happened."

            });

        }


        const result = await db.query(

            `
            INSERT INTO support_tickets
            (
                user_id,
                title,
                description,
                category,
                priority,
                status,
                created_at,
                updated_at
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                'submitted',
                NOW(),
                NOW()
            )

            RETURNING *
            `,

            [
                userId,
                title,
                description,
                category,
                priority
            ]

        );


        const ticket = result.rows[0];


        // ==================================================
        // Notify User Their Complaint Was Received
        // ==================================================

        await createUserNotification(

            userId,

            `Your complaint "${ticket.title}" has been submitted`

        );


        res.status(201).json({

            message:
                "Complaint raised successfully",

            ticket: {
                ...ticket,
                thread: []
            }

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
// Reply To A Support Ticket (user side)
// ======================================================

const replySupportTicket = async (req, res) => {

    try {

        const userId = req.user.id;

        const ticketId = req.params.id;

        const { message } = req.body;


        if (!message || message.trim() === "") {

            return res.status(400).json({

                message:
                    "Reply message cannot be empty."

            });

        }


        // ==================================================
        // Confirm Ticket Belongs To This User
        // ==================================================

        const ticketResult = await db.query(

            `
            SELECT *

            FROM support_tickets

            WHERE id = $1
            AND user_id = $2
            `,

            [
                ticketId,
                userId
            ]

        );


        if (ticketResult.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Ticket not found"

            });

        }


        // ==================================================
        // Insert Reply
        // ==================================================

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
                'user',
                $2,
                NOW()
            )
            `,

            [
                ticketId,
                message
            ]

        );


        // ==================================================
        // Bump updated_at On The Ticket
        // ==================================================

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


        res.status(200).json({

            message:
                "Reply sent",

            ticket: ticketWithThread

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
// Export
// ======================================================

module.exports = {

    getUserSupportTickets,

    createSupportTicket,

    replySupportTicket,

    // CHANGED: exported so adminController.js can build the same
    // thread shape for the admin ticket view/reply endpoints.
    attachThread

};
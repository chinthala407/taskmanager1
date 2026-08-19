const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    getUserSupportTickets,
    createSupportTicket,
    replySupportTicket

} = require("../controllers/supportController");


// ================= Get User's Tickets =================

router.get(
    "/tickets",
    authMiddleware,
    getUserSupportTickets
);


// ================= Create Ticket =================

router.post(
    "/tickets",
    authMiddleware,
    createSupportTicket
);


// ================= Reply To Ticket =================

router.post(
    "/tickets/:id/reply",
    authMiddleware,
    replySupportTicket
);


module.exports = router;
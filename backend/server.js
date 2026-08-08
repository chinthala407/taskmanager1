require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Added
const taskRoutes=require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();


// Middleware
app.use(cors());

app.use(express.json());
app.use(
    "/api/tasks",
    taskRoutes
);


// Check database connection when server starts
db.query("SELECT NOW()")

  .then((result) => {

    console.log("✅ Database Connected");

    console.log(result.rows[0]);

  })

  .catch((err) => {

    console.error("❌ Database Connection Error:", err);

  });




// Home Route
app.get("/", (req, res) => {

  res.send("Task Manager Backend Running...");

});




// Database Status API
app.get("/api/status", async (req, res) => {

  try {

    await db.query("SELECT NOW()");

    res.json({

      success: true,

      message: "Database Connected",

    });


  } catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,

      message: "Database Not Connected",

    });

  }

});




// Authentication Routes
app.use("/api/auth", authRoutes);



// Admin Routes  (Added)
app.use("/api/admin", adminRoutes);

app.use("/api/notifications", notificationRoutes);
const userRoutes=require("./routes/userRoutes");


app.use(
    "/api/user",
    userRoutes
);

// Start Server
const PORT = process.env.PORT || 5000;


app.listen(PORT, async () => {

  console.log(`🚀 Server running on port ${PORT}`);


  try {

    const { default: open } = await import("open");

    await open(`http://localhost:${PORT}`);

  } catch (err) {

    console.log("Browser not opened automatically.");

  }

});
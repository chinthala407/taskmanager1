const db = require("../config/db");


// Dashboard Statistics
const getDashboardStats = async (req, res) => {

    try {

        const usersResult = await db.query(
            "SELECT COUNT(*) FROM users WHERE LOWER(role)='user'"
        );


        const tasksResult = await db.query(
            "SELECT COUNT(*) FROM tasks"
        );


        const completedTasksResult = await db.query(
            "SELECT COUNT(*) FROM tasks WHERE LOWER(status)='completed'"
        );


        const pendingTasksResult = await db.query(
            "SELECT COUNT(*) FROM tasks WHERE LOWER(status)='pending'"
        );


        res.json({

            totalUsers: Number(usersResult.rows[0].count),

            totalTasks: Number(tasksResult.rows[0].count),

            completedTasks: Number(completedTasksResult.rows[0].count),

            pendingTasks: Number(pendingTasksResult.rows[0].count)

        });


    } catch(error) {

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

};




// Reports Data
const getReports = async (req, res) => {

    try {

        const usersResult = await db.query(
            `
            SELECT COUNT(*) 
            FROM users 
            WHERE LOWER(role)='user'
            `
        );


        const tasksResult = await db.query(
            `
            SELECT COUNT(*) 
            FROM tasks
            `
        );


        const completedTasksResult = await db.query(
            `
            SELECT COUNT(*) 
            FROM tasks
            WHERE LOWER(status)='completed'
            `
        );


        const pendingTasksResult = await db.query(
            `
            SELECT COUNT(*) 
            FROM tasks
            WHERE LOWER(status)='pending'
            `
        );


        res.json({

            totalUsers:Number(usersResult.rows[0].count),

            totalTasks:Number(tasksResult.rows[0].count),

            completedTasks:Number(completedTasksResult.rows[0].count),

            pendingTasks:Number(pendingTasksResult.rows[0].count)

        });


    } catch(error) {


        console.log(error);


        res.status(500).json({

            message:"Server Error"

        });


    }

};





// Get All Users
const getAllUsers = async (req, res) => {

    try {

        const result = await db.query(
            `
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
            `
        );


        res.json(result.rows);


    } catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

};





// Get All Tasks with User Details
const getAllTasks = async (req, res) => {

    try {

        const result = await db.query(
            `
            SELECT 

                tasks.id,

                tasks.title,

                tasks.description,

                tasks.status,

                users.name AS username,

                users.email

            FROM tasks

            JOIN users

            ON tasks.user_id = users.id

            ORDER BY tasks.id ASC

            `
        );


        res.json(result.rows);


    } catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

};





// Delete Task
const deleteTask = async (req, res) => {

    try {

        const { id } = req.params;


        await db.query(
            "DELETE FROM tasks WHERE id=$1",
            [id]
        );


        res.json({

            message:"Task deleted successfully"

        });


    } catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

};





// Block / Unblock User
const updateUserStatus = async (req,res)=>{

    try{

        const { id } = req.params;

        const { status } = req.body;


        const result = await db.query(
            `
            UPDATE users

            SET status=$1

            WHERE id=$2

            RETURNING id,name,email,status

            `,
            [status,id]
        );


        res.json({

            message:"User status updated successfully",

            user:result.rows[0]

        });


    }
    catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

};






module.exports = {

    getDashboardStats,

    getReports,

    getAllUsers,

    getAllTasks,

    deleteTask,

    updateUserStatus

};
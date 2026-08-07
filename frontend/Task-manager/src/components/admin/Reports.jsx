import { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

import "./Reports.css";


function Reports() {


    const [reports, setReports] = useState({

        totalUsers:0,
        totalTasks:0,
        completedTasks:0,
        pendingTasks:0

    });



    useEffect(()=>{


        axios
        .get("http://localhost:5000/api/admin/reports")
        .then((response)=>{

            setReports(response.data);

        })
        .catch((error)=>{

            console.log(error);

        });


    },[]);



    const barData = [

        {
            name:"Users",
            count:reports.totalUsers
        },

        {
            name:"Tasks",
            count:reports.totalTasks
        },

        {
            name:"Completed",
            count:reports.completedTasks
        },

        {
            name:"Pending",
            count:reports.pendingTasks
        }

    ];



    const pieData = [

        {
            name:"Completed",
            value:reports.completedTasks
        },

        {
            name:"Pending",
            value:reports.pendingTasks
        }

    ];



    return (

        <div className="reports">


            <div className="reports-header">

                <h1>Reports</h1>

                <p>
                    Analyze your Task Manager performance.
                </p>

            </div>




            <div className="reports-cards">


                <div className="report-card">

                    <h3>Total Users</h3>

                    <h2>{reports.totalUsers}</h2>

                </div>



                <div className="report-card">

                    <h3>Total Tasks</h3>

                    <h2>{reports.totalTasks}</h2>

                </div>



                <div className="report-card">

                    <h3>Completed Tasks</h3>

                    <h2>{reports.completedTasks}</h2>

                </div>



                <div className="report-card">

                    <h3>Pending Tasks</h3>

                    <h2>{reports.pendingTasks}</h2>

                </div>


            </div>





            <div className="charts-container">


                <div className="chart-box">

                    <h2>User & Task Overview</h2>


                    <ResponsiveContainer width="100%" height={350}>

                        <BarChart data={barData}>


                            <CartesianGrid strokeDasharray="3 3"/>

                            <XAxis dataKey="name"/>

                            <YAxis/>

                            <Tooltip/>


                            <Bar 
                                dataKey="count"
                                fill="#2563eb"
                            />


                        </BarChart>


                    </ResponsiveContainer>


                </div>





                <div className="chart-box">


                    <h2>Task Status</h2>


                    <ResponsiveContainer width="100%" height={380}>
    <PieChart
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    >
        <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="65%"
            labelLine={false}
            label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
            }
        >
            <Cell fill="#22c55e" />
            <Cell fill="#ef4444" />
        </Pie>

        <Tooltip />
        <Legend
            verticalAlign="bottom"
            align="center"
        />
    </PieChart>
</ResponsiveContainer>


                </div>



            </div>



        </div>

    );

}


export default Reports;
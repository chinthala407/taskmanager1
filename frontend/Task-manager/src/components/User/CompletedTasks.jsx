import { useState } from "react";
import { FaEye, FaTrash, FaCheckCircle } from "react-icons/fa";
import "./CompletedTasks.css";


function CompletedTasks() {

    const [search, setSearch] = useState("");


    const completedTasks = [
        {
            id:1,
            title:"Build User Dashboard",
            description:"Complete dashboard UI design",
            priority:"High",
            completedDate:"05 Aug 2026"
        },
        {
            id:2,
            title:"Backend API Integration",
            description:"Connect frontend with backend",
            priority:"Medium",
            completedDate:"03 Aug 2026"
        },
        {
            id:3,
            title:"Database Testing",
            description:"Test PostgreSQL database",
            priority:"Low",
            completedDate:"01 Aug 2026"
        }
    ];


    const filteredTasks = completedTasks.filter((task)=>
        task.title.toLowerCase()
        .includes(search.toLowerCase())
    );


    return (

        <div className="completed-container">


            <div className="completed-header">

                <div>

                    <h1>
                        Completed Tasks
                    </h1>

                    <p>
                        View your completed tasks
                    </p>

                </div>


                <div className="completed-count">

                    <FaCheckCircle/>

                    <span>
                        {completedTasks.length} Completed
                    </span>

                </div>


            </div>



            <div className="completed-toolbar">

                <input

                    type="text"

                    placeholder="Search completed tasks..."

                    value={search}

                    onChange={(e)=>setSearch(e.target.value)}

                />

            </div>




            <table className="completed-table">


                <thead>

                    <tr>

                        <th>Task</th>

                        <th>Description</th>

                        <th>Priority</th>

                        <th>Completed Date</th>

                        <th>Actions</th>

                    </tr>

                </thead>



                <tbody>

                    {
                        filteredTasks.map((task)=>(

                            <tr key={task.id}>

                                <td>
                                    {task.title}
                                </td>


                                <td>
                                    {task.description}
                                </td>


                                <td>

                                    <span className={
                                        `priority ${task.priority.toLowerCase()}`
                                    }>

                                        {task.priority}

                                    </span>

                                </td>


                                <td>
                                    {task.completedDate}
                                </td>


                                <td>

                                    <button className="view-btn">
                                        <FaEye/>
                                    </button>


                                    <button className="delete-btn">
                                        <FaTrash/>
                                    </button>

                                </td>


                            </tr>

                        ))
                    }


                </tbody>


            </table>


        </div>

    );

}


export default CompletedTasks;
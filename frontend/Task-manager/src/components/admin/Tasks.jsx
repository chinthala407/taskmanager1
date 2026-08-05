import { useEffect, useState } from "react";
import axios from "axios";
import "./Tasks.css";

function Tasks() {

    const [tasks,setTasks] = useState([]);
    const [search,setSearch] = useState("");
    const [filter,setFilter] = useState("all");
    const [selectedTask,setSelectedTask] = useState(null);

    const fetchTasks = () => {

        axios
        .get("http://localhost:5000/api/admin/tasks")
        .then((response)=>{
            setTasks(response.data);
        })
        .catch((error)=>{
            console.log(error);
        });

    };


    useEffect(()=>{
        fetchTasks();
    },[]);



    const handleDelete = (id)=>{

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if(confirmDelete){

            axios
            .delete(`http://localhost:5000/api/admin/tasks/${id}`)
            .then(()=>{

                setTasks(
                    tasks.filter(
                        (task)=>task.id !== id
                    )
                );

            })
            .catch((error)=>{
                console.log(error);
            });

        }

    };



    const completed = tasks.filter(
        (task)=>task.status?.toLowerCase()==="completed"
    ).length;


    const pending = tasks.filter(
        (task)=>task.status?.toLowerCase()==="pending"
    ).length;



    const filteredTasks = tasks.filter((task)=>{

        const searchMatch =
        task.title?.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase()) ||
        task.username?.toLowerCase().includes(search.toLowerCase());


        const filterMatch =
        filter==="all" ||
        task.status?.toLowerCase()===filter;


        return searchMatch && filterMatch;

    });
    const handleView = (task)=>{

    setSelectedTask(task);

};


    return(

        <div className="tasks-page">

            <h1>Task Management</h1>


            <div className="task-stats">

                <div className="task-box">
                    <h3>Total Tasks</h3>
                    <h2>{tasks.length}</h2>
                </div>


                <div className="task-box completed-box">
                    <h3>Completed</h3>
                    <h2>{completed}</h2>
                </div>


                <div className="task-box pending-box">
                    <h3>Pending</h3>
                    <h2>{pending}</h2>
                </div>

            </div>



            <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                className="task-search"
            />



            <div className="filter-buttons">

                <button onClick={()=>setFilter("all")}>
                    All
                </button>

                <button onClick={()=>setFilter("completed")}>
                    Completed
                </button>

                <button onClick={()=>setFilter("pending")}>
                    Pending
                </button>

            </div>



            <div className="tasks-table">

                <table>

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th>Actions</th>
                        </tr>

                    </thead>


                    <tbody>

                    {
                        filteredTasks.length > 0 ?

                        filteredTasks.map((task)=>(

                            <tr key={task.id}>

                                <td>{task.id}</td>

                                <td>{task.title}</td>

                                <td>{task.description}</td>


                                <td>
                                    <span className={`status ${task.status?.toLowerCase()}`}>
                                        {task.status}
                                    </span>
                                </td>


                                <td>
                                    <strong>{task.username}</strong>
                                    <br/>
                                    <small>{task.email}</small>
                                </td>


                                <td>

                                    <div className="action-btns">

                                        <button
                                        className="view-btn"
                                            onClick={()=>handleView(task)}
                                        >
                                            View
                                        </button>


                                        <button
                                            className="delete-btn"
                                            onClick={()=>handleDelete(task.id)}
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                        :

                        <tr>
                            <td colSpan="6">
                                No tasks found
                            </td>
                        </tr>

                    }

                    </tbody>

                </table>

            </div>
{
selectedTask && (

<div className="modal-overlay">


    <div className="task-modal">


        <h2>
            Task Details
        </h2>


        <p>
            <strong>Title:</strong>
            <br/>
            {selectedTask.title}
        </p>


        <p>
            <strong>Description:</strong>
            <br/>
            {selectedTask.description}
        </p>


        <p>
            <strong>Created By:</strong>
            <br/>
            {selectedTask.username}
        </p>


        <p>
            <strong>Email:</strong>
            <br/>
            {selectedTask.email}
        </p>


        <p>
            <strong>Status:</strong>
            <br/>
            {selectedTask.status}
        </p>



        <button
            className="close-btn"
            onClick={()=>setSelectedTask(null)}
        >
            Close
        </button>


    </div>


</div>

)
}
        </div>

    );

}

export default Tasks;
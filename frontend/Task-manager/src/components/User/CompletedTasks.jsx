import { useEffect, useState } from "react";
import axios from "axios";

import {
    FaEye,
    FaTrash
} from "react-icons/fa";

import "./CompletedTasks.css";


function CompletedTasks(){


    const [tasks,setCompletedTasks] = useState([]);

    const [search,setSearch] = useState("");

    const [selectedTask,setSelectedTask] = useState(null);



    const token = localStorage.getItem("token");



    // ================= Fetch Completed Tasks =================


    const fetchCompletedTasks = async()=>{

        try{

            const response = await axios.get(
                "http://localhost:5000/api/tasks/completed",
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );


            setCompletedTasks(response.data);


        }
        catch(error){

            console.log(error);

        }

    };




    useEffect(()=>{

        fetchCompletedTasks();

    },[]);




    // ================= Search =================


    const filteredTasks = tasks.filter(task=>

        task.title
        .toLowerCase()
        .includes(
            search.toLowerCase()
        )

    );





    // ================= Delete =================


    const deleteTask = async(id)=>{


        try{


            await axios.delete(

                `http://localhost:5000/api/tasks/${id}`,

                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }

            );


            fetchCompletedTasks();


        }
        catch(error){

            console.log(error);

        }


    };





    // ================= View Task =================


    const viewTask = (task)=>{

        setSelectedTask(task);

    };





    return(

        <div className="completed-container">


            <h2>

                {tasks.length} Completed Tasks

            </h2>





            <input

                type="text"

                placeholder="Search completed tasks..."

                value={search}

                onChange={
                    e=>setSearch(e.target.value)
                }

                className="search-input"

            />






            {

                filteredTasks.length === 0

                ?

                (

                    <p>
                        No completed tasks
                    </p>

                )


                :


                (

                filteredTasks.map(task=>(


                    <div
                    className="completed-card"
                    key={task.id}
                    >



                        <div className="task-info">


                            <h3>
                                {task.title}
                            </h3>



                            <p>
                                {task.description}
                            </p>



                            <span
                            className={
                                `priority ${task.priority.toLowerCase()}`
                            }
                            >

                                {task.priority}

                            </span>




                            <p>

                                Completed on:

                                {" "}

                                {
                                new Date(
                                    task.updated_at
                                )
                                .toLocaleDateString("en-IN")
                                }

                            </p>



                        </div>





                        <div className="task-actions">


                            <button

                            className="view-btn"

                            onClick={
                                ()=>viewTask(task)
                            }

                            >

                                <FaEye/>

                            </button>





                            <button

                            className="delete-btn"

                            onClick={
                                ()=>deleteTask(task.id)
                            }

                            >

                                <FaTrash/>

                            </button>



                        </div>



                    </div>


                ))

                )

            }







            {/* ================= Task Details Modal ================= */}



            {

            selectedTask &&


            (

                <div className="task-modal-overlay">



                    <div className="task-modal">



                        <h2>
                            Task Details
                        </h2>




                        <h3>
                            {selectedTask.title}
                        </h3>




                        <p>

                            <b>Description:</b>

                            <br/>

                            {selectedTask.description}

                        </p>





                        <p>

                            <b>Priority:</b>

                            {" "}

                            {selectedTask.priority}

                        </p>





                        <p>

                            <b>Status:</b>

                            {" "}

                            {selectedTask.status}

                        </p>





                        <p>

                            <b>Completed Date:</b>

                            {" "}

                            {

                            new Date(
                                selectedTask.updated_at
                            )
                            .toLocaleDateString("en-IN")

                            }

                        </p>





                        <button

                        className="close-btn"

                        onClick={
                            ()=>setSelectedTask(null)
                        }

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


export default CompletedTasks;
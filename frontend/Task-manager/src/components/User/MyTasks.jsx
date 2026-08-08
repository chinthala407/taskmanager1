import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaCheck
} from "react-icons/fa";

import CreateTaskModal from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";

import "./MyTasks.css";



function MyTasks() {


const [tasks,setTasks]=useState([]);

const [search,setSearch]=useState("");

const [filter,setFilter]=useState("all");

const [isModalOpen,setIsModalOpen]=useState(false);

const [editOpen,setEditOpen]=useState(false);

const [selectedTask,setSelectedTask]=useState(null);

const [selectedDate,setSelectedDate]=useState(null);



const token = localStorage.getItem("token");




// ================= Fetch Tasks =================


const fetchTasks = useCallback(async()=>{


try{


const response = await axios.get(

"http://localhost:5000/api/tasks/user",

{

headers:{

Authorization:`Bearer ${token}`

}

}

);



setTasks(response.data);



}

catch(error){

console.log(
"Fetch task error",
error
);

}



},[token]);





useEffect(()=>{


fetchTasks();


},[fetchTasks]);








// ================= Delete Task =================


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



fetchTasks();



}

catch(error){

console.log(error);

}


};








// ================= Complete Task =================


const completeTask = async(id)=>{


try{


await axios.patch(

`http://localhost:5000/api/tasks/${id}/status`,

{},

{

headers:{

Authorization:`Bearer ${token}`

}

}

);



fetchTasks();



}

catch(error){

console.log(error);

}


};







// ================= Search Filter =================


const filteredTasks = tasks.filter(task=>{


const searchMatch =

task.title
.toLowerCase()
.includes(
search.toLowerCase()
);



const filterMatch =

filter==="all" ||

task.status
.toLowerCase()
===filter;



return searchMatch && filterMatch;


});









// ================= Calendar =================


const calendarDays = Array.from(

{length:31},

(_,i)=>i+1

);



const getTasksForDay=(day)=>{


return tasks.filter(task=>{


const date=new Date(
task.due_date
);


return date.getDate()===day;


});


};


    return (


        <div className="mytasks-container">






            {/* Header */}


            <div className="mytasks-header">


                <h2>
                    My Tasks
                </h2>



                <button

                    className="create-btn"

                    onClick={()=>setIsModalOpen(true)}

                >


                    <FaPlus/>


                    Create Task


                </button>



            </div>









            {/* Search Filter */}



            <div className="task-toolbar">



                <input

                    type="text"

                    placeholder="Search Task..."

                    value={search}

                    onChange={
                        e=>setSearch(e.target.value)
                    }

                />





                <select

                    value={filter}

                    onChange={
                        e=>setFilter(e.target.value)
                    }

                >


                    <option value="all">
                        All
                    </option>


                    <option value="pending">
                        Pending
                    </option>



                    <option value="in progress">
                        In Progress
                    </option>



                    <option value="completed">
                        Completed
                    </option>



                </select>



            </div>









            {/* Task Table */}



            <table className="task-table">


                <thead>


                    <tr>


                        <th>
                            Title
                        </th>


                        <th>
                            Priority
                        </th>


                        <th>
                            Due Date
                        </th>


                        <th>
                            Status
                        </th>


                        <th>
                            Actions
                        </th>


                    </tr>


                </thead>







                <tbody>


                {

                filteredTasks.map(task=>(


                    <tr key={task.id}>


                        <td>
                            {task.title}
                        </td>



                        <td>


                            <span

                            className={
                                task.priority
                                .toLowerCase()
                            }

                            >

                                {task.priority}

                            </span>


                        </td>




                        <td>

                            {task.due_date}

                        </td>




                        <td>

                            {task.status}

                        </td>




                        <td>



                            <button

                            className="action-btn edit"

                            onClick={()=>{


                                setSelectedTask(task);

                                setEditOpen(true);


                            }}

                            >

                                <FaEdit/>


                            </button>







                            <button

                            className="action-btn delete"

                            onClick={()=>deleteTask(task.id)}

                            >

                                <FaTrash/>


                            </button>







                            <button

                            className="action-btn complete"

                            onClick={()=>completeTask(task.id)}

                            >

                                <FaCheck/>


                            </button>




                        </td>




                    </tr>


                ))


                }


                </tbody>



            </table>









            {/* Calendar */}



            <div className="task-calendar-wrapper">


                <h2>
                    Task Calendar
                </h2>




                <div className="task-calendar">


                {


                calendarDays.map(day=>(


                    <div

                    key={day}

                    className={

                    getTasksForDay(day).length

                    ?

                    "calendar-day has-task"

                    :

                    "calendar-day"

                    }


                    onClick={()=>setSelectedDate(day)}

                    >



                    <h3>
                        {day} Aug
                    </h3>





                    {

                    getTasksForDay(day)

                    .map(task=>(


                        <div

                        key={task.id}

                        className="calendar-task"

                        >

                            {task.title}


                        </div>


                    ))


                    }



                    </div>



                ))



                }


                </div>








                {

                selectedDate &&


                <div className="selected-date-tasks">


                    <h3>

                        Tasks on {selectedDate} Aug

                    </h3>



                    {

                    getTasksForDay(selectedDate)

                    .map(task=>(


                        <p key={task.id}>

                            {task.title}
                            -
                            {task.status}

                        </p>


                    ))


                    }


                </div>


                }



            </div>









            {/* Create Modal */}



            {

            isModalOpen &&


            <CreateTaskModal


            isOpen={isModalOpen}


            onClose={()=>
                setIsModalOpen(false)
            }


            onSubmit={()=>{


                fetchTasks();

                setIsModalOpen(false);


            }}


            />

            }









            {/* Edit Modal */}



            {

            editOpen &&


            <EditTaskModal


            task={selectedTask}


            isOpen={editOpen}


            onClose={()=>
                setEditOpen(false)
            }


            refresh={fetchTasks}


            />

            }



        </div>


    );


}


export default MyTasks;
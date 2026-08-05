import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import CreateTaskModal from "./CreateTaskModal";
import "./MyTasks.css";


function MyTasks() {


    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("all");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState(null);



    const [tasks] = useState([

        {
            id: 1,
            title: "Complete React UI",
            priority: "High",
            dueDate: "10 Aug 2026",
            status: "Pending"
        },

        {
            id: 2,
            title: "Connect Backend",
            priority: "Medium",
            dueDate: "12 Aug 2026",
            status: "Completed"
        },

        {
            id: 3,
            title: "Database Testing",
            priority: "Low",
            dueDate: "15 Aug 2026",
            status: "Pending"
        }

    ]);





    const days = Array.from(
        { length: 31 },
        (_, index) => index + 1
    );





    const getTasksForDay = (day) => {


        return tasks.filter((task)=>{


            return task.dueDate.startsWith(day + " ");


        });


    };






    const filteredTasks = tasks.filter((task) => {


        const matchesSearch = task.title

            .toLowerCase()

            .includes(search.toLowerCase());



        const matchesFilter =

            filter === "all" ||

            task.status.toLowerCase() === filter;



        return matchesSearch && matchesFilter;


    });







    const handleCreateTask = (taskData) => {


        console.log(taskData);


        setIsModalOpen(false);


    };






    return (


        <div className="mytasks-container">





            <div className="mytasks-header">


                <h2>
                    My Tasks
                </h2>



                <button

                    className="create-btn"

                    onClick={() => setIsModalOpen(true)}

                >

                    <FaPlus />

                    Create Task

                </button>



            </div>








            <div className="task-toolbar">



                <input

                    type="text"

                    placeholder="Search Task..."

                    value={search}

                    onChange={(e)=>setSearch(e.target.value)}

                />




                <select

                    value={filter}

                    onChange={(e)=>setFilter(e.target.value)}

                >

                    <option value="all">
                        All
                    </option>


                    <option value="pending">
                        Pending
                    </option>


                    <option value="completed">
                        Completed
                    </option>


                </select>


            </div>








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
                        filteredTasks.map((task)=>(


                            <tr key={task.id}>


                                <td>
                                    {task.title}
                                </td>




                                <td>

                                    <span className={task.priority.toLowerCase()}>

                                        {task.priority}

                                    </span>

                                </td>




                                <td>

                                    {task.dueDate}

                                </td>




                                <td>

                                    {task.status}

                                </td>





                                <td>


                                    <button className="action-btn edit">

                                        <FaEdit />

                                    </button>



                                    <button className="action-btn delete">

                                        <FaTrash />

                                    </button>



                                    <button className="action-btn complete">

                                        <FaCheck />

                                    </button>



                                </td>


                            </tr>


                        ))

                    }


                </tbody>


            </table>









            {/* Task Calendar */}


            <div className="task-calendar-wrapper">


                <h2>
                    Task Calendar
                </h2>




                <div className="task-calendar-scroll">


                    <div className="task-calendar">


                        {

                            days.map((day)=>(


                                <div

                                    key={day}

                                    className={

                                        getTasksForDay(day).length > 0

                                        ? "calendar-day has-task"

                                        : "calendar-day"

                                    }


                                    onClick={()=>setSelectedDate(day)}

                                >


                                    <h3>
                                        {day} Aug
                                    </h3>



                                    {


                                        getTasksForDay(day).map((task)=>(


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


                </div>








                {

                    selectedDate && (


                        <div className="selected-date-tasks">


                            <h3>

                                Tasks on {selectedDate} Aug 2026

                            </h3>



                            {

                                getTasksForDay(selectedDate).length > 0 ?



                                getTasksForDay(selectedDate).map((task)=>(


                                    <p key={task.id}>

                                        {task.title} - {task.status}

                                    </p>


                                ))



                                :


                                <p>
                                    No tasks
                                </p>


                            }


                        </div>


                    )

                }





            </div>







            <CreateTaskModal

                isOpen={isModalOpen}

                onClose={()=>setIsModalOpen(false)}

                onSubmit={handleCreateTask}

            />



        </div>


    );

}


export default MyTasks;
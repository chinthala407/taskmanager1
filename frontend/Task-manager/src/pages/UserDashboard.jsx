import { useState } from "react";
import { FaPlus } from "react-icons/fa";

import CreateTaskModal from "../components/user/CreateTaskModal";
import "./UserDashboard.css";


function UserDashboard() {


    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleCreateTask = (taskData) => {

        console.log(taskData);

        // Backend API will be connected here later

        setIsModalOpen(false);

    };


    return (

        <div className="user-dashboard">


            <div className="dashboard-header">

                <div>

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Manage your tasks efficiently
                    </p>

                </div>



                <button
                    className="create-btn"
                    onClick={() => setIsModalOpen(true)}
                >

                    <FaPlus />

                    Create Task

                </button>


            </div>





            <div className="stats-container">


                <div className="user-stat-card">

                    <h3>Total Tasks</h3>

                    <h2>25</h2>

                    <p>
                        All tasks
                    </p>

                </div>



                <div className="user-stat-card">

                    <h3>Completed</h3>

                    <h2>15</h2>

                    <p>
                        Finished tasks
                    </p>

                </div>



                <div className="user-stat-card">

                    <h3>Pending</h3>

                    <h2>10</h2>

                    <p>
                        Remaining tasks
                    </p>

                </div>



                <div className="user-stat-card">

                    <h3>In Progress</h3>

                    <h2>5</h2>

                    <p>
                        Active tasks
                    </p>

                </div>


            </div>





            <div className="recent-task-section">


                <div className="section-header">

                    <h2>
                        Recent Tasks
                    </h2>


                    <button>
                        View All
                    </button>


                </div>




                <div className="task-list">


                    <div className="task-card">


                        <h3>
                            Build Dashboard UI
                        </h3>


                        <p>
                            Complete user dashboard design
                        </p>


                        <span className="pending">
                            Pending
                        </span>


                    </div>





                    <div className="task-card">


                        <h3>
                            API Integration
                        </h3>


                        <p>
                            Connect frontend with backend
                        </p>


                        <span className="completed">
                            Completed
                        </span>


                    </div>


                </div>


            </div>





            {isModalOpen && (

                <CreateTaskModal

                    isOpen={isModalOpen}

                    onClose={() => setIsModalOpen(false)}

                    onSubmit={handleCreateTask}

                />

            )}



        </div>

    );

}


export default UserDashboard;
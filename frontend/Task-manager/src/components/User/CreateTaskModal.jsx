import { useState } from "react";
import axios from "axios";
import "./CreateTaskModal.css";

function CreateTaskModal({ isOpen, onClose, onTaskCreated }) {

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [priority,setPriority] = useState("Medium");
    const [dueDate,setDueDate] = useState("");


    if(!isOpen) return null;


    const handleSubmit = async(e)=>{

        e.preventDefault();


        try{

            const token = localStorage.getItem("token");


            const response = await axios.post(

                "http://localhost:5000/api/tasks",

                {
                    title,
                    description,
                    priority,
                    dueDate
                },

                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }

            );


            console.log(response.data);


            alert("Task created successfully");


            if(onTaskCreated){
                onTaskCreated(response.data.task);
            }


            setTitle("");
            setDescription("");
            setPriority("Medium");
            setDueDate("");


            onClose();


        }
        catch(error){

            console.log(
                error.response?.data || error.message
            );

            alert("Task creation failed");

        }

    };



    return (

        <div 
            className="modal-overlay"
            onClick={onClose}
        >


            <div 
                className="modal"
                onClick={(e)=>e.stopPropagation()}
            >


                <div className="modal-header">

                    <h2>
                        Create New Task
                    </h2>


                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>



                <form onSubmit={handleSubmit}>


                    <div className="form-group">

                        <label>
                            Task Title
                        </label>


                        <input

                            type="text"

                            placeholder="Enter task title"

                            value={title}

                            onChange={(e)=>setTitle(e.target.value)}

                            required

                        />

                    </div>



                    <div className="form-group">

                        <label>
                            Description
                        </label>


                        <textarea

                            rows="4"

                            placeholder="Enter description"

                            value={description}

                            onChange={(e)=>setDescription(e.target.value)}

                        />

                    </div>



                    <div className="form-group">

                        <label>
                            Priority
                        </label>


                        <select

                            value={priority}

                            onChange={(e)=>setPriority(e.target.value)}

                        >

                            <option>
                                High
                            </option>

                            <option>
                                Medium
                            </option>

                            <option>
                                Low
                            </option>


                        </select>


                    </div>



                    <div className="form-group">

                        <label>
                            Due Date
                        </label>


                        <input

                            type="date"

                            value={dueDate}

                            onChange={(e)=>setDueDate(e.target.value)}

                        />

                    </div>



                    <div className="modal-buttons">

    <button
        type="button"
        className="cancel-btn"
        onClick={onClose}
    >
        Cancel
    </button>


    <button
        type="submit"
        className="save-btn"
    >
        Create Task
    </button>

</div>


                </form>


            </div>


        </div>

    );

}


export default CreateTaskModal;
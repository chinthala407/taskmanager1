import { useState } from "react";
import "./CreateTaskModal.css";

function CreateTaskModal({ isOpen, onClose, onSubmit }) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");


    if (!isOpen) return null;


    const handleSubmit = (e) => {

        e.preventDefault();


        const taskData = {
            title,
            description,
            priority,
            dueDate
        };


        onSubmit(taskData);


        setTitle("");
        setDescription("");
        setPriority("Medium");
        setDueDate("");

        onClose();

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

                            <option value="High">
                                High
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="Low">
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
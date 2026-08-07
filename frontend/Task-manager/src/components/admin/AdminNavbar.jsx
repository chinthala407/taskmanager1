import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import taskIcon from "../../assets/task-check-icon.png";
import "./AdminNavbar.css";


function AdminNavbar(){


    const navigate = useNavigate();


    const [admin,setAdmin] = useState({

        name:"",
        role:""

    });





    useEffect(()=>{


        const loadAdminProfile = async()=>{


            try{


                const response = await axios.get(

                    "http://localhost:5000/api/admin/profile"

                );


                setAdmin(response.data);


            }

            catch(error){


                console.log(error);


            }


        };



        loadAdminProfile();



    },[]);








    const handleLogout = ()=>{


        localStorage.removeItem("token");

        localStorage.removeItem("user");


        navigate("/");


    };









    return(


        <header className="admin-navbar">



            <div className="navbar-left">


                <div className="brand">


                    <img

                        src={taskIcon}

                        alt="Task Manager"

                    />



                    <h2>


                        <span className="task-text">

                            Task

                        </span>



                        <span className="manager-text">

                            Manager

                        </span>



                    </h2>



                </div>



            </div>








            <div className="navbar-right">





                <div className="profile">


                    <h4>

                        {

                            admin.name || "Administrator"

                        }

                    </h4>



                    <p>

                        {

                            admin.role || "Admin"

                        }

                    </p>


                </div>







                <button

                    className="logout-btn"

                    onClick={handleLogout}

                >

                    Logout


                </button>





            </div>





        </header>


    );


}


export default AdminNavbar;
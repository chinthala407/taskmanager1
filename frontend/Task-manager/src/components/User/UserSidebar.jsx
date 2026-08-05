import { NavLink } from "react-router-dom";
import "../admin/AdminSidebar.css";


function UserSidebar() {


    return (


        <aside className="admin-sidebar">


            <nav className="sidebar-menu">



                <NavLink
                    to="/user"
                    end
                    className="sidebar-link"
                >
                    Dashboard
                </NavLink>




                <NavLink
                    to="/user/tasks"
                    className="sidebar-link"
                >
                    My Tasks
                </NavLink>





                <NavLink
                    to="/user/completed"
                    className="sidebar-link"
                >
                    Completed
                </NavLink>





                <NavLink
                    to="/user/reports"
                    className="sidebar-link"
                >
                    Reports
                </NavLink>

                <NavLink
                    to="/user/notifications"
                    className="sidebar-link"
                >
                Notifications
                </NavLink>



                <NavLink
                    to="/user/profile"
                    className="sidebar-link"
                >
                    Profile
                </NavLink>





                <NavLink
                    to="/user/settings"
                    className="sidebar-link"
                >
                    Settings
                </NavLink>




            </nav>


        </aside>


    );


}


export default UserSidebar;
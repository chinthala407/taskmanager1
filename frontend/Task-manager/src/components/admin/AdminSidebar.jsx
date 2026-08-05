import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";


function AdminSidebar(){

    return(

        <aside className="admin-sidebar">


            <nav className="sidebar-menu">


                <NavLink 
                    to="/admin"
                    end 
                    className="sidebar-link"

                >
                    Dashboard
                </NavLink>



                <NavLink 
                    to="/admin/users"
                    className="sidebar-link"
                >
                    Users
                </NavLink>



                <NavLink 
                    to="/admin/tasks"
                    className="sidebar-link"
                >
                    Tasks
                </NavLink>



                <NavLink 
                    to="/admin/reports"
                    className="sidebar-link"
                >
                    Reports
                </NavLink>



                <NavLink 
                    to="/admin/notifications"
                    className="sidebar-link"
                >
                    Notifications
                </NavLink>



                <NavLink 
                    to="/admin/settings"
                    className="sidebar-link"
                >
                    Settings
                </NavLink>


                


            </nav>


        </aside>

    );

}


export default AdminSidebar;
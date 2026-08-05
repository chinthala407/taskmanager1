import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">

      <div className="sidebar-top">

        <NavLink to="/admin" end className="menu-item">
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className="menu-item">
          Users
        </NavLink>

        <NavLink to="/admin/tasks" className="menu-item">
          Tasks
        </NavLink>

        <NavLink to="/admin/reports" className="menu-item">
          Reports
        </NavLink>

        <NavLink to="/admin/notifications" className="menu-item">
          Notifications
        </NavLink>

        <NavLink to="/admin/settings" className="menu-item">
          Settings
        </NavLink>

      </div>

    </aside>
  );
}

export default AdminSidebar;
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminSidebar.css";

function AdminSidebar() {

  const [counts, setCounts] = useState({
    users: 0,
    tasks: 0,
    notifications: 0
  });

  useEffect(() => {

    const fetchCounts = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/admin/notification-counts"
        );

        setCounts({
          users: res.data.users || 0,
          tasks: res.data.tasks || 0,
          notifications: res.data.notifications || 0
        });

      } catch (error) {

        console.error(error);

      }

    };

    fetchCounts();

    const interval = setInterval(fetchCounts, 5000);

    return () => clearInterval(interval);

  }, []);

  return (

    <aside className="admin-sidebar">

      <div className="sidebar-top">

        <NavLink to="/admin" end className="menu-item">
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className="menu-item">
          <span>Users</span>

          {counts.users > 0 && (
            <span className="sidebar-badge">
              {counts.users}
            </span>
          )}
        </NavLink>

        <NavLink to="/admin/tasks" className="menu-item">
          <span>Tasks</span>

          {counts.tasks > 0 && (
            <span className="sidebar-badge">
              {counts.tasks}
            </span>
          )}
        </NavLink>

        <NavLink to="/admin/reports" className="menu-item">
          Reports
        </NavLink>

        <NavLink to="/admin/notifications" className="menu-item">
          <span>Notifications</span>

          {counts.notifications > 0 && (
            <span className="sidebar-badge">
              {counts.notifications}
            </span>
          )}
        </NavLink>

        <NavLink to="/admin/settings" className="menu-item">
          Settings
        </NavLink>

      </div>

    </aside>

  );

}

export default AdminSidebar;
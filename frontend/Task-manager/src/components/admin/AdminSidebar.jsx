import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminSidebar.css";

function AdminSidebar({ isOpen, onLinkClick, onLogout }) {

  const [counts, setCounts] = useState({
    users: 0,
    tasks: 0,
    notifications: 0,
    support: 0
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
          notifications: res.data.notifications || 0,
          support: res.data.support || 0
        });

      } catch (error) {

        console.error(error);

      }

    };

    fetchCounts();

    const interval = setInterval(fetchCounts, 3000);

    return () => clearInterval(interval);

  }, []);

  return (

    <aside className={`admin-sidebar ${isOpen ? "mobile-open" : ""}`}>

      <div className="sidebar-top">

        <NavLink to="/admin" end className="menu-item" onClick={onLinkClick}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className="menu-item" onClick={onLinkClick}>
          <span>Users</span>

          {counts.users > 0 && (
            <span className="sidebar-badge">
              {counts.users}
            </span>
          )}
        </NavLink>

        <NavLink to="/admin/tasks" className="menu-item" onClick={onLinkClick}>
          <span>Tasks</span>

          {counts.tasks > 0 && (
            <span className="sidebar-badge">
              {counts.tasks}
            </span>
          )}
        </NavLink>

        <NavLink to="/admin/reports" className="menu-item" onClick={onLinkClick}>
          Reports
        </NavLink>

        <NavLink to="/admin/notifications" className="menu-item" onClick={onLinkClick}>
          <span>Notifications</span>

          {counts.notifications > 0 && (
            <span className="sidebar-badge">
              {counts.notifications}
            </span>
          )}
        </NavLink>

        <NavLink to="/admin/settings" className="menu-item" onClick={onLinkClick}>
          Settings
        </NavLink>

        <NavLink to="/admin/support" className="menu-item" onClick={onLinkClick}>
          <span>Support</span>

          {counts.support > 0 && (
            <span className="sidebar-badge">
              {counts.support}
            </span>
          )}
        </NavLink>

      </div>

      {/* Only visible on mobile widths — desktop keeps logout in the navbar */}
      <button
        className="sidebar-logout-btn"
        onClick={onLogout}
      >
        Logout
      </button>

    </aside>

  );

}

export default AdminSidebar;

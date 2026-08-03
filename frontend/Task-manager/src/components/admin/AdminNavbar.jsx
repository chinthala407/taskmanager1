import taskIcon from "../../assets/task-check-icon.png";

function AdminNavbar() {
  return (
    <nav className="admin-navbar">

      <div className="brand">

        <img 
          src={taskIcon}
          alt="Task Manager Logo"
        />

        <h2>
          <span className="task-text">Task</span>
          <span className="manager-text">Manager</span>
          <span className="admin-text"> Admin</span>
        </h2>

      </div>


      <button>
        Logout
      </button>

    </nav>
  );
}

export default AdminNavbar;
import { 
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaUserCog,
  FaChartBar
} from "react-icons/fa";

import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import StatCard from "../components/admin/StatCard";

import "./AdminDashboard.css";


function AdminDashboard(){

  return(

    <div className="admin-layout">

      <AdminNavbar/>


      <div className="admin-body">


        <AdminSidebar/>


        <main className="admin-main">


          <div className="welcome-card">

            <h1>
              Welcome Back, Admin 👋
            </h1>

            <p>
              Manage users, tasks and monitor your application.
            </p>

          </div>



          <div className="stats-container">


            <StatCard
              title="Total Users"
              value="120"
              icon={<FaUsers/>}
              color="blue"
            />


            <StatCard
              title="Total Tasks"
              value="350"
              icon={<FaTasks/>}
              color="purple"
            />


            <StatCard
              title="Completed"
              value="240"
              icon={<FaCheckCircle/>}
              color="green"
            />


            <StatCard
              title="Pending"
              value="110"
              icon={<FaClock/>}
              color="orange"
            />


          </div>



          <div className="dashboard-grid">


            <div className="activity-card">

              <h2>
                Recent Activity
              </h2>


              <p>
                ✔ New user registered
              </p>

              <p>
                ✔ Task completed
              </p>

              <p>
                ✔ Admin updated settings
              </p>


            </div>



            <div className="quick-card">

              <h2>
                Quick Actions
              </h2>


              <button>
                <FaUserCog/>
                Manage Users
              </button>


              <button>
                <FaChartBar/>
                View Reports
              </button>


            </div>


          </div>


        </main>


      </div>


    </div>

  )

}


export default AdminDashboard;
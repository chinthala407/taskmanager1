import {
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaUserCog,
  FaChartBar
} from "react-icons/fa";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import StatCard from "../components/admin/StatCard";

import "./AdminDashboard.css";


function AdminDashboard() {


  const navigate = useNavigate();


  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completed: 0,
    pending: 0
  });



  const userGrowth = [

    {
      month:"January",
      users:20
    },

    {
      month:"February",
      users:35
    },

    {
      month:"March",
      users:50
    },

    {
      month:"April",
      users:70
    },

    {
      month:"May",
      users:90
    },

    {
      month:"June",
      users:120
    }

  ];
  



  useEffect(() => {

    axios
      .get("http://localhost:5000/api/admin/stats")
      .then((response) => {

        setStats(response.data);

      })
      .catch((error) => {

        console.log(error);

      });

  }, []);



  return (

    <>


      {/* Welcome Banner */}

      <div className="welcome-card">

        <h1>
          Welcome Back, Admin
        </h1>


        <p>
          Manage users, tasks and monitor your application.
        </p>


      </div>




      {/* Statistics */}


      <div className="stats-container">


        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers />}
          color="blue"
        />


        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={<FaTasks />}
          color="purple"
        />


        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<FaCheckCircle />}
          color="green"
        />


        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<FaClock />}
          color="orange"
        />


      </div>





      {/* Monthly User Growth */}


      <div className="growth-card">


        <h2>
          Monthly User Growth
        </h2>



        <div className="growth-list">


          {
            userGrowth.map((item)=>(


              <div 
                className="growth-row"
                key={item.month}
              >


                <span>
                  {item.month}
                </span>



                <div className="growth-progress">


                  <div
                    className="growth-fill"
                    style={{
                      width:`${item.users}px`
                    }}
                  >


                  </div>


                </div>



                <strong>
                  {item.users}
                </strong>



              </div>


            ))
          }



        </div>


      </div>





      {/* Bottom Section */}


      <div className="dashboard-grid">


        <div className="activity-card">


          <h2>
            Recent Activity
          </h2>


          <p>
            New user registered
          </p>


          <p>
            Task completed
          </p>


          <p>
            Admin updated settings
          </p>


        </div>





        <div className="quick-card">


          <h2>
            Quick Actions
          </h2>



          <button onClick={() => navigate("/admin/users")}>

            <FaUserCog />

            Manage Users

          </button>




          <button onClick={() => navigate("/admin/reports")}>

            <FaChartBar />

            View Reports

          </button>



        </div>



      </div>



    </>

  );

}


export default AdminDashboard;
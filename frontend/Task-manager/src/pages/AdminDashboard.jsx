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

  const [userGrowth, setUserGrowth] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {

  const fetchDashboard = () => {

    axios
      .get("http://localhost:5000/api/admin/dashboard")

      .then((response) => {

        setStats({

          totalUsers: response.data.totalUsers,

          totalTasks: response.data.totalTasks,

          completed: response.data.completed,

          pending: response.data.pending

        });

        setUserGrowth(response.data.monthlyGrowth);

        setRecentActivities(response.data.recentActivities);

      })

      .catch((error) => {

        console.log(error);

      });

  };

  // Load immediately
  fetchDashboard();

  // Refresh every 5 seconds
  const interval = setInterval(fetchDashboard, 5000);

  // Cleanup
  return () => clearInterval(interval);

}, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (

    <>

      {/* Welcome Banner */}

      <div className="welcome-card">

        <h1>Welcome Back, Admin</h1>

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

        <h2>Monthly User Growth</h2>

        <div className="growth-list">

          {userGrowth.map((item) => (

            <div
              className="growth-row"
              key={item.month}
            >

              <span>{item.month}</span>

              <div className="growth-progress">

                <div
                  className="growth-fill"
                  style={{
                    width: `${item.users * 25}px`
                  }}
                />

              </div>

              <strong>{item.users}</strong>

            </div>

          ))}

        </div>

      </div>


      {/* Bottom Section */}

      <div className="dashboard-grid">

        {/* Recent Activity */}

        <div className="activity-card">

          <h2>Recent Activity</h2>

          {

            recentActivities.length === 0 ? (

              <p>No Recent Activity</p>

            ) : (

              recentActivities.map((activity, index) => (

                <div
                  key={index}
                  className="activity-row"
                >

                  <p className="activity-message">
                    {activity.message}
                  </p>

                  <small className="activity-time">
                    {formatDate(activity.time)}
                  </small>

                </div>

              ))

            )

          }

        </div>


        {/* Quick Actions */}

        <div className="quick-card">

          <h2>Quick Actions</h2>

          <button
            onClick={() => navigate("/admin/users")}
          >

            <FaUserCog />

            Manage Users

          </button>

          <button
            onClick={() => navigate("/admin/reports")}
          >

            <FaChartBar />

            View Reports

          </button>

        </div>

      </div>

    </>

  );

}

export default AdminDashboard;
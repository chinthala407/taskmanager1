import {
  FaTachometerAlt,
  FaUsers,
  FaTasks,
  FaChartBar,
  FaCog
} from "react-icons/fa";

import "./AdminSidebar.css";


function AdminSidebar() {

  return (

    <aside className="admin-sidebar">

      <ul>

          <li className="active">
              <FaTachometerAlt color="#2563eb"/>
              <span>Dashboard</span>
           </li>


          <li>
              <FaUsers color="#16a34a"/>
              <span>Users</span>
          </li>


          <li>
              <FaTasks color="#f59e0b"/>
              <span>Tasks</span>
          </li>


          <li>
              <FaChartBar color="#7c3aed"/>
              <span>Reports</span>
          </li>


          <li>
              <FaCog color="#64748b"/>
              <span>Settings</span>
          </li>


      </ul>

    </aside>

  );

}


export default AdminSidebar;
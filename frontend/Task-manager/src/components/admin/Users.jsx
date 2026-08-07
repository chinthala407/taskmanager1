import { useEffect, useState } from "react";
import axios from "axios";
import "./Users.css";


function Users(){


const [users,setUsers] = useState([]);

const [search,setSearch] = useState("");





useEffect(() => {

    const fetchUsers = async () => {

        try {

            // Mark all new users as seen
            await axios.put(
                "http://localhost:5000/api/admin/users/seen"
            );

            // Get users
            const response = await axios.get(
                "http://localhost:5000/api/admin/users"
            );

            setUsers(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    fetchUsers();

}, []);







// Block / Unblock User

const handleStatus = async(id,status)=>{


    try{


        const newStatus =

        status === "active"

        ?

        "blocked"

        :

        "active";




        await axios.put(

            `http://localhost:5000/api/admin/users/${id}/status`,

            {
                status:newStatus
            }

        );




        setUsers(

            users.map((user)=>

                user.id === id

                ?

                {
                    ...user,
                    status:newStatus
                }

                :

                user

            )

        );



    }

    catch(error){


        console.log(error);


    }


};







// Delete User

const handleDelete = async(id)=>{


    const confirmDelete = window.confirm(

        "Are you sure you want to delete this user?"

    );



    if(!confirmDelete)
        return;




    try{


        await axios.delete(

            `http://localhost:5000/api/admin/users/${id}`

        );




        setUsers(

            users.filter(

                (user)=>user.id !== id

            )

        );



        alert("User deleted successfully");


    }

    catch(error){


        console.log(error);


    }


};








return(



<div className="users-page">



<h1>
Users Management
</h1>







<div className="users-table">





<input

type="text"

placeholder="Search users..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="search-box"

/>







<table>



<thead>



<tr>


<th>ID</th>

<th>Name</th>

<th>Email</th>

<th>Role</th>

<th>Created Date</th>

<th>Status</th>

<th>Actions</th>


</tr>



</thead>








<tbody>



{

users

.filter((user)=>

user.name
?.toLowerCase()
.includes(search.toLowerCase())

||

user.email
?.toLowerCase()
.includes(search.toLowerCase())

)

.map((user)=>(



<tr key={user.id}>



<td>

{user.id}

</td>





<td>

{user.name}

</td>





<td>

{user.email}

</td>





<td>

{user.role}

</td>





<td>


{

user.created_at

?

new Date(user.created_at)
.toLocaleDateString()

:

"N/A"

}


</td>







<td>


<span

className={

user.status==="active"

?

"active-status"

:

"blocked-status"

}

>


{

user.status || "active"

}


</span>



</td>








<td>



<button

className="status-btn"

onClick={()=>handleStatus(user.id,user.status)}

>


{

user.status==="active"

?

"Block"

:

"Unblock"

}


</button>





<button

className="delete-user-btn"

onClick={()=>handleDelete(user.id)}

>


Delete


</button>





</td>






</tr>



))



}





</tbody>





</table>





</div>





</div>



)


}


export default Users;
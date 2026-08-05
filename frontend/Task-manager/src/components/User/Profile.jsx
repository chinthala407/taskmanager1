import { useState } from "react";
import "./Profile.css";


function Profile() {


    const [user, setUser] = useState(() => {

        const data = localStorage.getItem("user");

        return data ? JSON.parse(data) : null;

    });



    const [name, setName] = useState(user?.name || "");


    const [phone, setPhone] = useState(
        user?.phone || ""
    );


    const [address, setAddress] = useState(
        user?.address || ""
    );



    const [profileImage, setProfileImage] = useState(

        user?.profile_image ||

        "https://images.unsplash.com/photo-1444464666168-49d633b86797"

    );





    if (!user) {

        return (

            <div className="profile-loading">

                User Not Found

            </div>

        );

    }





    // Image Upload Function

    const handleImageUpload = (e) => {


        const file = e.target.files[0];


        if(file){


            const reader = new FileReader();



            reader.onload = () => {


                setProfileImage(reader.result);


            };



            reader.readAsDataURL(file);


        }


    };







    // Update Profile

    const updateProfile = () => {



        const updatedUser = {


            ...user,


            name:name,


            phone:phone,


            address:address,


            profile_image:profileImage


        };




        setUser(updatedUser);




        localStorage.setItem(

            "user",

            JSON.stringify(updatedUser)

        );




        alert("Profile Updated Successfully");


    };






    return (



        <div className="profile-page">



            <div className="profile-card">





                {/* Header */}



                <div className="profile-header">



                    <img

                        src={profileImage}

                        alt="Profile"

                        className="profile-image"

                    />




                    <h2>

                        {name}

                    </h2>





                    <p>

                        {user.email}

                    </p>




                    <span>

                        {user.role}

                    </span>



                </div>







                {/* Form */}



                <div className="profile-details">





                    <h3>

                        Edit Profile

                    </h3>







                    <label>

                        Name

                    </label>


                    <input


                        type="text"


                        value={name}


                        onChange={(e)=>setName(e.target.value)}


                    />







                    <label>

                        Phone Number

                    </label>



                    <input


                        type="text"


                        placeholder="Enter phone number"


                        value={phone}


                        onChange={(e)=>setPhone(e.target.value)}


                    />








                    <label>

                        Address

                    </label>




                    <textarea


                        placeholder="Enter address"


                        value={address}


                        onChange={(e)=>setAddress(e.target.value)}


                    />








                    <label>

                        Upload Profile Picture

                    </label>




                    <input


                        type="file"


                        accept="image/*"


                        onChange={handleImageUpload}


                    />








                    <button onClick={updateProfile}>


                        Update Profile


                    </button>





                </div>





            </div>




        </div>


    );

}


export default Profile;
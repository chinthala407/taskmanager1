import { useEffect, useState } from "react";
import axios from "axios";

import "./Profile.css";


function Profile() {

    const token = localStorage.getItem("token");


    const [user, setUser] = useState(null);


    const [name, setName] = useState("");

    const [phone, setPhone] = useState("");

    const [address, setAddress] = useState("");


    const [profileImage, setProfileImage] = useState(
        "https://images.unsplash.com/photo-1444464666168-49d633b86797"
    );


    const [loading, setLoading] = useState(true);



    // ======================================================
    // Get Profile From Database
    // ======================================================

    const fetchProfile = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/user/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = response.data;


            setUser(data);

            setName(data.name || "");

            setPhone(data.phone || "");

            setAddress(data.address || "");


            // Keep profile image from localStorage

            const storedUser =
                localStorage.getItem("user");


            if (storedUser) {

                const localUser =
                    JSON.parse(storedUser);


                if (localUser.profile_image) {

                    setProfileImage(
                        localUser.profile_image
                    );

                }

            }

        }
        catch (error) {

            console.log(
                "Profile fetch error:",
                error
            );

        }
        finally {

            setLoading(false);

        }

    };



    // ======================================================
    // Load Profile
    // ======================================================

    useEffect(() => {

        fetchProfile();

    }, []);



    // ======================================================
    // Image Upload
    // ======================================================

    const handleImageUpload = (e) => {

        const file = e.target.files[0];


        if (file) {

            const reader = new FileReader();


            reader.onload = () => {

                setProfileImage(
                    reader.result
                );

            };


            reader.readAsDataURL(file);

        }

    };



    // ======================================================
    // Update Profile
    // ======================================================

    const updateProfile = async () => {

        try {

            const response = await axios.put(

                "http://localhost:5000/api/user/profile",

                {
                    name,
                    phone,
                    address
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            const updatedUser =
                response.data.user;


            // Update React state

            setUser(updatedUser);


            setName(updatedUser.name || "");

            setPhone(updatedUser.phone || "");

            setAddress(updatedUser.address || "");



            // Keep existing localStorage user
            // and update the database fields

            const storedUser =
                localStorage.getItem("user");


            const localUser = storedUser
                ? JSON.parse(storedUser)
                : {};


            const updatedLocalUser = {

                ...localUser,

                ...updatedUser,

                profile_image: profileImage

            };


            localStorage.setItem(

                "user",

                JSON.stringify(
                    updatedLocalUser
                )

            );


            alert(
                "Profile Updated Successfully"
            );

        }
        catch (error) {

            console.log(
                "Profile update error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        }

    };



    // ======================================================
    // Loading
    // ======================================================

    if (loading) {

        return (

            <div className="profile-loading">

                Loading Profile...

            </div>

        );

    }



    // ======================================================
    // User Not Found
    // ======================================================

    if (!user) {

        return (

            <div className="profile-loading">

                User Not Found

            </div>

        );

    }



    // ======================================================
    // UI
    // ======================================================

    return (

        <div className="profile-page">


            <div className="profile-card">


                {/* ================= Header ================= */}

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



                {/* ================= Form ================= */}

                <div className="profile-details">


                    <h3>
                        Edit Profile
                    </h3>



                    {/* Name */}

                    <label>
                        Name
                    </label>


                    <input
                        type="text"
                        value={name}
                        onChange={
                            (e) =>
                                setName(
                                    e.target.value
                                )
                        }
                    />



                    {/* Phone */}

                    <label>
                        Phone Number
                    </label>


                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={
                            (e) =>
                                setPhone(
                                    e.target.value
                                )
                        }
                    />



                    {/* Address */}

                    <label>
                        Address
                    </label>


                    <textarea
                        placeholder="Enter address"
                        value={address}
                        onChange={
                            (e) =>
                                setAddress(
                                    e.target.value
                                )
                        }
                    />



                    {/* Profile Picture */}

                    <label>
                        Upload Profile Picture
                    </label>


                    <input
                        type="file"
                        accept="image/*"
                        onChange={
                            handleImageUpload
                        }
                    />



                    {/* Save */}

                    <button
                        onClick={updateProfile}
                    >
                        Save Changes
                    </button>


                </div>


            </div>


        </div>

    );

}


export default Profile;
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      setMessage(res.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
      });

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Registration Failed"
      );
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <h1>Task Manager</h1>
        <h2>Register</h2>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Register
          </button>

        </form>

        {message && (
          <p>{message}</p>
        )}

        <p>
          Already have an account?
          <Link to="/"> Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
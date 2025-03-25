import { useState } from "react";
import axios from "axios";
import "../Register/Register.css";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [role, setRole] = useState("user"); // Default role
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    adminSecret: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle role selection
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setFormData({ ...formData, adminSecret: "" }); // Reset admin secret field
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      username: formData.username,
      password: formData.password,
      role,
    };

    // Include admin secret key if role is admin and it's provided
    if (role === "admin" && formData.adminSecret.trim() !== "") {
      requestData.adminSecret = formData.adminSecret;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/register", requestData);
      alert(response.data.message);
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>

        {/* Role Selection */}
        <div className="role-selection">
          <button className={role === "user" ? "active" : ""} onClick={() => handleRoleChange("user")}>
            User
          </button>
          <button className={role === "admin" ? "active" : ""} onClick={() => handleRoleChange("admin")}>
            Admin
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Show Admin Secret Field Only for Admins */}
          {role === "admin" && (
            <input
              type="text"
              name="adminSecret"
              placeholder="Enter secret key (if required)"
              value={formData.adminSecret}
              onChange={handleChange}
            />
          )}

          <button type="submit">Register</button>

          <p>
            Already have an account? <Link id="lo-link" to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

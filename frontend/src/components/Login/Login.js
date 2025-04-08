import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Used for navigation

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:3000/auth/login", formData);
      const { token, username, role } = response.data;

      // Store token and username in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      // Redirect to the correct dashboard and pass username
      if (role === "admin") {
        navigate("/admin-dashboard", { state: { username } });
      } else {
        navigate("/user-dashboard", { state: { username } });
      }
    } catch (error) {
      setError(error.response?.data?.error || "Login failed. Please check credentials.");
    }
  };

  return (
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}

          {/* Login Form */}
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

            <button type="submit">Login</button>

            <p id='login-p'>
              Need to create an account? <Link id='re-link' to="/register">Register</Link>
            </p>

          </form>
        </div>
      </div>
  );
};

export default Login;

import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.css";
import logo from "../../assets/logo.png";

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
    setError("");

    try {
      const response = await axios.post(
          "http://localhost:3000/api/auth/login",
          formData,
          { withCredentials: true }
      );
      const { username, role } = response.data;

      localStorage.setItem("username", username);
      const newExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour expiry
      localStorage.setItem("exp", newExp.toString());

      console.log("Login Success:", username, role);

      if (role === "admin") {
        navigate("/admin-dashboard", { state: { username } });
      } else {
        navigate("/user-dashboard", { state: { username } });
      }

    } catch (error) {
      alert(error.response?.data?.error || "Login failed. Please check credentials.");
    }
  };

  return (
      <div className="login-container">
        <div className="login-box">
          <h2>
            <img src={logo} alt="logo" style={{ height: '40px' }} />
            <br />
            Login
          </h2>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Email"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            <button type="submit" className="login-btn">Sign in</button>

            <p className="bottom-text">
              Don’t have an account? <Link to="/register">Register</Link> free
            </p>
          </form>
        </div>
      </div>
  );

};

export default Login;

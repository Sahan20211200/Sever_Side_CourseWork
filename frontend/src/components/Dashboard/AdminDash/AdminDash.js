import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Dashboard/AdminDash/AdminDash.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [unusedApiKeys, setUnusedApiKeys] = useState([]);
  const [apiKeyOwners, setApiKeyOwners] = useState([]);
  const navigate = useNavigate();
  const adminUsername = localStorage.getItem("username") || "Admin";

  useEffect(() => {
    fetchUsers();
    fetchUnusedApiKeys();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredUsers = response.data.filter(user => user.username !== adminUsername);
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchUnusedApiKeys = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/admin/unused-api-keys", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUnusedApiKeys(response.data);
      if (response.data.length > 0) {
        fetchApiKeyOwners(response.data);
      }
    } catch (error) {
      console.error("Error fetching unused API keys:", error);
    }
  };

  const fetchApiKeyOwners = async (unusedKeys) => {
    if (unusedKeys.length === 0) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3000/admin/api-key-owners", 
        { apiKeys: unusedKeys.map(key => key.api_key) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApiKeyOwners(response.data);
    } catch (error) {
      console.error("Error fetching API key owners:", error);
    }
  };

  const revokeApiKey = async (userid) => {
    if (!window.confirm("Are you sure you want to revoke this API key?")) return;
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/admin/api-key/${userid}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        alert("API Key Revoked!");

        // Remove the revoked key from state
        setUnusedApiKeys((prevKeys) => prevKeys.filter(key => key.user_id !== userid));

    } catch (error) {
        console.error("Error revoking API key:", error);
    }
};

  const getRandomColor = () => {
    const colors = ["#FF5733", "#33FF57", "#5733FF", "#FFC300", "#33FFF3", "#F333FF"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <header className="admin-header">
        <h2>ADMIN DASHBOARD</h2>
        <button className="logout-btn" onClick={() => navigate("/login")}>Logout</button>
      </header>

      {/* Tiles Section */}
      <div className="tiles-container">
        <div className="tile"><span>{users.length}</span>TOTAL USERS</div>
        <div className="tile"><span>{unusedApiKeys.length}</span>API KEYS NOT USED</div>
        <div className="tile"><span>{apiKeyOwners.length}</span>RISKY API OWNERS</div>
      </div>

      <div className="dashboard-content">
        {/* Left Panel - User List */}
        <div className="left-panel">
          <h4>ALL USERS</h4>
          <table className="a-user-table">
            <thead>
              <tr><th>User</th><th>Last Logged In</th><th>API Keys</th></tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="a-user-profile">
                    <div className="a-profile-circle" style={{ backgroundColor: getRandomColor() }}>
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    {user.username}
                  </td>
                  <td>{user.last_logged_date || "Never Logged In"}</td>
                  <td>{user.api_key_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Panel - Risky API Alerts */}
        <div className="right-panel">
          <div className="api-alerts">
            <h4> RISKY API KEYS</h4>
            {unusedApiKeys.length > 0 ? (
              <table>
                <thead>
                  <tr><th>API Key</th><th>Created</th><th>Last Used</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {unusedApiKeys.map((key, index) => (
                    <tr key={index}>
                      <td>************{key.api_key.slice(-4)}</td>
                      <td>{key.created_date}</td>
                      <td>{key.last_used_date || "Never Used"}</td>
                      <td><button className="revoke-btn" onClick={() => revokeApiKey(key.user_id)}>Revoke</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No Risky API Keys Found.</p>}
          </div>

          <div className="api-owners">
            <h4>RISKY API OWNERS</h4>
            {apiKeyOwners.length > 0 ? (
              <table>
                <thead>
                  <tr><th>Username</th><th>Risky APIs</th><th>Search Count</th></tr>
                </thead>
                <tbody>
                  {apiKeyOwners.map((owner, index) => (
                    <tr key={index}>
                      <td>{owner.username}</td>
                      <td>{owner.risky_api_count}</td>
                      <td>{owner.search_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No Risky API Owners.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

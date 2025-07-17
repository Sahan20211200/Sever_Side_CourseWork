import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserDash/UserDash.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const UserDashboard = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [selectedApiKey, setSelectedApiKey] = useState(null);
  const [country, setCountry] = useState("");
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Fetch user's available API keys
  const fetchApiKeys = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/get-api-keys", {
        withCredentials: true
      });

      if (response.data.apiKeys.length > 0) {
        setApiKeys(response.data.apiKeys);
      } else {
        console.log("No API keys found for this user.");
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    }
  };

  // Fetch Country Data
  const fetchCountryData = async () => {
    if (!selectedApiKey) {
      toast.error("Please select an API key first.");
      return;
    }
    if (!country) {
      toast.warning("Enter a country name.");
      return;
    }


    setMessage("");
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/countries/${country}`, {
        headers: {
          "x-api-key": selectedApiKey 
        },
        withCredentials: true
      });

      setCountryData(response.data);
    } catch (error) {
      alert("Country not found or API issue.");
    }
    setLoading(false);
  };

  // Generate a new API key
  const generateApiKey = async () => {
    setLoading(true);
    try {

      const response = await axios.post("http://localhost:3000/api/auth/generate-api-key", {}, {
        withCredentials: true
      });

      if (response.data.apiKey) {
        setApiKeys([...apiKeys, { api_key: response.data.apiKey, created_at: new Date().toISOString() }]);
      }
      alert("New API Key generated!");
    } catch (error) {
      alert("Error generating API key");
    }
    setLoading(false);
  };

  // Delete API key
  const deleteApiKey = async (apikey) => {
    try {

      await axios.delete(`http://localhost:3000/api/auth/delete-api-key/${apikey}`, {
        withCredentials: true
      });
      setApiKeys(apiKeys.filter((key) => key.api_key !== apikey));
      alert("API Key deleted successfully!");
    } catch (error) {
      alert("Error deleting API key");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Admin Dashboard Header */}
      <header className="user-header">
        <h2>USER DASHBOARD</h2>
        <button className="u-logout-btn" onClick={() => navigate("/login")}>Logout</button>
      </header>

      <div className="sub-dash">
        <div className="u-left-panel">
          {/* User Profile Section */}
          <div className="u-user-profile">
            <div className="u-profile-circle">{username.slice(0, 2).toUpperCase()}</div>
            <h3>{username}</h3>
          </div>

          {/* API Keys Table */}
          <div className="u-api-key-table">
            <h4>CREATED API KEYS</h4>
            {apiKeys.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>API Key</th>
                    <th>Created Date and Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key, index) => (
                    <tr key={index}>
                      <td>
                        <button id="api-select-btn"
                          className={`api-select-button ${selectedApiKey === key.api_key ? "selected" : ""}`}
                          onClick={() => setSelectedApiKey(key.api_key)}
                        >
                          API{index + 1}
                        </button>
                      </td>
                      <td>{`************${key.api_key.slice(-4)}`}</td>
                      <td>{new Date(key.created_date).toLocaleString()}</td>
                      <td>
                        <button className="api-delete-btn" onClick={() => deleteApiKey(key.api_key)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p></p>
            )}
          </div>

          {/* Generate API Key Section */}
          <div className="api-key-generate-section">
            <button className="generate-btn" onClick={generateApiKey} disabled={loading}>
              {loading ? "Generating..." : "Generate API Key"}
            </button>
          </div>
        </div>
         {/* Right Panel */}
         <div className="u-right-panel">
          <header id="head1">
            <h2>Country Search</h2>
          </header>

          <div className="search-section">
            <input 
              type="text" 
              placeholder="Enter country name" 
              value={country} 
              onChange={(e) => setCountry(e.target.value)} 
            />
            <button id="u-fetch-button" onClick={fetchCountryData}>
              {loading ? "Searching..." : "Fetch Country Info"}
            </button>
          </div>

          {countryData && (
            <div className="country-card">
              <button>{countryData.name}</button>
              <button>Capital: {countryData.capital}</button>
              <button>Currency: {countryData.currency}</button>
              <button>Languages: {countryData.languages.join(", ")}</button>
              <img src={countryData.flag} alt="Flag" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

// utils/tokenUtils.js
import axios from "axios";

export const refreshToken = async () => {
  try {
    await axios.post("http://localhost:3000/api/auth/refresh-token", {}, { withCredentials: true });
    const newExp = Date.now() / 1000 + 3600; // 1 hour
    localStorage.setItem("exp", newExp.toString());
  } catch (err) {
    console.error("Refresh token failed", err);
    localStorage.clear();
    window.location.href = "/login";
  }
};

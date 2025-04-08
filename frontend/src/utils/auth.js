export const isTokenExpired = () => {
    const exp = localStorage.getItem("exp");
    if (!exp) return true;
  
    const expiryTime = parseInt(exp) * 1000;
    return Date.now() >= expiryTime;
  };
  
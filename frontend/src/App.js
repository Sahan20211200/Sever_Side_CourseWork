import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import MainRoutes from "./MainRoutes";
import {ToastContainer} from "react-toastify";

function App() {
  return (
      <Router>
          <MainRoutes />
      </Router>
  );
}

export default App;

// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Link exact path="/" component={LoginPage} />
        <Link path="/dashboard" component={DashboardPage} />
      </Routes>
    </Router>
  );
};

export default App;

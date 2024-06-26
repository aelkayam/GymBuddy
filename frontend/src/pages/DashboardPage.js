// pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import api from "../services/api";

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Fetch user data error:", error);
        // Handle error (e.g., redirect to login if unauthorized)
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {userData && (
        <div>
          <p>Welcome, {userData.username}!</p>
          <p>Email: {userData.email}</p>
          {/* Display other user details */}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

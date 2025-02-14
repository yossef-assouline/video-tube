"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import LoginForm from "./components/LoginForm";
import UserProfile from "./components/UserProfile";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      const response = await axios.post(
        "http://localhost:7000/api/v1/users/logout",
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.removeItem("user");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!user ? (
        <LoginForm setUser={setUser} />
      ) : (
        <UserProfile user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import FindUser from "./components/FindUser";
import Cookies from "js-cookie";

export default function Home() {
  const [user, setUser] = useState(null);

  // Check for existing user session on component mount
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
      console.log(response)
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      {!user ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const email = formData.get("email");
            const password = formData.get("password");

            try {
              const response = await axios.post(
                "http://localhost:7000/api/v1/users/login",
                {
                  email,
                  password,
                }
              );

              console.log("Login response:", response.data); // Debug log

              // Assuming the response structure is: response.data.data
              const userData = response.data.data;

              if (!userData?.accessToken) {
                console.error("No access token in response:", userData);
                return;
              }

              
              Cookies.set("accessToken", userData.accessToken, {
                path: "/",
                secure: true,
                sameSite: "Strict",
              });

              // Set up axios defaults
              axios.defaults.withCredentials = true;  // Important for cookies
              axios.defaults.headers.common['authorization'] = `Bearer ${userData.accessToken}`; // lowercase to match backend

              if (userData.refreshToken) {
                Cookies.set("refreshToken", userData.refreshToken, {
                  path: "/",
                  secure: true,
                  sameSite: "Strict",
                });
              }

              // Set up base URL
              axios.defaults.baseURL = 'http://localhost:7000/api/v1';

              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
            } catch (error) {
              console.error(
                "Login failed:",
                error.response?.data || error.message
              );
              // Handle login error here
            }
          }}
          className="space-y-4 w-full max-w-md"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl mb-4">Welcome, {user.name || user.email}!</h1>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import FindUser from "./components/FindUser";
import Cookies from "js-cookie";
import Image from "next/image";
export default function Home() {
  const [user, setUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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
      console.log(response);
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");

    try {
      const response = await axios.put(
        "http://localhost:7000/api/v1/users/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      alert("Password changed successfully!");
      setShowPasswordModal(false);
    } catch (error) {
      console.error("Password change failed:", error.response?.data || error.message);
      alert("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="flex  items-center h-screen flex-col">
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
              axios.defaults.withCredentials = true; // Important for cookies
              axios.defaults.headers.common[
                "authorization"
              ] = `Bearer ${userData.accessToken}`; // lowercase to match backend

              if (userData.refreshToken) {
                Cookies.set("refreshToken", userData.refreshToken, {
                  path: "/",
                  secure: true,
                  sameSite: "Strict",
                });
              }

              // Set up base URL
              axios.defaults.baseURL = "http://localhost:7000/api/v1";

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
        <div className="w-full">
          {/* Banner Section */}
          <div className="relative w-full h-[200px] bg-gray-300">
            <Image
              src={user.user?.coverImage || "/default-banner.jpg"}
              alt="Channel Banner"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </div>

          {/* Profile Section */}
          <div className="flex flex-col md:flex-row items-start gap-6 -mt-16 relative z-10">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden relative">
              <Image
                src={user.user?.avatar}
                alt="User Avatar"
                width={128}
                height={128}
                className="rounded-full"
              />
            </div>
            <div className="max-w-6xl mx-auto px-4 flex flex-col items-center text-center">
              {/* User Info */}
              <div className="flex flex-col pt-4 md:pt-16 gap-4">
                <h1 className="text-3xl font-bold">{user.user.fullname}</h1>
                <div className="flex flex-col space-y-1 mt-2 text-gray-600">
                  <p className="text-lg">@{user.user.username}</p>
                  <p>
                    Email:{" "}
                    <span className="text-gray-800 font-bold">
                      {user.user.email}
                    </span>
                  </p>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="rounded-md bg-red-400 px-4 py-2 text-white hover:ring-2 hover:ring-black"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Logout Button */}
              <div className="md:pt-16 mt-8">
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>

            </div>
          </div>

          {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96 relative">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <h2 className="text-xl font-bold mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="oldPassword"
                      name="oldPassword"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

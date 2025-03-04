"use client";
import Image from "next/image";
import { useState } from "react";
import PasswordModal from "./PasswordModal";
import UpdateFieldModal from "./UpdateFieldModal";
import { useAuthStore } from "../store/authStore.js";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";
import Navbar from "./NavBar";

import axios from "axios";

export default function UserProfile({ onLogout }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const { checkAuth, user , logout , updateProfile ,error , isLoading , updateAvatar , updateCoverImage } = useAuthStore();
  
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (!user) {
    return router.push('/')
  }

  const handleUpdateField = async (formData) => {
    try {
      await updateProfile(formData);
      await checkAuth();
      if(!error){
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating field:", error.response?.data || error.message);
    }
  };

  const handleAvatarUpdate = async (file) => {
    
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      await updateAvatar(formData);
      await checkAuth();
      if(!error){
        setShowAvatarModal(false);
        toast.success("Avatar updated successfully!");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    } 
  };

  const handleCoverUpdate = async (file) => {
    try {
      const formData = new FormData();
      formData.append("coverImage", file);

      await updateCoverImage(formData);
      await checkAuth();
      if(!error){
        setShowCoverModal(false);
        toast.success("Cover image updated successfully!");
      }
    } catch (error) {
      console.error("Error updating cover image:", error);
    }
  };

  return (
    <>
    <Navbar />
    <div className="w-full">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Banner Section with hover effect */}
      <div 
        className="relative w-full h-[200px] bg-gray-300 cursor-pointer group"
        onClick={() => setShowCoverModal(true)}
      >
        <Image
          src={user?.coverImage || "/default-banner.jpg"}
          alt="Channel Banner"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-lg">Change Cover Image</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start gap-6 -mt-16 relative z-10">
          {/* Avatar with hover effect */}
          <div
            className="rounded-full border-4 border-white overflow-hidden relative group cursor-pointer"
            onClick={() => setShowAvatarModal(true)}
          >
            <Image
              src={user?.avatar || "/default-avatar.jpg"}
              alt="User Avatar"
              width={128}
              height={128}
              className="rounded-full object-cover aspect-square"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm">Change Avatar</span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center text-center w-full">
            <div>
              <h1 className="text-3xl font-bold">{user?.fullname}</h1>
              <div className="mt-2 text-gray-600 space-y-2">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-lg">
                    Full Name:{" "}
                    <span className="font-bold">{user?.fullname}</span>
                  </p>
                  <p className="text-lg">
                    Username:{" "}
                    <span className="font-bold">@{user?.username}</span>
                  </p>
                  <p className="text-lg">
                    Email: <span className="font-bold">{user?.email}</span>
                  </p>

                  <button
                    onClick={() => setShowUpdateModal(true)}
                    className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md mt-2"
                  >
                    Edit Profile
                  </button>
                </div>

                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="rounded-md bg-red-400 px-4 py-2 mt-4 text-white hover:ring-2 hover:ring-black w-fit"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <div className="md:pt-16">
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 mt-4"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordModal
          user={user}
          onClose={() => setShowPasswordModal(false)}
        />
      )}

      {showUpdateModal && (
        <UpdateFieldModal
          currentValues={{
            fullname: user?.fullname,
            username: user?.username,
            email: user?.email,
          }}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateField}
        />
      )}

      {/* Add Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Update Avatar</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const file = e.target.avatar.files[0];
                if (file) handleAvatarUpdate(file);
              }}
            >
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {isLoading ? <Spinner /> : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Cover Image Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Update Cover Image</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const file = e.target.coverImage.files[0];
                if (file) handleCoverUpdate(file);
              }}
            >
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCoverModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {isLoading ? <Spinner /> : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

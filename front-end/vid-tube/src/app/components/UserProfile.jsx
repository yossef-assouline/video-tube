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
import { Camera, Mail, User, UserCircle, LogOut, Key } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      )}

      {/* Banner Section */}
      <div className="relative h-[200px] md:h-[300px] group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600">
          {user?.coverImage && (
            <Image
              src={user.coverImage}
              alt="Cover"
              layout="fill"
              objectFit="cover"
              className="transition-opacity duration-300"
            />
          )}
          
          {/* Hover Overlay - Hidden on Mobile */}
          <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center cursor-pointer"
               onClick={() => setShowCoverModal(true)}>
            <div className="text-white flex flex-col items-center gap-2">
              <Camera size={32} />
              <span className="text-lg font-medium">Change Cover Image</span>
            </div>
          </div>

          {/* Mobile Button - Visible only on smaller screens */}
          <button 
            onClick={() => setShowCoverModal(true)}
            className="md:hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full flex items-center justify-center transition-all"
            aria-label="Change cover image"
          >
            <Camera size={20} />
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 md:-mt-32">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                    <Image
                      src={user?.avatar || "/default-avatar.jpg"}
                      alt="Avatar"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  >
                    <Camera className="text-white" size={24} />
                  </button>
                </div>
              </div>

              {/* User Info Section */}
              <div className="flex-1 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user?.fullname}
                    </h1>
                    <p className="text-emerald-600 dark:text-emerald-400">@{user?.username}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowUpdateModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                    >
                      <UserCircle size={20} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                    >
                      <Key size={20} />
                      Change Password
                    </button>
                  </div>
                </div>

                {/* User Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t dark:border-gray-700">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <User className="text-emerald-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                      <p className="font-medium">{user?.fullname}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Mail className="text-emerald-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="pt-6 border-t dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              </div>
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
  );
}

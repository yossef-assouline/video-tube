import Image from "next/image";
import { useState } from "react";
import PasswordModal from "./PasswordModal";
import UpdateFieldModal from "./UpdateFieldModal";
import axios from "axios";

export default function UserProfile({ user, onLogout }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [userData, setUserData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateField = async (formData) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:7000/api/v1/users/update-account",
        formData,
        {
          headers: {
            authorization: `Bearer ${userData.accessToken}`,
          },
        }
      );
      
      if (response.status !== 200) {
        throw new Error('Failed to update fields');
      }
      
      const updatedUserResponse = await axios.get(
        "http://localhost:7000/api/v1/users/current-user",
        {
          headers: { authorization: `Bearer ${userData.accessToken}` },
        }
      );
      
      setUserData({
        ...userData,
        user: updatedUserResponse.data.data
      });
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating fields:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpdate = async (file) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.patch(
        "http://localhost:7000/api/v1/users/update-avatar",
        formData,
        {
          headers: {
            authorization: `Bearer ${userData.accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to update avatar');
      }

      // Fetch updated user data
      const updatedUserResponse = await axios.get(
        "http://localhost:7000/api/v1/users/current-user",
        {
          headers: { authorization: `Bearer ${userData.accessToken}` },
        }
      );

      setUserData({
        ...userData,
        user: updatedUserResponse.data.data
      });
      setShowAvatarModal(false);
    } catch (error) {
      console.error('Error updating avatar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Banner Section */}
      <div className="relative w-full h-[200px] bg-gray-300">
        <Image
          src={userData.user?.coverImage || "/default-banner.jpg"}
          alt="Channel Banner"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
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
              src={userData.user?.avatar}
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
              <h1 className="text-3xl font-bold">{userData.user.fullname}</h1>
              <div className="mt-2 text-gray-600 space-y-2">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-lg">Full Name: <span className="font-bold">{userData.user.fullname}</span></p>
                  <p className="text-lg">Username: <span className="font-bold">@{userData.user.username}</span></p>
                  <p className="text-lg">Email: <span className="font-bold">{userData.user.email}</span></p>
                  
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
                onClick={onLogout}
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
          user={userData}
          onClose={() => setShowPasswordModal(false)}
        />
      )}

      {showUpdateModal && (
        <UpdateFieldModal
          currentValues={{
            fullname: userData.user.fullname,
            username: userData.user.username,
            email: userData.user.email
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
            <form onSubmit={(e) => {
              e.preventDefault();
              const file = e.target.avatar.files[0];
              if (file) handleAvatarUpdate(file);
            }}>
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
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
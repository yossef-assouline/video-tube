import axios from "axios";

export default function PasswordModal({ user, onClose }) {
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
      onClose();
    } catch (error) {
      console.error("Password change failed:", error.response?.data || error.message);
      alert("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          onClick={onClose}
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
  );
} 
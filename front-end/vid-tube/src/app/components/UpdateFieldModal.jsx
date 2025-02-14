import { useState } from "react";

export default function UpdateFieldModal({ currentValues, onClose, onUpdate }) {
  const [formData, setFormData] = useState(currentValues);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error("Error updating fields:", error);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={formData.fullname}
                onChange={handleChange('fullname')}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={handleChange('username')}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
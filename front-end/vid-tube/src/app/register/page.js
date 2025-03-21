"use client"
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useAuthStore } from "../store/authStore.js";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import  Spinner  from "../components/Spinner.jsx";
import Link from "next/link";

export default function Register() {
  const { signup, isLoading, registerError } = useAuthStore();

  const router = useRouter();
  
  // Form validation states
  const [formErrors, setFormErrors] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    avatar: '',
    coverImage: ''
  });

  // Form data state for real-time validation
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    avatar: null,
    coverImage: null
  });

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'fullname':
        if (value.length < 3) return 'Full name must be at least 3 characters';
        if (value.length > 50) return 'Full name must be less than 50 characters';
        if (!/^[a-zA-Z\s]*$/.test(value)) return 'Full name can only contain letters and spaces';
        return '';

      case 'username':
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 30) return 'Username must be less than 30 characters';
        if (!/^[a-zA-Z0-9_]*$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';

      case 'password':
        if (value.length < 6) return 'Password must be at least 6 characters';
        if (value.length > 50) return 'Password must be less than 50 characters';
        if (!/\d/.test(value)) return 'Password must contain at least one number';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        return '';

      default:
        return '';
    }
  };

  // File validation
  const validateFile = (file, type) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

    if (!file) return `Please select a ${type}`;
    if (!allowedTypes.includes(file.type)) return 'File type not supported. Use JPG, PNG, or GIF';
    if (file.size > maxSize) return 'File size must be less than 5MB';
    return '';
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      const fileError = validateFile(file, name);
      setFormErrors(prev => ({
        ...prev,
        [name]: fileError
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      const error = validateField(name, value);
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {
      fullname: validateField('fullname', formData.fullname),
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      avatar: validateFile(formData.avatar, 'avatar'),
      coverImage: validateFile(formData.coverImage, 'cover image')
    };

    setFormErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error !== '')) {
      toast.error('Please fix the form errors');
      return;
    }

    // Create FormData object
    const submitFormData = new FormData();
    Object.keys(formData).forEach(key => {
      submitFormData.append(key, formData[key]);
    });

    try {
      const response = await signup(submitFormData);
      // Only redirect and show success message if there's no error
      if (response?.data.success) {
        toast.success('User registered successfully');
        router.push('/');
      }
      // If there's an error, it will be displayed through the registerError in the UI
    } catch (error) {
      console.error('Error:', error);
      // The error will be handled by the store and displayed through registerError
    }
  };

  return (
    <div className="flex min-h-screen bg-white flex-col items-center justify-center p-24">
      {/* Show register error from auth store */}
      {registerError && (
        <div className="w-full max-w-md mb-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {registerError}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <div>
          <label htmlFor="fullname" className="block text-sm font-medium text-black">
            Full Name
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className={`mt-1 block text-black w-full rounded-md border-2 ${
              formErrors.fullname ? 'border-red-500' : 'border-black'
            } px-3 py-2`}
          />
          {formErrors.fullname && (
            <p className="text-red-500 text-xs mt-1">{formErrors.fullname}</p>
          )}
        </div>

        <div>
          <label htmlFor="username" className="block text-black text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`mt-1 block w-full text-black rounded-md border-2 ${
              formErrors.username ? 'border-red-500' : 'border-black'
            } px-3 py-2`}
          />
          {formErrors.username && (
            <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-black text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md text-black border-2 ${
              formErrors.email ? 'border-red-500' : 'border-black'
            } px-3 py-2`}
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-black text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md text-black border-2 ${
              formErrors.password ? 'border-red-500' : 'border-black'
            } px-3 py-2`}
          />
          {formErrors.password && (
            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="avatar" className="block text-black text-sm font-medium">
            Avatar
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className={`flex h-10 w-full rounded-md text-black border-2 ${
              formErrors.avatar ? 'border-red-500' : 'border-black'
            } px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium`}
          />
          {formErrors.avatar && (
            <p className="text-red-500 text-xs mt-1">{formErrors.avatar}</p>
          )}
        </div>

        <div>
          <label htmlFor="coverImage" className="block text-black text-sm font-medium">
            Cover Image
          </label>
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            accept="image/*"
            onChange={handleChange}
            className={`flex h-10 w-full rounded-md border-2 ${
              formErrors.coverImage ? 'border-red-500' : 'border-black'
            } px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium`}
          />
          {formErrors.coverImage && (
            <p className="text-red-500 text-xs mt-1">{formErrors.coverImage}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || Object.values(formErrors).some(error => error !== '')}
          className="w-full rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            </div>
          ) : (
            "Submit"
          )}
        </button>
        <Link className="text-black" href="/">Already have an account? <span className="text-emerald-500 ">Login</span></Link>
      </form>
    </div>
  )
}
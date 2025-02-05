"use client"
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
export default function Home() {
  
  const [success, setSuccess] = useState(false);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
          const response = await axios.post(
            'http://localhost:7000/api/v1/users/register', 
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          console.log('Success:', response.data);
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
          redirect('/homepage');
        } catch (error) {
          console.error('Error:', error.response?.data || error.message);
        }
      }}
      className="space-y-4 w-full max-w-md"
      >
        <div>
          <label htmlFor="fullname" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
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

        <div>
          <label htmlFor="avatar" className="block text-sm font-medium">
            Avatar
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium">
            Cover Image
          </label>
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            accept="image/*"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Submit
        </button>
        {success && <p className="text-green-500 text-center">User registered successfully</p>}
      </form>
    </div>
  )
}

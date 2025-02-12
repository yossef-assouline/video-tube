"use client"
import React, { useState } from 'react'
import axios from 'axios';

export default function FindUser() {
    const [success, setSuccess] = useState(false);
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex justify-center items-center h-screen flex-col">
    <form onSubmit={async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        
        try {
          const response = await axios.get(
            `http://localhost:7000/api/v1/users/find?email=${encodeURIComponent(email)}`
          );
          console.log('Success:', response.data);
          setSuccess(true);
          setResponse(response.data);
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
         
        } catch (error) {
          console.log('Error:', error.response?.data || error.message);
        } finally {
          setIsLoading(false);
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
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
              <span className="ml-2">Finding User...</span>
            </div>
          ) : (
            'Find User'
          )}
        </button>
    </form>
    {success && <p className="text-green-500">User found successfully</p>}
    
    {response?.data && !isLoading && (
      <div className="mt-8 p-6 border rounded-lg shadow-md bg-white max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 mb-4">
            <img 
              src={response.data.avatar} 
              alt={`${response.data.fullame}'s profile`}
              className="w-full h-full rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {response.data.fullname}
          </h2>
          <p className="text-gray-600 mb-2">
            {response.data.email}
          </p>
          <div className="w-full mt-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Username:</span>
              <span className="font-medium">{response.data.username}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
            <img 
              src={response.data?.coverImage}
              
              className="w-full h-full rounded-xl object-cover border-2 border-gray-200"
            />
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  )
}

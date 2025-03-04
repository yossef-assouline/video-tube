"use client"
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useAuthStore } from "../store/authStore.js";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import  Spinner  from "../components/Spinner.jsx";
export default function Register() {
  const { signup, isLoading, error } = useAuthStore();

  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={async (e) => {
        
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
          await signup(formData);
          router.push('/');
          toast.success('User registered successfully');
        } catch (error) {
          console.error('Error:', error);
        }
      }}
      className="space-y-4 w-full max-w-md"
      >
        <div>
          <label htmlFor="fullname" className="block text-sm font-medium ">
            Full Name
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 "
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
          <input type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
          
           
            required className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"/>

        
         
        </div>

        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium">
            Cover Image
          </label>
          <input  type="file"
            id="coverImage"
            name="coverImage"
            accept="image/*"
           
            required className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"/>

        </div>
        
        <button
          type="submit"
          className="w-full rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  )
}
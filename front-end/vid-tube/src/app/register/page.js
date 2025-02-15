"use client"
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useAuthStore } from "../store/authStore.js";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
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
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {!isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  )
}
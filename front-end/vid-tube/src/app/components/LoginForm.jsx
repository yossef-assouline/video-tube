import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import Spinner from "./Spinner";
import Link from "next/link";
export default function LoginForm() {
  const { login, isLoading, loginError , user } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      await login(email, password);
      
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-2/3 max-w-md">
        {loginError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {loginError}
                </p>
              </div>
            </div>
          </div>
        )}

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
        
        <button
          type="submit"
          className="w-full rounded-md bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
      <p className="text-center text-sm mt-2">
        Don't have an account?{" "}
        <Link href="/register">
          <span className="text-emerald-500 hover:underline">Sign up</span>
        </Link>
      </p>
    </div>
  );
}

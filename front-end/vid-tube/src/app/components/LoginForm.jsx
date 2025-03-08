import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import Spinner from "./Spinner";
import Link from "next/link";
export default function LoginForm() {
  const { login, isLoading, error, user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      await login(email, password);

        toast.success("Login successful");
      
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-2/3 max-w-md">
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
        >
          {isLoading ? <Spinner /> : "Login"}
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

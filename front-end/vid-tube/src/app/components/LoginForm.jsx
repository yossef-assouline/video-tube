import axios from "axios";
import Cookies from "js-cookie";

export default function LoginForm({ setUser }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await axios.post(
        "http://localhost:7000/api/v1/users/login",
        {
          email,
          password,
        }
      );

      const userData = response.data.data;

      if (!userData?.accessToken) {
        console.error("No access token in response:", userData);
        return;
      }

      Cookies.set("accessToken", userData.accessToken, {
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      axios.defaults.withCredentials = true;
      axios.defaults.headers.common["authorization"] = `Bearer ${userData.accessToken}`;

      if (userData.refreshToken) {
        Cookies.set("refreshToken", userData.refreshToken, {
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
      }

      axios.defaults.baseURL = "http://localhost:7000/api/v1";

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
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
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
} 
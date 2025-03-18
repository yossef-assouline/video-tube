import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
  const { login, isLoading, loginError } = useAuthStore();
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
    <div className="min-h-screen w-full flex flex-col md:flex-row relative overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 ">
        <svg 
          id="visual" 
          viewBox="0 0 960 540" 
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <rect 
            x="0" 
            y="0" 
            width="960" 
            height="540" 
            fill="#ffffff"
          />
          <path 
            d="M487 0L493.3 7.5C499.7 15 512.3 30 505.7 45C499 60 473 75 472.8 90C472.7 105 498.3 120 511.5 135C524.7 150 525.3 165 511.8 180C498.3 195 470.7 210 458.2 225C445.7 240 448.3 255 461.8 270C475.3 285 499.7 300 508.7 315C517.7 330 511.3 345 508.3 360C505.3 375 505.7 390 495.3 405C485 420 464 435 463.8 450C463.7 465 484.3 480 494 495C503.7 510 502.3 525 501.7 532.5L501 540L0 540L0 532.5C0 525 0 510 0 495C0 480 0 465 0 450C0 435 0 420 0 405C0 390 0 375 0 360C0 345 0 330 0 315C0 300 0 285 0 270C0 255 0 240 0 225C0 210 0 195 0 180C0 165 0 150 0 135C0 120 0 105 0 90C0 75 0 60 0 45C0 30 0 15 0 7.5L0 0Z" 
            fill="#d1fae5" 
            strokeLinecap="round" 
            strokeLinejoin="miter"
          />
        </svg>
      </div>

      {/* Left Section */}
      <div className="w-full md:w-1/2 p-12 flex flex-col relative">
        <div className="mb-8">
          <Image src="/logo.png" alt="logo" width={130} height={92} className="mb-8"/>
        </div>

        {/* Hero Image Section */}
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="relative w-[400px] h-[250px] md:w-[500px] md:h-[400px] mb-8 rounded-xl">
            <Image
              src="/banner-hero.png"
              alt="ViewVibe Hero"
              fill
              style={{ objectFit: 'contain', borderRadius: '10px'}}
              priority
            />
          </div>
          
          <h2 className="text-4xl font-bold text-emerald-800 mb-4">
            Welcome to VidView
          </h2>
          <p className="text-emerald-600 text-xl">
            Your personal video streaming paradise
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 p-12 flex items-center justify-center relative  ">
        <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 p-8 rounded-2xl shadow-xl border border-gray-300">
          <h2 className="text-center text-3xl font-bold mb-2 md:text-left">Sign in to your account</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400 text-center md:text-left">
            Or{" "}
            <Link href="/register" className="text-emerald-500 hover:text-emerald-600">
              create a new account
            </Link>
          </p>

          {loginError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-sm text-red-700">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                
                
              </div>
              
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
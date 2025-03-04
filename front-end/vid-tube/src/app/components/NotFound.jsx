import NavBar from "./NavBar.jsx";

export default function NotFound() {
    return (
      <div>
        <NavBar />
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Video Not Found
            </h2>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
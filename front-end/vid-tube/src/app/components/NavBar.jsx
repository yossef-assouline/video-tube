"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '../store/authStore';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UploadVideoModal from './UploadVideoModal';
import { Menu, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function NavBar({ toggleSidebar }) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const router = useRouter();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    // Only check auth once when component mounts
    checkAuth();
  }, []); // Empty dependency array
  

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/c/${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 w-full h-16  bg-white/80  z-50 ">
      <div className="flex items-center h-full px-4 backdrop-blur-sm  shadow-md">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center gap-4">
            {(pathname.includes('home') || 
              pathname.includes('watch-history') || 
              pathname.includes('liked-videos')) || 
              pathname.includes('watch') ||
              pathname.includes('/c/') ? (
              <button 
                onClick={toggleSidebar}
                className="p-2 hover:bg-emerald-50 text-black  rounded-full"
              >
                <Menu size={24} />
              </button>
            ) : null}
          <Link href="/home" className="text-xl font-bold text-gray-800">
            <Image src="/logo.png" alt="logo" width={150} height={92} />
          </Link>
        </div>

        {/* Center - Search (Modified) */}
        <div className="flex-1 max-w-2xl mx-auto px-4">
          {/* Hidden on mobile, visible on larger screens */}
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search className="h-5 w-5 text-black" />
            </button>
          </form>
          
          {/* Search icon visible only on mobile */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="sm:hidden p-2 hover:bg-gray-100 rounded-full"
          >
            <Search className="h-5 w-5 text-black" />
          </button>
        </div>

        {/* Right side - Upload and Profile */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-md text-white flex items-center"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              Upload
            </button>
          )}
          
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={user?.avatar || "/default-avatar.jpg"}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.username}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  {user && (
                    <Link
                      href={`/c/${user.username}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Channel
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/${user.username}`}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-800"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16">
          <div className="w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <form 
                  onSubmit={(e) => {
                    handleSearch(e);
                    setIsSearchModalOpen(false);
                  }}
                  className="flex-1"
                >
                  <input
                    type="text"
                    placeholder="Search channels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <UploadVideoModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
    </nav>
  );
}

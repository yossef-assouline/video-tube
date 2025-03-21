"use client"
import { useEffect, useState } from 'react';
import { useActionStore } from '../store/actionStore';
import { useRouter } from 'next/navigation';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import CollapsedSideBar from '../components/CollapsedSideBar';
import VideoGrid from '../components/VideoGrid';
import Spinner from '../components/Spinner';
import { useAuthStore } from '../store/authStore';

export default function LikedVideosPage() {
  const router = useRouter();
  const { getSubscribedChannels, subscribedChannels, getLikedVideos, likedVideos } = useActionStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initial fetch
  useEffect(() => {
    if (user?._id) {
      // Get subscribed channels and liked videos
      getSubscribedChannels(user._id);
      getLikedVideos();
      setIsLoading(false);
    }
  }, [user]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      setIsSidebarOpen(width >= 1280);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <NavBar toggleSidebar={toggleSidebar} />
        <div className="flex justify-center items-center h-[50vh]">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <NavBar toggleSidebar={toggleSidebar} />
      
      <Sidebar 
        user={user}
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        subscribedChannels={subscribedChannels}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className={`${isSidebarOpen ? 'hidden' : 'block'} xl:hidden`}>
        <CollapsedSideBar user={user} />
      </div>

      <div className={`
        pt-16 pl-16 transition-all duration-300 flex flex-col items-center
        ${isSidebarOpen && !isMobile ? 'lg:ml-64' : ''}
        `}>
          <h1 className="text-xl font-bold mb-8 mt-8">Liked Videos</h1>
        <div className="flex justify-center p-4">
          {likedVideos.length > 0 ? (
            <VideoGrid 
              videos={likedVideos}
              onVideoClick={(videoId) => router.push(`/watch/${videoId}`)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
              <svg 
                className="w-16 h-16 mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <p className="text-xl font-medium">No liked videos</p>
              <p className="text-sm">Videos you like will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

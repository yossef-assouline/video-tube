"use client"
import { useEffect, useState } from 'react';
import { useActionStore } from '../store/actionStore';
import { useRouter } from 'next/navigation';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import VideoGrid from '../components/VideoGrid';
import Spinner from '../components/Spinner';
import { useAuthStore } from '../store/authStore';

export default function LikedVideosPage() {
  const router = useRouter();
  const { getSubscribedChannels, subscribedChannels, getLikedVideos, likedVideos } = useActionStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    if (user?._id) {
      // Get subscribed channels and liked videos
      getSubscribedChannels(user._id);
      getLikedVideos();
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <NavBar />
        <div className="flex justify-center items-center h-[50vh]">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="flex">
        <Sidebar 
          user={user} 
          subscribedChannels={subscribedChannels}
        />

        <div className="flex-1 xl:ml-64 pt-8">
          <h1 className="text-2xl font-bold px-4 mb-6">Liked Videos</h1>
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
    </div>
  );
}

"use client"
import { useEffect, useState } from 'react';
import { useActionStore } from '../store/actionStore';
import { useRouter } from 'next/navigation';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import VideoGrid from '../components/VideoGrid';
import Spinner from '../components/Spinner';
import { useAuthStore } from '../store/authStore';

export default function WatchHistoryPage() {
  const router = useRouter();
  const { getSubscribedChannels, subscribedChannels, getWatchHistory , watchHistory} = useActionStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    if (user?._id) {
      // Get subscribed channels
      getSubscribedChannels(user._id);
      getWatchHistory();
      // Set watch history from user object
      
      setIsLoading(false);
    }
  }, [user]);
  useEffect(() => {
    console.log(watchHistory)
  }, [watchHistory]);
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
          <h1 className="text-2xl font-bold px-4 mb-6">Watch History</h1>
          <div className="flex justify-center p-4">
            {watchHistory.length > 0 ? (
              <VideoGrid 
                videos={watchHistory}
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
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                  />
                </svg>
                <p className="text-xl font-medium">No watch history</p>
                <p className="text-sm">Videos you watch will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

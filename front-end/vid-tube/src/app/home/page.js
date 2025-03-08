"use client"
import { useEffect, useState } from 'react';
import { useActionStore } from '../store/actionStore';
import { useRouter } from 'next/navigation';
import NavBar from '../components/NavBar';
import Spinner from '../components/Spinner';
import PublicVideoCard from '../components/PublicVideoCard';

export default function HomePage() {
  const router = useRouter();
  const { videos, isFetchingVideos, fetchAllVideos } = useActionStore();
  const [videoArray, setVideoArray] = useState([]);

  useEffect(() => {
    fetchAllVideos();
  }, []);

  useEffect(() => {
    setVideoArray(videos.videos);
    console.log(videos.videos);
  }, [videos]);

  if (isFetchingVideos || videoArray?.length === 0) {
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
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 fixed h-full  pt-16">
          <div className="p-3 space-y-2">
            <button className="flex items-center w-full px-3 py-2 text-white rounded-lg bg-[#272727] hover:bg-[#3f3f3f]">
              <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 21V10.08l8-6.96 8 6.96V21h-6v-6h-4v6H4z"/>
              </svg>
              Home
            </button>
            {/* Add more sidebar items */}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-0 md:ml-64 pt-16">
          <div className="max-w-[2150px] mx-auto px-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {videoArray?.map((video) => (
                <PublicVideoCard 
                  key={video._id}
                  video={video}
                  onClick={() => router.push(`/watch/${video._id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



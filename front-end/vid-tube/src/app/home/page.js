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
      

        {/* Main Content */}
        <div className="flex pt-4 border">
          <div className="max-w-[2150px] mx-auto px-4 py-4">
            <div className="flex flex-col">
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

  );
}



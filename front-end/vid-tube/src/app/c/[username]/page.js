"use client"
import { useEffect } from 'react';
import { useActionStore } from '../../store/actionStore.js';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import NavBar from '../../components/NavBar';
import { useAuthStore } from '../../store/authStore.js';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChannelPage() {
  const { username } = useParams();
  const { channelData, isLoading, error, findChannel, videos, toggleSubscribe} = useActionStore();
  const { user} = useAuthStore();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const router = useRouter();
  const redirectToWatchPage = (videoId) => {
    router.push(`/watch/${videoId}`);
  }
  
  useEffect(() => {
    findChannel(username);
  }, [username, findChannel]);
  useEffect(() => {
    if(channelData?.isSubscribed === true){
      setIsSubscribed(true)
    }
  }, [channelData]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!channelData) {
    return null;
  }

  return (
    <>
    <NavBar/>
    <div className="w-full">
      {/* Banner Section */}
      <div className="relative w-full h-[200px] bg-gray-300">
        <Image
          src={channelData.coverImage || "/default-banner.jpg"}
          alt="Channel Banner"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* Channel Info Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start gap-6 -mt-16 relative z-10">
          {/* Avatar */}
          <div className="rounded-full border-4 border-white overflow-hidden">
            <Image
              src={channelData.avatar || "/default-avatar.jpg"}
              alt="Channel Avatar"
              width={128}
              height={128}
              className="rounded-full object-cover aspect-square"
            />
          </div>

          {/* Channel Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{channelData.fullname}</h1>
            <p className="text-gray-600">@{channelData.username}</p>
            <div className="mt-4 flex gap-4">
              <div>
                <span className="font-bold">{channelData.subscribersCount || 0}</span>{" "}
                <span className="text-gray-600">subscribers</span>
              </div>
              <div>
                <span className="font-bold">{videos.length || 0}</span>{" "}
                <span className="text-gray-600">videos</span>
              </div>
            </div>
            {/* Add Subscribe button if the channel is not the current user's */}
            {channelData.username !== user?.username && (
              <button onClick={() => toggleSubscribe(channelData._id)} className="bg-blue-500 text-white px-4 py-2 rounded-md">{isSubscribed ? "Unsubscribe" : "Subscribe"}</button>
            )}
            {/* Add more channel details as needed */}
          </div>
        </div>

        {/* Videos Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Map through channel videos here */}
            {videos.length === 0 && (
              <div className="text-center text-gray-600">No Videos Uploaded</div>
            )}
            {videos?.map((video) => (
              <div key={video._id} className="video-card">
                {/* Video thumbnail and details */}
                <div className='cursor-pointer '>
                <Image src={video.thumbnail} alt={video.title} className='aspect-video hover:opacity-90 hover:ring-2 hover:ring-slate-500 transition-all duration-300 object-cover rounded-md' width={300} height={250} onClick={() => redirectToWatchPage(video._id)}/>
                </div>
                <h3 className='text-md mt-2 font-bold hover:text-blue-500 cursor-pointer' onClick={() => redirectToWatchPage(video._id)}>{video.title}</h3>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
} 
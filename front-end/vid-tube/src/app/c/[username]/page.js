"use client"
import { useEffect, useState } from 'react';
import { useActionStore } from '../../store/actionStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import NavBar from '../../components/NavBar';
import VideoCard from '../../components/VideoCard.jsx';
import ChannelHeader from '../../components/ChannelHeader.jsx';
import VideosGrid from '../../components/VideosGrid.jsx';
import Spinner from '@/app/components/Spinner.jsx';

export default function ChannelPage() {
  const { username } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    channelData, 
    isLoading, 
    error, 
    findChannel, 
    videos, 
    toggleSubscribe 
  } = useActionStore();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    findChannel(username);
  }, [username, findChannel]);

  useEffect(() => {
    if (channelData?.isSubscribed === true) {
      setIsSubscribed(true);
    }
  }, [channelData]);

  const handleVideoClick = (videoId) => {
    router.push(`/watch/${videoId}`);
  };

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!channelData) return null;

  return (
    <>
      <NavBar />
      <div className="w-full">
        <ChannelHeader 
          channelData={channelData}
          videos={videos}
          isSubscribed={isSubscribed}
          onSubscribe={() => {
            toggleSubscribe(channelData._id);
            setIsSubscribed(!isSubscribed);
          }}
          isOwnChannel={channelData.username === user?.username}
        />

        <div className="max-w-6xl mx-auto px-4">
          <VideosGrid 
            videos={videos} 
            onVideoClick={handleVideoClick} 
          />
        </div>
      </div>
    </>
  );
}


const ErrorMessage = ({ message }) => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="text-red-500 text-xl">{message}</div>
  </div>
); 
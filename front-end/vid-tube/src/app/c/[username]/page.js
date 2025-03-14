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
import Sidebar from '@/app/components/Sidebar';
import CollapsedSideBar from '@/app/components/CollapsedSideBar';

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
    toggleSubscribe ,
    subscribedChannels
  } = useActionStore();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!channelData) return null;

  return (
    <div className="min-h-screen ">
      <NavBar toggleSidebar={toggleSidebar} />
      
      <Sidebar 
        user={user}
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        subscribedChannels={subscribedChannels}
        onClose={() => setIsSidebarOpen(false)}
      />
      

      <div className={`
         transition-all duration-300 "
        
      `}>
        <div className="xl:w-full xl:flex xl:flex-col xl:items-center">
        <div className="w-full md:max-w-6xl flex flex-col ">
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

          <div className="w-full md:max-w-6xl mx-auto px-4">
            <VideosGrid 
              videos={videos} 
              onVideoClick={handleVideoClick} 
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

const ErrorMessage = ({ message }) => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="text-red-500 text-xl">{message}</div>
  </div>
); 
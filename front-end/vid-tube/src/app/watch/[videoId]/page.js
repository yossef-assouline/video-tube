"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useActionStore } from "../../store/actionStore.js"
import { useAuthStore } from "../../store/authStore.js";
import NavBar from "../../components/NavBar.jsx";
import VideoPlayer from "../../components/VideoPlayer.jsx";
import VideoInfo from "../../components/VideoInfo.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import NotFound from "../../components/NotFound.jsx";
import CommentsSection from "../../components/CommentSection.jsx";
import SuggestedVideos from "../../components/SuggestedVideos.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import CollapsedSideBar from "@/app/components/CollapsedSideBar";

export default function WatchPage() {
  const { videoId } = useParams();
  const { loggedInUser , user } = useAuthStore();
  const { getVideoById, video, isLoading , getSubscribedChannels , subscribedChannels } = useActionStore();
  const [subscribedChannelsArray, setSubscribedChannelsArray] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    getVideoById(videoId);
  }, [videoId]);
  useEffect(() => {
    if (user?._id) {
      getSubscribedChannels(user._id);
    }
  }, [user]);
  useEffect(() => {
    setSubscribedChannelsArray(subscribedChannels);
  }, [subscribedChannels]);
  useEffect(() => {
    if (video?.isSubscribed === true) {
      setIsSubscribed(true);
    }
  }, [video]);

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

  if (isLoading) return <LoadingSpinner />;
  if (!video) return <NotFound />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black">
      <NavBar toggleSidebar={toggleSidebar} />
      
      <Sidebar 
        user={loggedInUser}
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        onClose={() => setIsSidebarOpen(false)}
        subscribedChannels={subscribedChannels}
      />

      <div className={`${isSidebarOpen ? 'hidden' : 'block'} xl:hidden`}>
        <CollapsedSideBar user={loggedInUser} />
      </div>

      <div className="flex bg-gray-200" >
        <div className={`
          pt-16 pl-16 w-full transition-all duration-300
          ${isSidebarOpen && !isMobile ? 'lg:ml-64' : ''}
        `}>
          <div className="max-w-[2000px] mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-9">
                <div className="w-full bg-black">
                  <div className="relative pt-[56.25%]">
                    <div className="absolute inset-0">
                      <VideoPlayer video={video} />
                    </div>
                  </div>
                </div>

                <div className="px-4 lg:px-0 mt-4 space-y-4">
                  <VideoInfo 
                    video={video} 
                    user={loggedInUser} 
                    isSubscribed={isSubscribed}
                    setIsSubscribed={setIsSubscribed}
                    subscribedChannelsArray={subscribedChannelsArray}
                  />

                  <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
                    <CommentsSection videoId={videoId} />
                  </div>
                </div>
              </div>

              <div className="md:w-80 px-4 lg:px-0">
                <div className="sticky top-20">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 " >
                    <SuggestedVideos currentVideoId={videoId} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

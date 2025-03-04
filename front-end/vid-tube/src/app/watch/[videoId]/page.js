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


export default function WatchPage() {
  const { videoId } = useParams();
  const { user } = useAuthStore();
  const { getVideoById, video, isLoading } = useActionStore();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    getVideoById(videoId);
  }, [videoId, getVideoById]);

  useEffect(() => {
    if (video?.isSubscribed === true) {
      setIsSubscribed(true);
    }
  }, [video]);

  if (isLoading) return <LoadingSpinner />;
  if (!video) return <NotFound />;

  return (
    <>
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VideoPlayer video={video} />
            <VideoInfo 
              video={video} 
              user={user} 
              isSubscribed={isSubscribed}
              setIsSubscribed={setIsSubscribed}
            />
            <CommentsSection videoId={videoId} />
          </div>
          <SuggestedVideos currentVideoId={videoId} />
        </div>
      </div>
    </>
  );
}

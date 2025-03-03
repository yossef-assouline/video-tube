"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useActionStore } from "../../store/actionStore.js";
import { useAuthStore } from "../../store/authStore.js";
import Image from "next/image";
import NavBar from "../../components/NavBar.jsx";
import { useRouter } from "next/navigation";

export default function WatchPage() {
  const { videoId } = useParams();
  const { user } = useAuthStore();
  const router = useRouter();
  const {
    getVideoById,
    toggleLike,
    toggleSubscribe,
    video,
    isLoading,
    channelData,
  } = useActionStore();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    getVideoById(videoId);
  }, [videoId, getVideoById]);
  useEffect(() => {
    if (video?.isSubscribed === true) {
      setIsSubscribed(true);
    }
  }, [video]);
  
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div>
        <NavBar />
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Video Not Found
            </h2>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLike = async () => {
    await toggleLike(video._id);
    setIsLiked(!isLiked);
  };

  return (
    <>
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Column */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={video.videoFile}
                controls
                autoPlay={true}
                className="w-full h-full"
                poster={video.thumbnail}
              />
            </div>

            {/* Video Info */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{video.title}</h1>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <Image
                    onClick={() => {
                      router.push(`/c/${video.owner[0].username}`);
                    }}
                    src={video.owner[0].avatar || "/default-avatar.jpg"}
                    alt={video.owner[0].username}
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer aspect-square"
                  />
                  <div>
                    <h3 className="font-semibold">{video.owner[0].username}</h3>
                    
                  </div>
                  {video.owner[0]._id !== user?._id && (
                    <button
                      onClick={() => {
                        toggleSubscribe(video.owner[0]._id);
                        setIsSubscribed(!isSubscribed);
                      }}
                      className={`ml-4 px-4 py-2 rounded-full ${
                        isSubscribed
                          ? "bg-gray-200 text-black"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-2"
                  >
                    <svg
                      className={`w-6 h-6 ${"text-blue-600"}`}
                      fill={"currentColor"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    <span>{video.likes || 0}</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>{video.views || 0} views</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{video.description}</p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Comments</h3>
              {/* Add comments component here */}
            </div>
          </div>

          {/* Suggested Videos Column */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">Suggested Videos</h3>
            {/* Add suggested videos component here */}
          </div>
        </div>
      </div>
    </>
  );
}

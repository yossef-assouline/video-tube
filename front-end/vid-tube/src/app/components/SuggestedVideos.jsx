import { useActionStore } from "@/app/store/actionStore";
import { useEffect, useState } from "react";
import VideoCard from "./VideoCard";

export default function SuggestedVideos({ currentVideoId }) {
  const { fetchAllVideos } = useActionStore();
  const { AllVideos } = useActionStore();
  const [videoArray, setVideoArray] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAllVideos();
  }, []);

  useEffect(() => {
    if (AllVideos?.videos) {
      if (page === 1) {
        // Filter out the current video from suggestions
        const filteredVideos = AllVideos.videos.filter(
          video => video._id !== currentVideoId
        );
        setVideoArray(filteredVideos);
      } else {
        setVideoArray(prev => [...prev, ...AllVideos.videos]);
      }
      setHasMore(page < AllVideos.totalPages);
    }
  }, [AllVideos, currentVideoId]);

  return (
    <div className="w-full">
      {/* Header with subtle separator */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Up Next
        </h3>
        {hasMore && (
          <button 
            onClick={() => setPage(prev => prev + 1)}
            className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
          >
            Show more
          </button>
        )}
      </div>

      {/* Videos grid with responsive layout */}
      <div className="space-y-4 md:space-y-3">
        {videoArray.length > 0 ? (
          videoArray.map((video) => (
            <div 
              key={video._id}
              className="group transition-transform duration-200 hover:-translate-y-0.5"
            >
              <VideoCard 
                video={video} 
                layout="horizontal"  // Add this prop to VideoCard for horizontal layout
              />
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No suggestions available
          </div>
        )}
      </div>

      {/* Loading state */}
      {hasMore && page > 1 && (
        <div className="py-4 text-center">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">
            Loading more videos...
          </div>
        </div>
      )}
    </div>
  );
}
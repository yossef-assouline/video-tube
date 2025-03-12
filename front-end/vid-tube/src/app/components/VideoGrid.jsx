import PublicVideoCard from './PublicVideoCard';
import Spinner from './Spinner';

export default function VideoGrid({ videos, onVideoClick, loader, isFetchingVideos, hasMore }) {
  return (
    <div className="">
      <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {videos?.map((video) => {
          // Ensure we have a unique key, fallback to index if no _id
          const videoId = video?.video?._id || video?._id; // Handle both nested and direct video objects
          
          if (!videoId) {
            console.warn('Video object missing ID:', video);
            return null;
          }

          return (
            <PublicVideoCard 
              key={videoId}
              video={video.video || video} // Handle both nested and direct video objects
              onClick={onVideoClick}
            />
          );
        })}
      </div>
      
      {loader && (
        <div ref={loader} className="flex justify-center py-4">
          {isFetchingVideos && <Spinner />}
        </div>
      )}
      
      {hasMore === false && videos.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          No more videos to load
        </div>
      )}
    </div>
  );
} 
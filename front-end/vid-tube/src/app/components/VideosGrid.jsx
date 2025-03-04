import VideoCard from './VideoCard';

export default function VideosGrid({ videos, onVideoClick }) {
  if (videos.length === 0) {
    return (
      <>
      <hr className='my-4 border-1 border-gray-300'/>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Videos</h2>
        <div className="text-center text-gray-600">No Videos Uploaded</div>
      </div>
      </>
    );
  }

  return (
    <div className="mt-8">
      <hr className='my-4 border-1 border-gray-300'/>
      <h2 className="text-2xl font-bold mb-4">Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard 
            key={video._id} 
            video={video} 
            onClick={onVideoClick}
          />
        ))}
      </div>
    </div>
  );
} 
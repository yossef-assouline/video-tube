import Image from 'next/image';
import { formatDuration } from '../utils/formatDuration';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import { useRouter } from 'next/navigation';

export default function PublicVideoCard({ video, onClick }) {
  const router = useRouter();

  // Handle both nested and direct video objects
  const videoData = video.video || video;
  const owner = videoData.ownerDetails?.[0] || videoData.owner;

  return (
    <div className="video-card">
      <div className='relative'>
        <Image 
          src={videoData.thumbnail} 
          alt={`Thumbnail for ${videoData.title}`}
          className='aspect-video cursor-pointer hover:opacity-90 hover:ring-2 hover:ring-slate-500 transition-all duration-300 object-cover rounded-md' 
          width={400} 
          height={250} 
          onClick={() => onClick(videoData._id)}
        />
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs">
          {formatDuration(videoData.duration)}
        </span>
      </div>
      <div className="flex gap-3 mt-3">
        {owner && (
          <div 
            className="flex-shrink-0 cursor-pointer"
            onClick={() => router.push(`/c/${owner.username}`)}
          >
            <Image
              src={owner.avatar}
              alt={`${owner.fullname || owner.username}'s channel avatar`}
              width={36}
              height={36}
              className="rounded-full hover:opacity-90 object-cover aspect-square"
            />
          </div>
        )}
        <div className="flex flex-col">
          <h3 
            className='font-medium text-sm line-clamp-2 cursor-pointer hover:text-blue-500'
            onClick={() => onClick(videoData._id)}
          >
            {videoData.title}
          </h3>
          {owner && (
            <span 
              className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => router.push(`/c/${owner.username}`)}
            >
              {owner.fullname || owner.username}
            </span>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <span>{videoData.views.toLocaleString()} views</span>
            <span className="mx-1">•</span>
            <span>{formatTimeAgo(new Date(videoData.createdAt))}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
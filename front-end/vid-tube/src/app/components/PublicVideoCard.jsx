import Image from 'next/image';
import { formatDuration } from '../utils/formatDuration';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import { useRouter } from 'next/navigation';

export default function VideoCard({ video, onClick }) {
  const router = useRouter();

  return (
    <div className="video-card">
      <div className='relative'>
        <Image 
          src={video.thumbnail} 
          alt={video.title} 
          className='aspect-video cursor-pointer hover:opacity-90 hover:ring-2 hover:ring-slate-500 transition-all duration-300 object-cover rounded-xl w-2/3' 
          width={500} 
          height={500} 
          onClick={() => onClick(video._id)}
        />
        <span className="absolute bottom-2 left-52  bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
          {formatDuration(video.duration)}
        </span>
      </div>

      <div className="flex gap-3 mt-3">
        {/* Channel Avatar */}
        <div 
          className="flex-shrink-0 cursor-pointer"
          onClick={() => router.push(`/c/${video.owner.username}`)}
        >
          <Image
            src={video.ownerDetails[0].avatar}
            alt={video.ownerDetails[0].username}
            width={36}
            height={36}
            className="rounded-full object-cover aspect-square hover:opacity-90"
          />
        </div>

        {/* Video Details */}
        <div className="flex flex-col">
          <h3 
            className='font-medium text-sm line-clamp-2 cursor-pointer hover:text-blue-500'
            onClick={() => onClick(video._id)}
          >
            {video.title}
          </h3>
          
          <div className="flex flex-col text-[13px] text-gray-500">
            <span 
              className="hover:text-gray-700 cursor-pointer"
              onClick={() => router.push(`/c/${video.owner.username}`)}
            >
              {video.ownerDetails[0].fullName || video.ownerDetails[0].username}
            </span>
            
            <div className="flex items-center">
              <span>{video.views.toLocaleString()} views</span>
              <span className="mx-1">•</span>
              <span>{formatTimeAgo(new Date(video.createdAt))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
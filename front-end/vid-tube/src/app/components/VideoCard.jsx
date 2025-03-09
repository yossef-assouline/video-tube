import Image from 'next/image';
import { formatDuration } from '../utils/formatDuration';

export default function VideoCard({ video, onClick }) {
  return (
    <div className="video-card h-60 w-60">
      <div className='relative'>
        <Image 
          src={video.thumbnail} 
          alt={video.title} 
          className='aspect-video cursor-pointer hover:opacity-90 hover:ring-2 hover:ring-slate-500 transition-all duration-300 object-cover rounded-md' 
          width={250} 
          height={250} 
          onClick={() => onClick(video._id)}
        />
        <span className="absolute bottom-2 left-48  bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
          {formatDuration(video.duration)}
        </span>
      </div>
      <h3 
        className='text-md font-bold mt-2 hover:text-blue-500 cursor-pointer'
        onClick={() => onClick(video._id)}
      >
        {video.title}
      </h3>
      <p className='text-sm text-gray-500'>{video.views} views</p>
    </div>
  );
} 
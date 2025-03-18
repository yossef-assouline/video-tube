import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useActionStore } from '../store/actionStore.js';
import { useState } from 'react';
import SubscribeButton from './SubscribeButton.jsx';
import LikeButton from './LikeButton.jsx';
import ViewCount from './ViewCount.jsx';


export default function VideoInfo({ video, user, isSubscribed, setIsSubscribed }) {
  const router = useRouter();
  const { toggleLike, toggleSubscribe } = useActionStore();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold">{video.title}</h1>
      <div className="flex items-center justify-between mt-4">
        <ChannelInfo 
          owner={video.owner[0]}
          user={user}
          isSubscribed={isSubscribed}
          setIsSubscribed={setIsSubscribed}
          toggleSubscribe={toggleSubscribe}
          subscribers={video.subscribers}
        />
        
      <VideoStats 
          video={video}
          toggleLike={toggleLike}
        />
        
      </div>
      <div>
      <VideoDescription description={video.description} />
      </div>
    </div>
  );
}

function ChannelInfo({ owner, user, isSubscribed, setIsSubscribed, toggleSubscribe , subscribers }) {
  const router = useRouter();
  
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Image
        onClick={() => router.push(`/c/${owner.username}`)}
        src={owner.avatar || "/default-avatar.jpg"}
        alt={owner.username}
        width={40}
        height={40}
        className="rounded-full cursor-pointer aspect-square"
      />
      <div>
        <h3 className="font-semibold">{owner.username}</h3>
        <p className="text-sm text-gray-500">{subscribers} subscribers</p>
      </div>
      {owner._id !== user?._id && (
        <SubscribeButton 
          channelId={owner._id}
          isSubscribed={isSubscribed}
          onSubscribe={() => {
            toggleSubscribe(owner._id);
            setIsSubscribed(!isSubscribed);
          }}
        />
      )}
    </div>
  );
}

function VideoStats({ video, toggleLike }) {
  return (
    <div className="flex items-center  gap-4">
      <div className="flex items-center   border  bg-green-200 rounded-full px-3 h-8">
      <LikeButton 
        initialLikes={video.likes}
        isInitiallyLiked={video.isLiked}
        onLike={() => toggleLike(video._id)}
      />
      </div>
      <div className="flex items-center gap-2 bg-green-200 rounded-full border px-3 h-8">
      <ViewCount views={video.views} />
      </div>
    </div>
  );
}

function VideoDescription({ description }) {
  return (
    <div className="mt-4 bg-gray-100 p-4 rounded-lg">
      <p className="whitespace-pre-wrap">{description}</p>
    </div>
  );
}
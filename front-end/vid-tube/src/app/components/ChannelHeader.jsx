import Image from 'next/image';
import SubscribeButton from './SubscribeButton';
export default function ChannelHeader({ 
  channelData, 
  videos, 
  isSubscribed, 
  onSubscribe, 
  isOwnChannel 
}) {
  return (
    <>
      <div className="relative w-full h-[200px] mt-6 ">
        <Image
          src={channelData.coverImage || "/default-banner.jpg"}
          alt="Channel Banner"
          layout="fill"
          objectFit="cover"
          className="w-full h-full  rounded-xl "
        />
      </div>

      <div className="max-w-6xl flex flex-col px-4">
        <div className="flex md:flex-row items-start mt-4 gap-4">
          <div className="rounded-full border-4 border-white overflow-hidden  ">
            <Image
              src={channelData.avatar || "/default-avatar.jpg"}
              alt="Channel Avatar"
              width={120}
              height={100}
              className="rounded-full object-cover aspect-square"
            />
          </div>

          <div className="flex-1 mt-2">
            <h1 className="text-2xl font-bold">{channelData.fullname}</h1>
            <p className="text-gray-600">@{channelData.username}</p>
            <div className="flex gap-2">
              <div>
                <span className="font-bold">{channelData.subscribersCount || 0}</span>{" "}
                <span className="text-gray-600">subscribers</span>
              </div>
              <div>
                <span className="font-bold">{videos.length || 0}</span>{" "}
                <span className="text-gray-600">videos</span>
              </div>
            </div>
        </div>
      </div>
            {!isOwnChannel && (
              <SubscribeButton 
                variant="full"
                isSubscribed={isSubscribed}
                onSubscribe={onSubscribe}
              />
            )}
          </div>
    </>
  );
}
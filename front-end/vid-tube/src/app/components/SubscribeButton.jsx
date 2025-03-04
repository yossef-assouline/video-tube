"use client"

export default function SubscribeButton({ 
  channelId, 
  isSubscribed, 
  onSubscribe, 
  variant = 'classic' // 'classic' or 'full'
}) {
  const variants = {
    classic: "ml-4 px-4 py-2 rounded-full text-sm",
    full: "w-full px-4 py-2 rounded-full text-base mt-4"
  };

  return (
    <button
      onClick={onSubscribe}
      className={`
        ${variants[variant]}
        transition-colors duration-300 font-medium
        ${isSubscribed 
          ? "bg-gray-200 hover:bg-gray-300 text-gray-800" 
          : "bg-emerald-500 hover:bg-emerald-600 text-white"
        }
      `}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}

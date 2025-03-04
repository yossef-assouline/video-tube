"use client"
import { useState, useEffect } from 'react';
import { formatCount } from '../utils/formatCount';

export default function LikeButton({ initialLikes = 0, isInitiallyLiked = false, onLike }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [animateLike, setAnimateLike] = useState(false);

  const handleLike = async () => {
    // Trigger animation
    setAnimateLike(true);
    
    // Optimistically update UI
    const newLikeCount = isLiked ? likes - 1 : likes + 1;
    setLikes(newLikeCount);
    setIsLiked(!isLiked);

    try {
      // Make API call
      await onLike();
    } catch (error) {
      // If API call fails, revert the optimistic update
      setLikes(likes);
      setIsLiked(isLiked);
      console.error('Failed to update like:', error);
    }
  };

  // Handle animation reset
  useEffect(() => {
    if (animateLike) {
      const timer = setTimeout(() => setAnimateLike(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animateLike]);

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 group"
    >
      <svg
        className={`w-6 h-6 transition-all duration-200 ${
          animateLike ? 'scale-125' : ''
        } ${
          isLiked ? 'text-emerald-500' : 'text-gray-500 group-hover:text-emerald-500'
        }`}
        fill={isLiked ? "currentColor" : "none"}
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
      <span className={`${
        isLiked ? 'text-emerald-500' : 'text-gray-500'
      } font-medium transition-colors duration-200`}>
        {formatCount(likes)}
      </span>
    </button>
  );
} 
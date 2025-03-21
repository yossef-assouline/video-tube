"use client"
import { useState, useEffect } from 'react';
import { formatCount } from '../utils/formatCount';
import { ThumbsUp } from 'lucide-react';

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
      className="flex  gap-2 group"
    >
      <ThumbsUp 
        className={`transition-all duration-200 ${
          animateLike ? 'scale-125' : ''
        } ${
          isLiked 
            ? 'text-emerald-500 ' 
            : 'text-black hover:text-emerald-500'
        }`}
        size={20}
      />
      <span className={`${
        isLiked ? 'text-emerald-500' : 'text-black'
      } font-medium transition-colors duration-200`}>
        {formatCount(likes)}
      </span>
    </button>
  );
} 
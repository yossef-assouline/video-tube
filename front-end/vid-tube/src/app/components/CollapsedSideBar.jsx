"use client"
import { User, History, ThumbsUp, House } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CollapsedSideBar({ user }) {
  const router = useRouter();

  const sidebarItems = [
    { 
      icon: <House size={20} />, 
      label: 'Home', 
      path: '/home'
    },
    { 
      icon: <User size={20} />, 
      label: 'Profile', 
      path: '/profile' 
    },
    { 
      icon: <History size={20} />, 
      label: 'History', 
      path: '/watch-history' 
    },
    { 
      icon: <ThumbsUp size={20} />, 
      label: 'Liked', 
      path: '/liked-videos' 
    },
  ];

  return (
    <div className="fixed left-0 top-[64px] h-[calc(100vh-64px)] w-16 bg-white dark:bg-[#0f0f0f] border-r border-gray-200 dark:border-gray-800 z-40">
      <div className="flex flex-col items-center py-4 space-y-8">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            onClick={() => router.push(item.path)}
            className="flex flex-col items-center w-full px-2 gap-1 hover:bg-gray-100 dark:hover:bg-[#272727] py-2"
          >
            <div className="text-gray-700 dark:text-gray-200">
              {item.icon}
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-200">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

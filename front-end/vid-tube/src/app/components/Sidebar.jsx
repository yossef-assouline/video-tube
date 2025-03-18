"use client"
import { User, Video, History, PlaySquare, ThumbsUp, ListVideo, House } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar({ user, subscribedChannels, isOpen, isMobile, onClose }) {
  const router = useRouter();
  const pathname = usePathname();

  const sidebarItems = [
    { icon: <House size={20} />, label: 'Home', path: '/home' },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
    { icon: <Video size={20} />, label: 'My Channel', path: `/c/${user?.username}` },
    { icon: <PlaySquare size={20} />, label: 'Dashboard', path: `/dashboard/${user?.username}` },
    
    { 
      heading: 'Library',
      items: [
        { icon: <History size={20} />, label: 'History', path: '/watch-history' },
        { icon: <ThumbsUp size={20} />, label: 'Liked Videos', path: '/liked-videos' },
      ]
    },
    subscribedChannels?.length > 0 && {
      heading: 'Subscriptions',
      items: subscribedChannels.map(channel => ({
        icon: <img 
          src={channel.avatar} 
          alt={channel.username}
          className="w-6 h-6 rounded-full object-cover"
        />,
        label: channel.fullname || channel.username,
        path: `/c/${channel.username}`
      }))
    }
  ].filter(Boolean);

  const isSelected = (path) => {
    // For exact matches
    if (path === pathname) return true;
    
    // For channel pages
    if (path.startsWith('/c/') && pathname.startsWith('/c/')) {
      return path.split('/')[2] === pathname.split('/')[2];
    }
    
    return false;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => onClose()}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed top-16 bottom-0 left-0 z-30
          w-64 dark:bg-[#0f0f0f] shadow-md border-gray-200 dark:border-gray-800 bg-white/80 backdrop-blur-sm 
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isMobile ? 'lg:hidden' : 'hidden lg:block'}
        `}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-4 space-y-6">
            {sidebarItems.map((item, index) => (
              <div key={index}>
                {item.heading ? (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium dark:text-gray-400 px-3">
                      {item.heading}
                    </h3>
                    <hr className='border-gray-200 dark:border-gray-800' />
                    {item.items.map((subItem, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() => router.push(subItem.path)}
                        className={`
                          flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg
                          transition-colors
                          ${isSelected(subItem.path) 
                            ? 'bg-emerald-100 dark:bg-[#272727] text-emerald-600 font-medium' 
                            : 'hover:bg-gray-100 dark:hover:bg-[#272727]'}
                        `}
                      >
                        <div className={`w-6 h-6 flex-shrink-0 ${isSelected(subItem.path) ? 'text-emerald-600' : ''}`}>
                          {subItem.icon}
                        </div>
                        <span className="truncate">{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => router.push(item.path)}
                    className={`
                      flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg
                      transition-colors
                      ${isSelected(item.path) 
                        ? 'bg-emerald-100 dark:bg-[#272727] text-emerald-600 font-medium' 
                        : 'hover:bg-gray-100 dark:hover:bg-[#272727]'}
                    `}
                  >
                    <div className={`${isSelected(item.path) ? 'text-emerald-600' : ''}`}>
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
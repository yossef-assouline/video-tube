import { User, Video, History, PlaySquare, ThumbsUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Sidebar({ user, subscribedChannels }) {
  const router = useRouter();

  const sidebarItems = [
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

  return (
    <div className="hidden xl:flex flex-col w-64 fixed h-[calc(100vh-64px)] bg-gradient-to-b border-r border-black dark:bg-[#0f0f0f] overflow-y-auto">
      <div className="p-4 space-y-6">
        {sidebarItems.map((item, index) => (
          <SidebarItem key={index} item={item} onClick={(path) => router.push(path)} />
        ))}
      </div>
    </div>
  );
}

function SidebarItem({ item, onClick }) {
  if (item.heading) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium dark:text-gray-400 px-3">
          {item.heading}
        </h3>
        <hr className='border-emerald-800' />
        {item.items.map((subItem, index) => (
          <button
            key={index}
            onClick={() => onClick(subItem.path)}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-[#272727] transition-colors"
          >
            <div className="w-6 h-6 flex-shrink-0">
              {subItem.icon}
            </div>
            <span className="truncate">{subItem.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <button
      onClick={() => onClick(item.path)}
      className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-[#272727] transition-colors"
    >
      {item.icon}
      <span>{item.label}</span>
    </button>
  );
} 
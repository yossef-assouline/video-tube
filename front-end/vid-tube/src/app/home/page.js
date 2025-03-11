"use client"
import { useEffect, useState, useCallback, useRef } from 'react';
import { useActionStore } from '../store/actionStore';
import { useRouter } from 'next/navigation';
import NavBar from '../components/NavBar';
import Spinner from '../components/Spinner';
import PublicVideoCard from '../components/PublicVideoCard';
import {  User, Video, History, PlaySquare, ThumbsUp, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
export default function HomePage() {
  const router = useRouter();
  const { AllVideos, isFetchingVideos, fetchAllVideos } = useActionStore();
  const { user } = useAuthStore();
  const [videoArray, setVideoArray] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  // Initial fetch
  useEffect(() => {
    fetchAllVideos();
  }, []);
  useEffect(() => {
    console.log(AllVideos)
  }, [AllVideos]);

  // Update videos when AllVideos changes
  useEffect(() => {
    if (AllVideos?.videos) {
      if (page === 1) {
        setVideoArray(AllVideos.videos);
      } else {
        setVideoArray(prev => [...prev, ...AllVideos.videos]);
      }
      setHasMore(page < AllVideos.totalPages);
    }
  }, [AllVideos]);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isFetchingVideos) {
      setPage(prev => prev + 1);
      fetchAllVideos(page + 1);
    }
  }, [hasMore, isFetchingVideos, page]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [handleObserver]);

  const sidebarItems = [
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
    { icon: <Video size={20} />, label: 'My Channel', path: `/c/${user?.username}` },
    { icon: <PlaySquare size={20} />, label: 'Dashboard', path: `/dashboard/${user?.username}` },
    { 
      heading: 'Library',
      items: [
        { icon: <History size={20} />, label: 'History', path: '/history' },
        { icon: <ThumbsUp size={20} />, label: 'Liked Videos', path: '/liked-videos' },
      ]
    },
    {
      heading: 'Subscriptions',
      items: [
        { 
          icon: <img src="https://placekitten.com/32/32" className="w-6 h-6 rounded-full" />, 
          label: 'Tech Channel', 
          path: '/c/tech' 
        },
        { 
          icon: <img src="https://placekitten.com/33/33" className="w-6 h-6 rounded-full" />, 
          label: 'Gaming Channel', 
          path: '/c/gaming' 
        },
        { 
          icon: <img src="https://placekitten.com/34/34" className="w-6 h-6 rounded-full" />, 
          label: 'Music Channel', 
          path: '/c/music' 
        },
      ]
    }
  ];

  if (!videoArray?.length) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <NavBar />
        <div className="flex justify-center items-center h-[50vh]">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="flex ">
        {/* Sidebar */}
        <div className="hidden xl:flex flex-col w-64 fixed h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-300 to-emerald-800 dark:bg-[#0f0f0f] overflow-y-auto">
          <div className="p-4 space-y-6">
            {sidebarItems.map((item, index) => (
              <div key={index}>
                {item.heading ? (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium dark:text-gray-400 px-3">
                      {item.heading}
                    </h3>
                    <hr className='border-emerald-800'></hr>
                    {item.items.map((subItem, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() => router.push(subItem.path)}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-emerald-100 dark:hover:"
                      >
                        {subItem.icon}
                        <span>{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => router.push(item.path)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-emerald-100 dark:hover:bg-[#272727]"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 xl:ml-64 pt-8">
          <div className="flex justify-center p-4">
            <div className="">
              <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {videoArray?.map((video) => (
                  <PublicVideoCard 
                    key={video._id}
                    video={video}
                    onClick={(videoId) => router.push(`/watch/${videoId}`)}
                  />
                ))}
              </div>
              
              <div ref={loader} className="flex justify-center py-4">
                {isFetchingVideos && <Spinner />}
              </div>
              
              {!hasMore && videoArray.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                  No more videos to load
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



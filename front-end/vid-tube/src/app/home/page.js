"use client"
import { useEffect, useState, useCallback, useRef } from 'react';
import { useActionStore } from '../store/actionStore';
import { useRouter } from 'next/navigation';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import VideoGrid from '../components/VideoGrid';
import Spinner from '../components/Spinner';
import { useAuthStore } from '../store/authStore';
import PublicVideoCard from '../components/PublicVideoCard';
import CollapsedSideBar from '../components/CollapsedSideBar';

export default function HomePage() {
  const router = useRouter();
  const { AllVideos, isFetchingVideos, fetchAllVideos, getSubscribedChannels, subscribedChannels } = useActionStore();
  const { user , isAuthenticated  } = useAuthStore();
  const [subscribedChannelsArray, setSubscribedChannelsArray] = useState([]);
  const [videoArray, setVideoArray] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initial fetch
  useEffect(() => {
    fetchAllVideos();
  }, []);
  useEffect(() => {
    if (user?._id) {
      getSubscribedChannels(user._id);
    }
  }, [user]);
  useEffect(() => {
    setSubscribedChannelsArray(subscribedChannels);
  }, [subscribedChannels]);

  

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

  // Updated window resize handler
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      setIsSidebarOpen(width >= 1280);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!videoArray?.length) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <NavBar toggleSidebar={toggleSidebar} />
        <div className="flex justify-center items-center h-[50vh]">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <NavBar toggleSidebar={toggleSidebar} />
      
      <Sidebar 
        user={user}
        subscribedChannels={subscribedChannels}
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className={`${isSidebarOpen ? 'hidden' : 'block'} xl:hidden`}>

      <CollapsedSideBar user={user} />
      </div>

      {/* Main Content */}
      <div className={`
        pt-16 pl-16 transition-all duration-300
        ${isSidebarOpen && !isMobile ? 'lg:ml-64' : ''}
      `}>
        <div className="flex justify-center p-4">
          <VideoGrid 
            videos={videoArray}
            onVideoClick={(videoId) => router.push(`/watch/${videoId}`)}
            loader={loader}
            isFetchingVideos={isFetchingVideos}
            hasMore={hasMore}
          />
        </div>
      </div>
    </div>
  );
}



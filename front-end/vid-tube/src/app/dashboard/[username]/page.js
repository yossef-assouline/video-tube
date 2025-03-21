"use client"
import { useEffect, useState } from 'react';
import { useActionStore } from '../../store/actionStore';
import { useAuthStore } from '../../store/authStore';
import { useRouter, useParams } from 'next/navigation';
import NavBar from '../../components/NavBar';
import Spinner from '../../components/Spinner';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import Image from 'next/image';
import EditVideoModal from '../../components/EditVideoModal';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { username } = useParams();
  const { user, checkAuth } = useAuthStore();
  const { isLoading, error, videos, deleteVideo, findChannel, updateVideo } = useActionStore();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // First check authentication
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } finally {
        setIsAuthChecking(false);
      }
    };
    verifyAuth();
  }, []);

  // Then check if user has access to this dashboard
  useEffect(() => {
    if (!isAuthChecking) {
      if (!user) {
        router.push('/'); // Redirect to home if not logged in
        return;
      }

      if (user.username !== username) {
        router.push(`/dashboard/${user.username}`); // Redirect to user's own dashboard
        return;
      }

      // If user is authenticated and authorized, fetch their channel data
      findChannel(username);
    }
  }, [user, username, isAuthChecking]);

  // Show loading state while checking auth
  if (isAuthChecking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Show loading state while fetching data
  if (isAuthChecking) return <Spinner />;
  
  // Show error if any
  if (error) return <div className="text-red-500">{error}</div>;

  const handleEditClick = (video) => {
    setVideoToEdit(video);
    setShowEditModal(true);
  };

  const handleEditConfirm = async (editedData) => {
    try {
      await updateVideo(videoToEdit._id, editedData);
      findChannel(username);
      setShowEditModal(false);
      setVideoToEdit(null);
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteVideo(videoToDelete._id);
      findChannel(username);
      setShowDeleteModal(false);
      setVideoToDelete(null);
      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  const handleWatchVideo = (videoId) => {
    router.push(`/watch/${videoId}`);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black">
      <NavBar />
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-60 h-screen bg-white border-r">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Channel dashboard</h2>
          </div>
          <div className="flex flex-col p-2">
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 text-black">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Content
            </button>
            {/* Add more sidebar items as needed */}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <div className="p-6">
            

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <input
                  type="search"
                  placeholder="Search videos"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Visibility</option>
                  <option>Public</option>
                  <option>Private</option>
                </select>
              </div>
            </div>

            {/* Videos List */}
            <div className="bg-white rounded-lg shadow">
              {/* Table Header */}
              <div className="grid grid-cols-12 p-4 border-b text-sm font-medium text-gray-500">
                <div className="col-span-6">Video</div>
                <div className="col-span-2 text-right">Visibility</div>
                <div className="col-span-2 text-right">Views</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Video Items */}
              {videos.map((video) => (
                <div key={video._id} className="grid grid-cols-12 p-4 border-b hover:bg-gray-50">
                  <div className="col-span-6">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-14 flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-medium line-clamp-2">{video.title}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      video.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {video.isPublished ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end text-sm">
                    {video.views.toLocaleString()}
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(video)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(video)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {videos.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No videos found. Start creating to see them here!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <DeleteConfirmationModal 
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setVideoToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title={videoToDelete?.title}
        />

        <EditVideoModal 
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setVideoToEdit(null);
          }}
          onConfirm={handleEditConfirm}
          video={videoToEdit}
        />
      </div>
    </div>
  );
}
  




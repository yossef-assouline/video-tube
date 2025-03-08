"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Spinner from './Spinner';

export default function EditVideoModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  video 
}) {
  const [isPublished, setIsPublished] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update states when video changes or modal opens
  useEffect(() => {
    if (video && isOpen) {
      setIsPublished(video.isPublished);
      setPreviewUrl(video.thumbnail);
    }
  }, [video, isOpen]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      // Create preview URL for the new image
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', e.target.title.value);
      formData.append('description', e.target.description.value);
      formData.append('visibility', isPublished ? 'public' : 'private');
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }
      
      await onConfirm(formData);
      toast.success('Video updated successfully');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to update video');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Video</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Thumbnail Section */}
          <div className='flex flex-col justify-center items-center gap-4'>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail
            </label>
            <div className="flex flex-col justify-center items-center gap-4">
              {/* Current/Preview Thumbnail */}
              <div className="relative w-60 aspect-video rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={previewUrl || video.thumbnail}
                  alt="Video thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Upload New Thumbnail */}
              <div className="flex items-center justify-center">
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <div className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                    <span className="text-sm text-gray-600">Change thumbnail</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Existing Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              name="title"
              type="text"
              defaultValue={video.title}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={video.description}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${
                  isPublished ? 'bg-emerald-500' : 'bg-gray-300'
                }`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                  isPublished ? 'translate-x-4' : 'translate-x-0'
                }`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {isPublished ? 'Public' : 'Private'}
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="w-4 h-4" />
                  <span>Updating...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
            <Spinner className="w-8 h-8" />
          </div>
        )}
      </div>
    </div>
  );
} 
"use client"
import { useState } from 'react';
import Image from 'next/image';
import { useActionStore } from '../store/actionStore';
import { toast } from 'react-hot-toast';

export default function UploadVideoModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const { publishVideo, isLoading, error } = useActionStore();
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setStep(2);
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('videoFile', videoFile);
    formData.append('thumbnail', thumbnail);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('visibility', isPublic ? 'public' : 'private');

    try {
      // Add your API call here to upload the video
      const videoData = await publishVideo(formData);
      if(videoData){
        toast.success('Video uploaded successfully');
      // Reset form and close modal on success
      onClose();
      setStep(1);
      setVideoFile(null);
      setThumbnail(null);
      setTitle('');
      setDescription('');
      setIsPublic(true);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-100">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upload Video</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {step === 1 ? (
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="videoInput"
                />
                <label
                  htmlFor="videoInput"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-gray-600">Click to select a video</span>
                </label>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`block w-10 h-6 rounded-full ${isPublic ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${isPublic ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {isPublic ? 'Public' : 'Private'}
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md"
                >
                  Upload
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
} 
import React, { useContext, useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash2, LuCamera } from 'react-icons/lu';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { motion } from 'framer-motion';
import CharAvatar from '../Cards/CharAvatar';

const ProfileImageManager = ({ size = "w-20 h-20", showButtons = true, className = "" }) => {
  const { user, updateUserAvatar } = useContext(UserContext);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Add timestamp to image URL to prevent caching issues
  const getImageUrl = (url) => {
    if (!url) return null;
    return `${url}?t=${Date.now()}`;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload image to server
      const uploadRes = await uploadImage(file);
      const imageUrl = uploadRes?.imageUrl;
      
      if (!imageUrl) {
        throw new Error('Image upload failed');
      }

      // Update profile in database
      const { data: updatedUser } = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE_IMAGE,
        { profileImageUrl: imageUrl }
      );

      // Update context with cache-busting URL
      updateUserAvatar(getImageUrl(updatedUser.profileImageUrl));
      
    } catch (err) {
      console.error('Failed to update profile image', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageRemove = async () => {
    if (!user?.profileImageUrl) return;

    setIsRemoving(true);
    try {
      // Remove image from database
      await axiosInstance.delete(API_PATHS.AUTH.REMOVE_PROFILE_IMAGE);
      
      // Update context to remove image
      updateUserAvatar("");
      
    } catch (err) {
      console.error('Failed to remove profile image', err);
      alert('Failed to remove image. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  const onChooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Profile Image Container */}
      <div className="relative">
        {user?.profileImageUrl ? (
          <motion.img
            key={user.profileImageUrl} // Force re-render when URL changes
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={getImageUrl(user.profileImageUrl)}
            alt="Profile Image"
            className={`${size} bg-slate-400 rounded-full object-cover border-2 border-gray-200 shadow-sm ${
              isUploading ? 'opacity-50' : ''
            }`}
            onError={(e) => {
              // Fallback to CharAvatar if image fails to load
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className={`${size} flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full border-2 border-gray-200 shadow-sm`}>
            <CharAvatar
              firstName={user?.firstName}
              lastName={user?.lastName}
              width={size.split(' ')[0]}
              height={size.split(' ')[1]}
              style="text-xl"
            />
          </div>
        )}

        {/* Loading Overlay */}
        {(isUploading || isRemoving) && (
          <div className={`absolute inset-0 ${size} bg-black bg-opacity-50 rounded-full flex items-center justify-center`}>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {showButtons && (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onChooseFile}
            disabled={isUploading || isRemoving}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {user?.profileImageUrl ? <LuCamera size={16} /> : <LuUpload size={16} />}
            {user?.profileImageUrl ? 'Change' : 'Upload'}
          </motion.button>

          {user?.profileImageUrl && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleImageRemove}
              disabled={isUploading || isRemoving}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LuTrash2 size={16} />
              Remove
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileImageManager;

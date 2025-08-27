import React, { useContext, useRef } from 'react'
import { SIDE_MENU_DATA } from '../../utils/data'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom';
import CharAvatar from '../Cards/CharAvatar';
import uploadImage from '../../utils/uploadImage';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser, updateUserAvatar } = useContext(UserContext); 
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const uploadRes = await uploadImage(file);
      const imageUrl = uploadRes?.imageUrl;
      if (!imageUrl) return;
      const { data: updatedUser } = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE_IMAGE,
        { profileImageUrl: imageUrl }
      );
      // Persist full user
      updateUser(updatedUser);
    } catch (err) {
      console.error('Failed to update profile image', err);
    }
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7 ">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleAvatarChange}
        />

        {/* Avatar Image / CharAvatar */}
        <div
          className="relative cursor-pointer"
          onClick={() => fileInputRef.current.click()} // clicking avatar opens file picker
        >
          {user?.profileImageUrl ? (
            <img
              src={user?.profileImageUrl || ""}
              alt="Profile Image"
              className="w-20 h-20 bg-slate-400 rounded-full object-cover"
            />
          ) : (
            <CharAvatar
              firstName={user?.firstName}
              lastName={user?.lastName}
              width="w-20"
              height="h-20"
              style="text-xl"
            />
          )}
        </div>
       
        <h6 className="text-gray-950 font-medium leading-6">
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.firstName || user?.lastName || ""}
        </h6>
      </div>

      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu == item.label ? "text-white bg-primary" : ""
          } py-3 px-6 rounded-lg mb-3`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;

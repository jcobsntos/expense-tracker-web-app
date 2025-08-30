import React from 'react';
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from './SideMenu';

const Navbar = ({ activeMenu, openSideMenu, setOpenSideMenu }) => {
  return (
    <div className="flex gap-5 bg-white dark:bg-gray-800 border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 transition-colors duration-200">
      <button
        className="text-black dark:text-white block transition-colors duration-200"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
      </button>

      <h2 className="text-lg font-medium text-black dark:text-white transition-colors duration-200">Expense Tracker</h2>

      {/* SideMenu with slide animation */}
      <div
        className={`fixed top-[61px] left-0 h-[calc(100vh-61px)] w-64 bg-white dark:bg-gray-800 z-20 shadow-md transform transition-all duration-300 ease-in-out
          ${openSideMenu ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SideMenu activeMenu={activeMenu} />
      </div>
    </div>
  );
};

export default Navbar;

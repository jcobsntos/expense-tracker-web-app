import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const [openSideMenu, setOpenSideMenu] = useState(true); // move state here

  return (
    <div className="">
      {/* Pass state and setter to Navbar */}
      <Navbar
        activeMenu={activeMenu}
        openSideMenu={openSideMenu}
        setOpenSideMenu={setOpenSideMenu}
      />

      {user && (
        <div className="flex">
          {/* Desktop side menu */}
          <div className="max-[2160px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main content shifts when menu is open */}
          <div
            className="grow mx-5 transition-all duration-500"
            style={{
              marginLeft: openSideMenu ? '20rem' : '0', // shift content when side menu opens
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;

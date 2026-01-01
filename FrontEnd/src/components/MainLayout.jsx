import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'
import Header from './Header';

function Mainlayout() {
  return (
<div className="flex flex-col h-screen w-full  overflow-hidden">
  
  <div className="h-16 bg-white border-b border-gray-200 flex-shrink-0">
    <Header />
  </div>


  <div className="flex flex-1 overflow-hidden">
    

    <div className="w-64 h-full bg-white border-r border-gray-200 flex-shrink-0">
      <LeftSideBar />
    </div>


    <div className="flex-1 h-full overflow-y-auto">
      <Outlet />
    </div>

  </div>

</div>
  );
}

export default Mainlayout

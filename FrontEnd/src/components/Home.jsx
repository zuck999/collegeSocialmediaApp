import React from "react";
import Feed from "./Feed";
import RightSidebar from "./RightSideBar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import "../App.css";
import Birthdays from "./Birthdays";
import UpcomingEvents from "./UpcomingEvents";

function Home() {
  useGetAllPost();
  useGetSuggestedUsers();

  return (
    <div className="flex h-full w-full bg-gray-100 min-w-[1000px]">
      
      <div className="flex-1 h-full overflow-y-auto scrollbar-hide p-4">

        <div className="max-w-3xl mx-auto w-full  min-h-screen">
          <Feed />
        </div>
      </div>

      <div className="w-[270px] h-full  py-4 flex flex-col gap-4">
        <div className="bg-white rounded-lg p-4 border-gray-200 shadow-sm flex-1 overflow-hidden">
          <UpcomingEvents />
        </div>
        <div className="bg-white rounded-lg p-4 border-gray-200 shadow-sm flex-1 overflow-hidden">
          <Birthdays />
        </div>
      </div>

      <div className="w-72 h-full bg-white border-l ml-4  border-gray-200 flex-shrink-0 overflow-y-auto scrollbar-hide">
        <RightSidebar />
      </div>

    </div>
  );
}

export default Home;
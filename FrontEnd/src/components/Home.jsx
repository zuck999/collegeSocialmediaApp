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
  console.log(useGetAllPost());
  useGetSuggestedUsers();

  return (
    <div className="flex h-full w-full bg-gray-100 min-w-[1000px]">
      
      {/* COLUMN 1: THE FEED (The "Rubber Band" section) */}
      <div className="flex-1 h-full overflow-y-auto scrollbar-hide p-4">
        {/* FIXED HERE: Added max-w-3xl (about 768px) and mx-auto.
           This keeps the feed from getting too "fat" on big screens.
        */}
        <div className="max-w-3xl mx-auto w-full  min-h-screen">
          <Feed />
        </div>
      </div>

      {/* COLUMN 2: EVENTS & BIRTHDAYS (Stays 320px wide) */}
      <div className="w-[270px] h-full overflow-y-auto scrollbar-hide py-4 flex flex-col gap-4">
        <div className="bg-white rounded-lg p-4  border-gray-200 shadow-sm flex-1">
          <UpcomingEvents />
        </div>
        <div className="bg-white rounded-lg p-4  border-gray-200 shadow-sm flex-1">
          <Birthdays />
        </div>
      </div>

      {/* COLUMN 3: RIGHT SIDEBAR (Glued to the edge!) */}
      <div className="w-72 h-full bg-white border-l ml-4  border-gray-200 flex-shrink-0 overflow-y-auto scrollbar-hide">
        <RightSidebar />
      </div>

    </div>
  );
}

export default Home;
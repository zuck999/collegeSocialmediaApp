
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

function AllUsers() {
  const { suggestedUsers } = useSelector(store=>store.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm gap-3">
        <h1 className=" font-semibold text-gray-600"> All logined users </h1>
        <span className="font-medium cursor-pointer">...</span>
      </div>

      {
      suggestedUsers.map((user) => {
        return (
          <div key={user._id} className=" flex items-center justify-between my-4   p-2 border rounded-lg px-20 py-4">
            <div>
              <div className="flex items-center gap-4">
                <Link to={`/profile/${user?._id}`}>
                  <Avatar>
                    <AvatarImage src={user?.profilepicture} alt="post_Image" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex  gap-2">
                  <Link to={`/profile/${user?._id}`}>
                    <h1>{user?.username}</h1>
                  </Link>
                  <span>
                    <Badge className="px-1 bg-blue-300 ">{user?.faculty}</Badge>
                  </span>
                </div>
                <span className="text-[#f45555] text-sm font-bold cursor-pointer hover:text-[#d57070] pl-10">Delete user</span>
              </div>
            </div>
          </div>
        );
      })
      }
    </div>
  );
}

export default AllUsers;


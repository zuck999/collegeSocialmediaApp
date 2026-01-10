import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";


function SuggestedUsers() {
  const altImg = "https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg";
  const { suggestedUsers } = useSelector(store=>store.auth);

  const shortName = (username)=>{
      if(!username) return "";
      return username.length > 11 ? `${username.slice(0, 9)}...` : username;
  }

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm gap-3">
        <h1 className=" font-semibold text-gray-600">suggested friends </h1>
        <span className="font-medium cursor-pointer">...</span>
      </div>

      {
      suggestedUsers.map((user) => {
        console.log("user>>>>>",user)
        return (
          <div key={user._id} className=" flex items-center justify-between my-4  p-2 border rounded-lg max-w-[28vw]">
            <div >
              <div className="flex items-center gap-4">
                <Link to={`/profile/${user?._id}`}>
                  <Avatar>
                    <AvatarImage src={user?.profilePicture || altImg} alt="post_Image" />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex  gap-2">
                  <Link to={`/profile/${user?._id}`}>
                    <h1 className="font-bold">{shortName(user?.username)}</h1>
                  </Link>
                  <span>
                    <Badge className="px-1 bg-sky-800 py-0">{user?.faculty}</Badge>
                  </span>
                </div>
              </div>
            </div>
                <span className="  text-xs text-sky-700  cursor-pointer hover:text-stone-400 ml-1  px-1 py-0 ">+Add Friend </span>
          </div>
        );
      })
      }
    </div>
  );
}

export default SuggestedUsers;

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'


function RightSideBar() {
  const altImg = "https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg";
  const {user} = useSelector((store)=>store.auth);
  return (
    <div className="w-fit  mr-20 mt-5 max-h-[70vh]">   
            <div className="flex items-center gap-2">
            <Link to={`/profile/${user?._id}`}>
            <Avatar>
              <AvatarImage src={user?.profilepicture || altImg} alt="post_Image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            </Link>

            <div className="flex items-center gap-3">
              <Link to={`/profile/${user?._id}`}><h1>{user?.username}</h1></Link>
            <span><Badge variant='secondary'>{user?.faculty}</Badge></span>
            </div>
          </div>

          {
            user?._id != "64891aefd53c9e0aaf2b91a7" ? 
            (
              <SuggestedUsers/>
            ):
            (
              ""
            )
          }
    </div>
  )
}

export default RightSideBar;

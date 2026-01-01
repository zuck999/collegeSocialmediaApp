import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";

function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const  {userprofile ,user}  = useSelector((store) => store.auth);


  const isLoginUserProfile = user?._id == userprofile?._id;
  const isFriend = false;
  const [ activeTab , setActiveTag] = useState('post');
  
  
  function handleTabChange(tab){
    setActiveTag(tab);
  }
  
  
  // const displayedPost = activeTab==='post' ? userprofile?.post : userprofile?.bookmarks
  const displayedPost =  userprofile?.post || [];


  return (
    <div className="flex max-w-4xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userprofile?.profilePicture}alt="profilephoto"/>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
              <span>{userprofile?.username}</span>
              {
                isLoginUserProfile ? (
                  <>
                  <Link to="/account/edit"><Button className="hover:bg-gray-700 h-8">Edit Profile</Button></Link>
                  </>
                ):(
                  isFriend ? (
                    <>
                    <Button className="bg-sky-500 h-8">Add Friend</Button>
                    </>
                  ):(
                    <>
                    <Button className="bg-sky-500 h-8">Add Friend</Button>
                    <Button className="bg-sky-500 h-8">message</Button>
                    </>
                  )
                  )
              }

              </div>
              <div className="flex items-center gap-4">
                <p><span className="font-semibold"> {userprofile?.post?.length} </span>posts</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{userprofile?.hobby || 'hobby here..'}</span>
                <Badge className="bg-slate-400 w-fit"><AtSign/> <span className="pl-1">{userprofile?.username}</span></Badge>
                <span>hello devs</span>
              </div>
            </div>
          </section>
        </div>
        <div className="">
          <div className="flex justify-center gap-10 text-sm border border-gray-200 rounded">
          <span onClick={()=>handleTabChange("post")} className={`cursor-pointer ${activeTab==='post'?'font-bold':''}`}>
                post
              </span>
              <span onClick={()=>handleTabChange("saved")} className={`cursor-pointer ${activeTab==='saved'?'font-bold':''}`}>
                Friends
              </span >
              {/* <span onClick={()=>handleTabChange("reels")} className={`cursor-pointer ${activeTab==='reels'?'font-bold':''}`}>
              saved
              </span>      */}
          </div>
          <div className="grid grid-cols-3 gap-1">
                {
                  displayedPost.map((post)=>{
                    console.log(post?.comments.length);
                    return(
                      <div key={post?._id} className='relative group cursor-pointer'>
                      <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                      <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        <div className='flex items-center text-white space-x-4'>
                          <button className='flex items-center gap-2 hover:text-gray-300'>
                            <Heart />
                            <span>{post?.likes.length}</span>
                          </button>
                          <button className='flex items-center gap-2 hover:text-gray-300'>
                            <MessageCircle />
                            <span>{post?.comments.length}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    )
                  })
                }
              </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

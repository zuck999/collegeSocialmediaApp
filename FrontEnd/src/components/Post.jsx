import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {  Heart, MessageCircle, Send, Share2, ThumbsUp } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import CommentDialog from "./commentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';





function Post({post}) {
  const altImg = "https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg";
    const [text,setText] = useState('');
    const [open ,setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const {posts} = useSelector(store=>store.post);
    const [liked , setLikd] = useState(post.likes.includes(user?._id) || false);
    const [postlike , setPostLike] = useState(post.likes.length);
    const [comment , setComments] = useState(post.comments);
    const dispatch = useDispatch();

    dayjs.extend(relativeTime);



    function changeEventHandler(event){
       const input = event.target.value
       if(input.trim()){
        setText(input);
       }else{
        setText('');
    }
    }
    
    async function deletePostHandler(){
      try {
        const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post._id}`,{withCredentials:true});
        if(res.data.success){
          const updatePostdata = posts.filter((postItem)=>postItem?._id!=post?._id);
          dispatch(setPosts(updatePostdata));
          toast.success(res.data.message);
        }
        
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }

    const commentsHandler = async() =>{
      try {
        const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`,{text},{
          headers:{
            "content-Type":"application/json"
          },
          withCredentials:true
        });
  
        if(res.data.success){
          const updatedCommentData = [...comment , res.data.comment];
          setComments(updatedCommentData);
          const updatedPostData = posts.map(p => p._id === post._id ? {...p,comments:updatedCommentData}:p
          );
          dispatch(setPosts(updatedPostData))
          toast.success(res.data.message);
          setText('');
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }

    async function likeDislikeHandler(){

      const action = liked?"dislike":"like";
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`,{withCredentials:true});
            if(res.data.success){
              const updatedLikes = liked? postlike -1 : postlike +1;
              setPostLike(updatedLikes);
              setLikd(!liked);
              toast.success(res.data.message);
              console.log(post)

              const updatePostData = post.map(p =>
                p._id == post._id ?{
                  ...p,likes:liked ? p.likes.filter(id => id != user._id):[...p.likes , user._id]
                }:p
              );
              dispatch(setPosts(updatePostData));
            }

        } catch (error) {
          console.log(error);
        }
    }
console.log(">>>>",post.createdAt);


  return (
    <>
<div className="w-full mx-auto bg-white mb-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
  
  {/* 1. HEADER AREA */}
  <div className="flex items-center justify-between p-4">
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 ring-2 ring-gray-50">
        <AvatarImage src={post.author?.profilepicture || altImg} alt="profile" />
        <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">CN</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${post?.author?._id}`}>
            <h1 className="font-bold text-gray-900 hover:underline">{post?.author?.username}</h1>
          </Link>
          {user?._id === post?.author?._id && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none px-2 py-0 text-[10px] uppercase tracking-wider font-bold">
              Author
            </Badge>
          )}
        </div>
        <span className="text-xs text-gray-400 font-medium">{dayjs(post.createdAt).fromNow()} • 🌎</span>
      </div>
    </div>

    {/* THREE DOTS MENU */}
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[300px] p-2 rounded-2xl">
        <div className="flex flex-col gap-1">
          {user?._id !== post?.author?._id && (
            <Button variant="ghost" className="w-full text-red-500 font-bold hover:bg-red-50">Unfriend</Button>
          )}
          {(user && (user?.username === "Admin" || user?._id === post?.author?._id)) && (
            <Button onClick={deletePostHandler} variant="ghost" className="w-full text-red-600 font-bold hover:bg-red-50">
              Delete Post
            </Button>
          )}
          <Button variant="ghost" className="w-full font-medium">Copy Link</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>

  {/* 2. IMAGE AREA */}
  <div className="bg-gray-50">
    <img
      src={post.image}
      className="w-full h-auto max-h-[600px] object-contain mx-auto"
      alt="post_content"
    />
  </div>

  {/* 3. CAPTION AREA */}
  <div className="px-4 pt-4 text-[15px] leading-relaxed">
     { post.caption.length > 0 ? <p className="text-gray-800">
      <span className="font-bold mr-2">{post.author?.username}</span>
      {post.caption || "  "}
    </p>:<div></div>}
  </div>

  {/* 4. STATS BAR */}
  <div className="flex items-center justify-between px-4 py-3">
    <div className="flex items-center -space-x-1">
      {/* Facebook style overlapping circles */}
      <div className="bg-blue-500 rounded-full p-1 border-2 border-white z-10">
        <ThumbsUp size={10} className="text-white fill-white" />
      </div>
      <div className="bg-red-500 rounded-full p-1 border-2 border-white">
        <Heart size={10} className="text-white fill-white" />
      </div>
      <span className="pl-3 text-sm text-gray-500 hover:underline cursor-pointer font-medium">
        {postlike} likes
      </span>
    </div>
    <div className="text-sm text-gray-500 hover:underline cursor-pointer font-medium" onClick={() => { dispatch(setSelectedPost(post)); setOpen(true); }}>
      {comment.length} comments
    </div>
  </div>

  {/* 5. INTERACTION BUTTONS */}
  <div className="px-4">
    <div className="flex items-center justify-around border-t border-gray-100 py-1">
      <button onClick={likeDislikeHandler} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-50 transition-all active:scale-95 group">
        <ThumbsUp size={20} className={`${liked ? "text-[#0866FF] fill-[#0867ffad]" : "text-gray-500 group-hover:text-gray-700"}`} />
        <span className={`text-sm font-bold ${liked ? "text-[#0866FF]" : "text-gray-500"}`}>Like</span>
      </button>

      <button onClick={() => { dispatch(setSelectedPost(post)); setOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-50 transition-all active:scale-95 group">
        <MessageCircle size={20} className="text-gray-500 group-hover:text-gray-700" />
        <span className="text-sm font-bold text-gray-500">Comment</span>
      </button>

    </div>
  </div>

  {/* 6. COMMENT INPUT BOX */}
  <div className="p-4 pt-2">
    <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 focus-within:border-blue-300 focus-within:bg-white transition-all shadow-inner">
      <input 
        type="text" 
        placeholder={`Comment as ${user?.username}...`} 
        onChange={changeEventHandler} 
        value={text} 
        className="flex-1 bg-transparent border-none outline-none text-[14px] text-gray-700 py-1"
      />
      {text && (
        <button onClick={commentsHandler} className="text-blue-600 font-bold text-sm hover:text-blue-700 active:scale-90 transition-all">
          Post
        </button>
      )}
    </div>
  </div>

  <CommentDialog open={open} setOpen={setOpen} post={post} />
</div>
    </>
  );
}

export default Post;

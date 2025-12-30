import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {  MessageCircle, Send } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import CommentDialog from "./commentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Badge } from "./ui/badge";
// import { Link } from "react-router-dom";




function Post({post}) {
  const altImg = "https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg";
    const [text,setText] = useState('');
    const [open ,setOpen] = useState(false);
    // const {user} = useSelector(store=>store.auth);
    // const {posts} = useSelector(store=>store.post);
    const [liked , setLikd] = useState(post.likes.includes(user?._id) || false);
    const [postlike , setPostLike] = useState(post.likes.length);
    const [comment , setComments] = useState(post.comments);
    const dispatch = useDispatch();


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



  return (
    <>
      <div className="my-8 w-full max-w-sm mx-auto pb-5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={post.author?.profilepicture  || altImg} alt="post_Image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex">
            {/* <Link to={`/profile/${post?.author?._id}`}>
            <h1 className="font-semibold mx-1 text-lg">{post?.author?.username}</h1>
            </Link> */}
            <h1 className="font-semibold mx-1 text-lg">{post?.author?.username}</h1>  {/*  use link */}
            

            {
              user?._id === post?.author?._id && <Badge variant='secondary' className="text-sm h-5 "> author</Badge> 
            }
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-center">

            {
            user?._id !== post?.author?._id && (<Button variant="ghost"className="cursor-pointer w-fit text-[#ED4956] font-bold">unfriend</Button>)
            }
              
              {/* {
                user && user?.id ===post?.author._id (<Button variant="ghost" className="cursor-pointer w-fit">
                  Delete
                </Button>)
              } */}


                {
                  (user && (user?.username === "Admin" || user?._id === post?.author?._id)) && (
                    <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit text-red-400">
                      Delete
                    </Button>
                  )
                }

            </DialogContent>
          </Dialog>
        </div>
        <img
          src={post.image}
          className="rounded-sm my-2 w-full aspect-square object-contain"
          alt="post_image"
        />

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {
              liked ?<FaHeart onClick={likeDislikeHandler} size={"22px"} className="cursor-Pointer text-red-600 "/> :  <FaRegHeart onClick={likeDislikeHandler} size={"22px"} className="cursor-Pointer hover:text-gray-600"/>
            }
            {/* <Heart onClick={likeDislikeHandler} size={"25px"} className="cursor-Pointer hover:text-gray-600"/> */}
            <MessageCircle  onClick={()=>{
              dispatch(setSelectedPost(post));
              setOpen(true) }} className="cursor-Pointer hover:text-gray-600" />
          </div>
        </div>
        {/* <div className="flex flex-row items-center  gap-4">
        <span  className="font-medium block ">{postlike} likes</span>
        <span onClick={()=>{
              dispatch(setSelectedPost(post));
              setOpen(true)}}  className=" cursor-pointer text-gray-500">{comment.length === 0 ? <> No comments yet   </>  :  <> view all {comment.length} comments</> }  </span>
        </div> */}
        <p>
            <span className="font-medium mr-2">{post.author?.username}</span>
            caption
        </p>
        {/* <CommentDialog open={open} setOpen={setOpen} post={post}/> */}
        
        <div className="flex justify-between items-center">
            <input type="text" placeholder="add a comment" onChange={changeEventHandler} value={text} className="outline-none text-sm w-full"/>
        {
            text && <span onClick={commentsHandler} className="text-[#3BADF8] cursor-pointer" >Post</span>
        }
        </div>

      </div>
    </>
  );
}

export default Post;

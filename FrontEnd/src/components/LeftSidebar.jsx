import { Bell,  Home, LogOut, MessageCircle, PlusSquare, Search , UserPen } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'




function LeftSideBar() {
    const nevicate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(store=>store.auth)//getting user from store


    const [open , setOpen] = useState(false);


    const logoutHandler = async()=>{
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout',{withCredentials:true});
            console.log("res>.",res)
            if(res.data.success){
                console.log("vitra");
                toast.success(res.data.message);
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                nevicate("/login");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    function sidebarHandler(textType){
        if(textType==="Logout"){logoutHandler()};
        if(textType==="Create Post"){ setOpen(true)};//dilague box of create post
        if(textType==="Profile"){ nevicate(`/Profile/${user._id}`)};
        if(textType==="Home"){ nevicate(`/`)};
        if(textType==="Edit user"){ nevicate(`/editUser`)};
        if(textType==="Message"){ nevicate(`/chat`)};
    }

    const [sidebarItems , setSidebarItems] = useState([
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <MessageCircle />, text: "Message" },
        { icon: <Bell />, text: "Notification" },
        { icon: <PlusSquare />, text: "Create Post" },
        {
            icon: (
                <Avatar className="w-7 h-7">
                    <AvatarImage
                        src={user?.profilePicture || "https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg"}
                    />
                    <AvatarFallback />
                </Avatar>
            ), text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ]);


    useEffect(() => {
        if (user.username === "Admin") {
            setSidebarItems([
                { icon: <Home />, text: "Home" },
                { icon: <UserPen />, text: "Edit user" },
                {
                    icon: (
                        <Avatar className="w-7 h-7">
                            <AvatarImage
                                src={user?.profilePicture || "https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg"}
                            />
                            <AvatarFallback />
                        </Avatar>
                    ), text: "Profile"
                },
                { icon: <LogOut />, text: "Logout" },
            ]);
        } else {
            setSidebarItems([
                { icon: <Home />, text: "Home" },
                { icon: <Search />, text: "Search" },
                { icon: <MessageCircle />, text: "Message" },
                { icon: <Bell />, text: "Notification" },
                { icon: <PlusSquare />, text: "Create Post" },
                {
                    icon: (
                        <Avatar className="w-7 h-7">
                            <AvatarImage
                                src={user?.profilePicture || "https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg"}
                            />
                            <AvatarFallback />
                        </Avatar>
                    ), text: "Profile"
                },
                { icon: <LogOut />, text: "Logout" },
            ]);
        }
    }, [user]);




  return (
    <>

<div className="flex flex-col h-full p-4">

      
      <div className="flex-1">
        {sidebarItems.map((item, index) => (
          <div 
            key={index} 
            onClick={() => sidebarHandler(item.text)} 
            className="flex items-center gap-3 my-2 font-semibold hover:bg-gray-100 cursor-pointer rounded-lg p-3 transition-all"
          >
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
      
      <CreatePost open={open} setOpen={setOpen}/>
    </div>

    </>
    
  )
}

export default LeftSideBar

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { MessageCircleDashedIcon, Send } from 'lucide-react';
import { Button } from './ui/button';
import { setSelectedUser } from '@/redux/authSlice';
import Messages from './Messages';
import { setMessages } from '@/redux/chatSlice';
import axios from 'axios';


function ChatPage() {
    const [textMessage , setTextMessage] = useState("");
    const {user , suggestedUsers , selectedUser} = useSelector(store=>store.auth);
    // const [isOnline,setIsOnline] = useState(true);
    const dispatch = useDispatch();
    const ADMIN_ID = import.meta.env.VITE_ADMIN_ID;


    const {onlineUsers , messages} = useSelector(store=>store.chat);

    console.log("online usere []>>",onlineUsers);

    async function sendMessageHandler(reciverId){
        console.log("click");
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${reciverId}`,{textMessage},{headers:{"Content-Type":"application/json"},withCredentials:true});
            if(res.data.success){
                console.log("works----------->>")
                dispatch(setMessages([...messages , res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        return ()=>{
            dispatch(setSelectedUser(null));//cleanup code after user go to home
        }
    },[]);
    console.log("suggestedusers>>>",suggestedUsers)

  return (
   
    <div className='flex h-full '>
        <section className='min-w-60 border border-r' >
            <div className='flex justify-center items-center h-16'>
                <h1 className='font-bold text-3 text-xl m-auto '>{user?.username}</h1>
            </div>

            <hr className='mb-4 border-gray-300'/>
            <div className='overflow-y-auto h-[80vh]'>
            {
            suggestedUsers
                .filter((user) => user._id !== ADMIN_ID)
                .map((suggesteduser) => {
                const isOnline = onlineUsers.includes(suggesteduser?._id);
                const isSelected = selectedUser?._id === suggesteduser?._id;

                return (
                    <div 
                    key={suggesteduser._id}
                    onClick={() => dispatch(setSelectedUser(suggesteduser))} 
                    className={`flex gap-3 p-3 items-center cursor-pointer transition-colors ${
                        isSelected ? "bg-red-50" : "hover:bg-zinc-100"
                    }`}>
                    {isSelected && <div className="absolute left-0 w-1 h-8 rounded-r-full" />}

                    <Avatar>
                        <AvatarImage src={suggesteduser?.profilePicture}/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                        <span className={`font-medium ${isSelected ? " " : "text-black"}`}>
                        {suggesteduser?.username}
                        </span>
                        <span className={`text-xs font-bold ${isOnline ? "text-green-600" : "text-red-600"}`}>
                        {isOnline ? "online" : "offline"}
                        </span>
                    </div>
                    </div>
                )
                })
            }
            </div>
        </section>
        {
            selectedUser ?(
                <section className='flex-1  flex flex-col h-full'>
                    <div  className=' flex gap-3 items-center p-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                        <Avatar>
                            <AvatarImage src={selectedUser?.profilePicture} alt="profile"/>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <span className='flex flex-col'>{selectedUser?.username}</span>
                        </div>
                    </div>
                    <Messages selectedUser={selectedUser}/>
                    <div className='flex items-center p-4 border-t border-t-gray-300 '>
                        <Input 
                            value={textMessage} 
                            onChange={(e) => setTextMessage(e.target.value)} 
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && textMessage.trim() !== "") {
                                    sendMessageHandler(selectedUser?._id);
                                }
                            }}
                            type="text" 
                            className="flex-1 mr-2 focus-visible:ring-transparent" 
                            placeholder="messages..."
                        />
                        <Button onClick={() => sendMessageHandler(selectedUser?._id)} className="bg-blue-500 hover:bg-blue-400">Send <Send className='hover:bg-current'/></Button>
                    </div>
                </section>
            ):(
                <div className=' flex flex-col items-center justify-center mx-auto '>
                    <MessageCircleDashedIcon className='w-32 h-32 my-4'/>
                    <h1 className='font-medium text-xl'>your messages</h1>
                    <span>send a message to start a chat.</span>
                </div>
            )
        }
    </div>
  )
}

export default ChatPage;
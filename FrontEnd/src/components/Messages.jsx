import React, { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllmessages from '@/hooks/useGetAllmessages'
import useGetRTM from '@/hooks/UseGetRTM'

function Messages({selectedUser}) {
    const scrollRef = useRef(null);
    useGetRTM();
    useGetAllmessages();
    const {messages} = useSelector(store=>store.chat);
    const {user} = useSelector(store=>store.auth);

    useEffect(() => {
        if (scrollRef.current) {//web api--
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

  return (
    <div className='overflow-y-auto flex-1 p-4 scrollbar-hide '>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center'>
                <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedUser?.profilePicture} alt='profilePecture'/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button className="h-8 my-2" variant="secondary">view profile</Button>
                    </Link>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                { 
                  messages && messages.map((msg) => {
                        return (
                            <div key={msg._id} className={`flex ${msg.senderId === user?._id ? "justify-end":"justify-start"}`}>
                                    <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? "bg-blue-500 text-white":"bg-gray-200 text-black"}`}>
                                        {msg.message}
                                    </div>
                            </div>
                        )
                    })
                }
                <div ref={scrollRef} />
            </div>
    </div>
  )
}

export default Messages
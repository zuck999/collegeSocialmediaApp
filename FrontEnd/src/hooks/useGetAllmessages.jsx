import { setMessages } from '@/redux/chatSlice';
import { setPosts } from '@/redux/postSlice';
import axios from 'axios';
import  { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function useGetAllmessages() {

    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.auth);
    useEffect(()=>{
        
        async function fetchAllMessage(){
            try {
            const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true});
            console.log("res.data------------->",res.data)
            if(res.data.success){
                console.log("allPostHook res>>>",res);
                dispatch(setMessages(res.data.messages));
            }
            
        } catch (error) {

                console.log(error);
        }
    }
    fetchAllMessage();
    },[selectedUser]);

}

export default useGetAllmessages


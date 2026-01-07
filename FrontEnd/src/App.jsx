import Signup from './components/Signup';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import Mainlayout from './components/Mainlayout';
import Login from './components/login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import EditUser from './components/EditUser';
import ReduxTest from './components/reduxTest';
import ChatPage from './components/ChatPage';

import {io} from "socket.io-client"
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';



const brousingRouter = createBrowserRouter([
  {
    path:"/",
    element:<Mainlayout/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },{
        path:'/profile/:id',
        element:<Profile/>
      },{
        path:'/account/edit',
        element:<EditProfile/>
      },{
        path:'/editUser',
        element:<EditUser/>
      },{
        path:'/redux/:id',
        element:<ReduxTest/>
      },{
        path:'/chat',
        element:<ChatPage/>
      }
    ]
  },
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:'/login',
    element:<Login/>
  }
]);


function App() {
  const {user} = useSelector(store => store.auth);
  const {socket} = useSelector(store=>store.socketio);
  const dispatch = useDispatch();


  useEffect(()=>{
    if(user){
      const socketio = io("http://localhost:8000",{
        query:{
          userId:user?._id
        },
        transports:['websocket']
      });
      dispatch(setSocket(socketio));
      
      //listning all event       baki----
      
      console.log("---------------------online user<><><>")//printing
      socketio.on('getOnlineUser',(onlineUser)=>{
      console.log("---------------------online user<>--<>")//not printing why
        dispatch(setOnlineUsers(onlineUser));
      });

      return ()=>{//cleanUp   
        socketio.close();
        dispatch(setSocket(null));
      }
    }else if(socket){
        socket?.close();
        dispatch(setSocket(null));
    }

  },[user , dispatch]);//10:53:11


  return (

    <div>
      
      <RouterProvider router={brousingRouter}/> 

    </div>
    
  )
}

export default App

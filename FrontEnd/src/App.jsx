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


  return (
    <div>
      
      <RouterProvider router={brousingRouter}/> 

    </div>
    
  )
}

export default App

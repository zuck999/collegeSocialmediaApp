import React from 'react'
import { useSelector } from 'react-redux';
import Post from './Post';


function Posts() {

  const {posts} = useSelector(store => store.post);

  return (
    <>

      <div className='w-full'>
        {
         posts.map((post)=><Post key={post._id} post={post} />)
        }
      </div>

    </>
  )
}

export default Posts;

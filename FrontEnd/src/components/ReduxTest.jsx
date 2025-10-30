import React from 'react'
import { useSelector } from 'react-redux';
import SuggestedUsers from './SuggestedUsers';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';


function ReduxTest() {
  const { user } = useSelector(store=>store.auth);
  const params = useParams();
  const userId = params.id;

  return (
        <div className='flex justify-center items-center h-[100vh] '>
            <Button className="border rounded-xl px-3">
                {userId}
            </Button>
        </div>
  )
}

export default ReduxTest;

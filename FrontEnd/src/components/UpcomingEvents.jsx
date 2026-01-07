import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'

function UpcomingEvents() {
  return (
    <div className="bg-white w-full max-h-[60vh] flex flex-col rounded-lg">


      <div className="text-md font-medium p-2 sticky top-0 z-10">
        Upcoming events
      </div>

      <div className="flex-1 overflow-y-auto">
        {[1,2,3,4,5,6,7,8,9].map((event) => (
          <div
            key={event}
            className="flex items-center p-2 border-b gap-x-2"
          >
            <Avatar className="h-10 w-10 ring-2 ring-gray-50">
                 {/* <AvatarImage src={post.author?.profilepicture || altImg} alt="profile" /> */}
              <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                CN
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="text-lg">BCA Cup</div>
              <div className="text-gray-500 text-sm">Feb 22</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default UpcomingEvents

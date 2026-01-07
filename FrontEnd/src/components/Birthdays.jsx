import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'

function Birthdays() {
  return (
      <div className="bg-white w-full max-h-[60vh] flex flex-col rounded-lg overflow-y-hidden">

        {/* Header */}
        <div className="text-md font-medium p-2 shrink-0 border-b bg-white z-10">
          Birthdays
        </div>

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto">
          {[1,2,3,4,5,6,7,8,9].map((event) => (
            <div
              key={event}
              className="flex items-center p-2 border-b gap-x-2"
            >
              <Avatar className="h-10 w-10 ring-2 ring-gray-50">
                <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                  CN
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="text-lg">Sagar Panta</div>
                <div className="text-gray-500 text-sm">Turning 21 years old</div>
              </div>
            </div>
          ))}
        </div>

      </div>

  )
}

export default Birthdays

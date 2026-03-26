import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Loader2, Cake, PartyPopper } from 'lucide-react'

function Birthdays() {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/user/birthdays', { withCredentials: true });
        if (res.data.success) {
          setBirthdays(res.data.birthdays);
        }
      } catch (err) {
        console.error("Birthday fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBirthdays();
  }, []);

  // Helper to check if a date (string) is today
  const isToday = (dateString) => {
    if (!dateString) return false;
    const birthday = new Date(dateString);
    const today = new Date();
    return (
      birthday.getDate() === today.getDate() &&
      birthday.getMonth() === today.getMonth()
    );
  };

  // Helper to format date for the badge (e.g., "Mar 28")
  const formatDateBadge = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white w-full h-full flex flex-col rounded-lg border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="text-[11px] font-black p-4 border-b bg-gray-50/50 flex items-center justify-between text-gray-500 uppercase tracking-[0.15em]">
        Upcoming Birthdays
        <Cake className="h-4 w-4 " />
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-blue-500 h-6 w-6" />
          </div>
        ) : birthdays.length > 0 ? (
          birthdays.map((user) => {
            const celebratingToday = isToday(user.date);

            return (
              <div
                key={user._id}
                className={`flex items-center p-3 border-b last:border-0 gap-x-3 transition-all relative ${
                  celebratingToday 
                  ? "bg-green-50/40 border-l-4 border-l-green-500" 
                  : "hover:bg-gray-50/50"
                }`}
              >
                {/* Avatar with dynamic ring */}
                <Avatar className={`h-10 w-10 ring-2 ${
                  celebratingToday ? "ring-green-500 animate-pulse" : "ring-pink-50"
                }`}>
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback className={`${
                    celebratingToday ? "bg-green-100 text-green-700" : "bg-pink-100 text-pink-600"
                  } font-bold text-xs`}>
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${celebratingToday ? "text-green-800" : "text-gray-900"}`}>
                      {user.username}
                      {celebratingToday && <PartyPopper className="inline-block h-3 w-3 ml-1 text-green-600" />}
                    </span>
                    {/* Date Badge */}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        celebratingToday ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                        {formatDateBadge(user.date)}
                    </span>
                  </div>
                  <div className="text-gray-500 text-[11px] font-medium leading-none mt-1">
                    Turning <span className="font-bold">{user.nextAge}</span> years old
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center text-gray-400 text-xs italic">
            No upcoming birthdays.
          </div>
        )}
      </div>
    </div>
  )
}

export default Birthdays;